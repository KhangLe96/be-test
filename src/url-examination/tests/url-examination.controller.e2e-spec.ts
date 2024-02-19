import { HttpStatus } from '@nestjs/common';
import { has } from 'lodash';
import { HttpService } from '@nestjs/axios';
import { UrlInfoType } from '~url-examination/types/url-info.type';
import { TestHelper } from '~core/tests/test.helper';

jest.mock('axios');

describe('UrlExaminationController (e2e)', () => {
    const testHelper = new TestHelper();
    let httpService: HttpService;

    beforeAll(async () => {
        await testHelper.initialize();
        httpService = await testHelper.getService(HttpService);
    });

    afterAll(async () => {
        await testHelper.close();
    });

    it('Gets reachable urls successfully without filtering priority', () => {
        (httpService.axiosRef.get as jest.MockedFunction<typeof httpService.axiosRef.get>).mockResolvedValue({
            status: HttpStatus.OK
        });
        return testHelper
            .get('/url-examination')
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(has(res.body[0], 'url')).toStrictEqual(true);
            });
    });

    it('Gets reachable urls successfully with filtering priority', () => {
        (httpService.axiosRef.get as jest.MockedFunction<typeof httpService.axiosRef.get>).mockResolvedValue({
            status: HttpStatus.OK
        });
        return testHelper
            .get('/url-examination?priority=4')
            .expect(HttpStatus.OK)
            .expect((res) => {
                const firstValue: UrlInfoType = res.body[0];
                expect(has(firstValue, 'url')).toStrictEqual(true);
                expect(firstValue.priority).toStrictEqual(4);
            });
    });

    it('Returns an empty array since no urls are reachable', () => {
        (httpService.axiosRef.get as jest.MockedFunction<typeof httpService.axiosRef.get>).mockResolvedValue({
            status: HttpStatus.NOT_FOUND
        });
        return testHelper
            .get('/url-examination')
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.lengh === 0);
            });
    });

    it('Returns 404 because of a wrong query', () => {
        return testHelper.get('/url-examination?wrongQuery=4').expect(HttpStatus.BAD_REQUEST);
    });

    it('Returns 404 because the value of priority is not a number', () => {
        return testHelper.get('/url-examination?priority=abc').expect(HttpStatus.BAD_REQUEST);
    });
});
