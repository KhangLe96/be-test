import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UrlExaminationService } from '~url-examination/services/url-examination.service';
import { UrlExaminationDto } from '~url-examination/http/dto/url-examination.dto';

@Controller('url-examination')
@ApiTags('Url Examination')
export class UrlExaminationController {
    constructor(private urlExaminationService: UrlExaminationService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Get reachable urls' })
    @ApiQuery({ name: 'priority', description: 'The priority is used to filter urls', required: false, type: 'number' })
    examineUrls(@Query() dto: UrlExaminationDto) {
        return this.urlExaminationService.examineUrls(dto);
    }
}
