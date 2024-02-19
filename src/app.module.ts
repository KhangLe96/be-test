import { Module } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from '~app.controller';
import { UrlExaminationModule } from '~url-examination/url-examination.module';
import { throttlerConfig } from '~config/throttler.config';

@Module({
    imports: [UrlExaminationModule, throttlerConfig],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
