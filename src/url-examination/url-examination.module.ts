import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UrlExaminationController } from '~url-examination/http/controllers/url-examination.controller';
import { UrlExaminationService } from '~url-examination/services/url-examination.service';

@Module({
    imports: [HttpModule],
    controllers: [UrlExaminationController],
    providers: [UrlExaminationService]
})
export class UrlExaminationModule {}
