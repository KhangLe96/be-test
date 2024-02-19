import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UrlExaminationService } from '~url-examination/services/url-examination.service';
import { UrlExaminationDto } from '~url-examination/http/dto/url-examination.dto';

@Controller('url-examination')
@ApiTags('Url Examination')
export class UrlExaminationController {
    constructor(private urlExaminationService: UrlExaminationService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    examineUrls(@Query() dto: UrlExaminationDto) {
        return this.urlExaminationService.examineUrls(dto);
    }
}
