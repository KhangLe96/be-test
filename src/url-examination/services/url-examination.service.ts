import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import mockData from '~url-examination/data/data.json';
import { UrlExaminationDto } from '~url-examination/http/dto/url-examination.dto';
import { UrlInfoType } from '~url-examination/types/url-info.type';
import { MAX_RETRY_NUMBER, REQUEST_TIMEOUT } from '~url-examination/constants/url-examination.constant';

@Injectable()
export class UrlExaminationService {
    private readonly logger = new Logger();

    constructor(private httpService: HttpService) {}

    async examineUrls({ priority }: UrlExaminationDto): Promise<UrlInfoType[]> {
        const urlsInfo: UrlInfoType[] = this.getData();
        const filteredUrlsInfo =
            priority !== undefined ? urlsInfo.filter((item) => item.priority === priority) : urlsInfo;

        const reachableUrls = (await Promise.all(filteredUrlsInfo.map((urlInfo) => this.examineUrl(urlInfo)))).filter(
            (urlInfo) => urlInfo
        );

        return reachableUrls.sort((a, b) => (a.priority > b.priority ? 1 : -1));
    }

    getData(): UrlInfoType[] {
        return mockData;
    }

    private async examineUrl(urlInfo: UrlInfoType, retriedTimes: number = 0): Promise<UrlInfoType> {
        const onlineStatusRange = { min: 200, max: 299 };

        try {
            const response = await this.httpService.axiosRef.get(urlInfo.url, { timeout: REQUEST_TIMEOUT });
            if (response.status >= onlineStatusRange.min && response.status <= onlineStatusRange.max) {
                return urlInfo;
            }
        } catch (error) {
            if (!error.isAxiosError) {
                throw error;
            }
            // retry if timeout
            if (error.code === 'ECONNABORTED' && retriedTimes < MAX_RETRY_NUMBER) {
                this.logger.log(`Retrying to request to ${urlInfo.url}... ${retriedTimes + 1}`);
                await this.examineUrl(urlInfo, ++retriedTimes);

                return;
            }

            this.logger.warn(`${error.config.url}::${error.code}::${error.message}`, UrlExaminationService.name);
            return;
        }
    }
}
