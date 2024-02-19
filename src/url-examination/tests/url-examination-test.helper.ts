import { HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TestHelper } from '~core/tests/test.helper';
import { UrlInfoType } from '~url-examination/types/url-info.type';

export class UrlExaminationTestHelper {
    constructor(private testHelper: TestHelper) {}

    async mockRequestsBasedOnData(data: UrlInfoType[]): Promise<void> {
        const httpService: HttpService = await this.testHelper.getService(HttpService);

        const mockRequest = httpService.axiosRef.get as jest.MockedFunction<typeof httpService.axiosRef.get>;
        for (const item of data) {
            mockRequest.mockResolvedValueOnce(
                Promise.resolve({
                    status: item.isReachable ? HttpStatus.OK : HttpStatus.NOT_FOUND
                })
            );
        }
    }

    async mockAllRequests(status: HttpStatus): Promise<void> {
        const httpService: HttpService = await this.testHelper.getService(HttpService);

        (httpService.axiosRef.get as jest.MockedFunction<typeof httpService.axiosRef.get>).mockResolvedValue(
            Promise.resolve({ status })
        );
    }
}
