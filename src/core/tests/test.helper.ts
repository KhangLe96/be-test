import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { INestApplication, Type, ValidationPipe } from '@nestjs/common';
import request, { CallbackHandler } from 'supertest';
import { AppModule } from '~app.module';

export class TestHelper {
    public app: INestApplication;
    public httpService: any;
    private moduleFixture: TestingModule;

    async initialize(overrideBuilder?: (builder: TestingModuleBuilder) => TestingModuleBuilder): Promise<void> {
        let moduleBuilder = Test.createTestingModule({
            imports: [AppModule]
        });
        if (overrideBuilder) {
            moduleBuilder = overrideBuilder(moduleBuilder);
        }
        this.moduleFixture = await moduleBuilder.compile();

        this.app = this.moduleFixture.createNestApplication();
        this.app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true
            })
        );
        await this.app.init();

        this.httpService = this.app.getHttpServer();
    }

    async close(): Promise<void> {
        await this.app.close();
    }

    getService<T>(service: Type<T>): Promise<T> {
        return this.moduleFixture.get(service, { strict: false });
    }

    get(url: string, callback?: CallbackHandler): request.Test {
        return request(this.httpService).get(url, callback);
    }
}
