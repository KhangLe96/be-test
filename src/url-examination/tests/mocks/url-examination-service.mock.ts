import { Injectable } from '@nestjs/common';
import { UrlExaminationService } from '~url-examination/services/url-examination.service';
import { UrlInfoType } from '~url-examination/types/url-info.type';

@Injectable()
export class UrlExaminationServiceMock extends UrlExaminationService {
    getData(): UrlInfoType[] {
        return [
            { url: 'https://does-not-work.perfume.new', priority: 1 },
            { url: 'https://doesnt-work.github.com', priority: 3 },
            { url: 'https://github.com', priority: 3 },
            { url: 'http://app.scnt.me', priority: 2 }
        ];
    }
}
