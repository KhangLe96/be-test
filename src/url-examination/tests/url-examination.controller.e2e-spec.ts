import { HttpStatus } from '@nestjs/common';
import { has } from 'lodash';
import { UrlInfoType } from '~url-examination/types/url-info.type';
import { TestHelper } from '~core/tests/test.helper';
import { UrlExaminationTestHelper } from '~url-examination/tests/url-examination-test.helper';
import { UrlExaminationService } from '~url-examination/services/url-examination.service';
import { UrlExaminationServiceMock } from '~url-examination/tests/mocks/url-examination-service.mock';

jest.mock('axios');

describe('UrlExaminationController (e2e)', () => {
    const testHelper = new TestHelper();
    let urlExaminationTestHelper: UrlExaminationTestHelper;

    beforeAll(async () => {
        await testHelper.initialize((builder) => {
            builder.overrideProvider(UrlExaminationService).useClass(UrlExaminationServiceMock);
            return builder;
        });

        urlExaminationTestHelper = testHelper.getTestHelperModule(UrlExaminationTestHelper);
    });

    afterAll(async () => {
        await testHelper.close();
    });

    it('Gets reachable urls successfully without filtering priority', async () => {
        await urlExaminationTestHelper.mockAllRequests(HttpStatus.OK);
        return testHelper
            .get('/url-examination')
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(has(res.body[0], 'url')).toStrictEqual(true);
            });
    });

    it('Gets reachable urls successfully with filtering priority', async () => {
        await urlExaminationTestHelper.mockAllRequests(HttpStatus.OK);
        return testHelper
            .get('/url-examination?priority=3')
            .expect(HttpStatus.OK)
            .expect((res) => {
                const firstValue: UrlInfoType = res.body[0];
                expect(has(firstValue, 'url')).toStrictEqual(true);
                expect(firstValue.priority).toStrictEqual(3);
            });
    });

    it('Returns an empty array since no urls are reachable', async () => {
        await urlExaminationTestHelper.mockAllRequests(HttpStatus.NOT_FOUND);
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
