import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { INestApplication, Type, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '~app.module';

export class TestHelper {
    public app: INestApplication;
    public httpService: any;
    private moduleFixture: TestingModule;
    private testHelperModules: { [_: string]: any } = {};

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

    getTestHelperModule<T>(testHelperModule: new (t: TestHelper) => T): T {
        if (!this.testHelperModules[testHelperModule.name]) {
            this.testHelperModules[testHelperModule.name] = new testHelperModule(this);
        }
        return this.testHelperModules[testHelperModule.name];
    }

    get(url: string): request.Test {
        return (request as any)(this.httpService).get(url);
    }
}
