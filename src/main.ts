import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { convertToRegexWhiteList } from '~core/helpers/array.helper';
import { env } from '~config/env.config';
import 'winston-daily-rotate-file';
import { loggerConfig } from '~config/logger.config';
import { AppModule } from '~app.module';

function initPipes(app: NestExpressApplication) {
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
        })
    );
}

function initSwagger(app: NestExpressApplication) {
    const config = new DocumentBuilder().setTitle('Api documents').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}

function initCors(app: NestExpressApplication) {
    const regexWhiteListDomains = convertToRegexWhiteList(env.WHITELIST_DOMAINS);

    app.enableCors({
        origin: function (requestOrigin, callback) {
            if (!requestOrigin) {
                return callback(null, true);
            }

            requestOrigin = requestOrigin.replace('https://', '').replace('http://', '');
            const isValidOrigin = regexWhiteListDomains.some((item) => item.test(requestOrigin));
            if (isValidOrigin) {
                return callback(null, true);
            }

            return callback(new BadRequestException(`No CORS allowed. Origin: ${requestOrigin}`), false);
        }
    });
}

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: loggerConfig
    });

    app.use(helmet());
    app.use(compression());

    initPipes(app);
    initSwagger(app);
    initCors(app);

    await app.listen(3000);
}

bootstrap();
