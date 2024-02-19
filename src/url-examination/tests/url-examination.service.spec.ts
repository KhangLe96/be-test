import { HttpStatus } from '@nestjs/common';
import { UrlExaminationService } from '~url-examination/services/url-examination.service';
import { UrlExaminationServiceMock } from '~url-examination/tests/mocks/url-examination-service.mock';
import { TestHelper } from '~core/tests/test.helper';
import { UrlInfoType } from '~url-examination/types/url-info.type';
import { UrlExaminationTestHelper } from '~url-examination/tests/url-examination-test.helper';

jest.mock('axios');

describe('UrlExaminationService', () => {
    const testHelper = new TestHelper();
    let urlExaminationService: UrlExaminationService;
    let urlExaminationTestHelper: UrlExaminationTestHelper;
    let mockData: UrlInfoType[] = [];

    beforeAll(async () => {
        await testHelper.initialize((builder) => {
            builder.overrideProvider(UrlExaminationService).useClass(UrlExaminationServiceMock);
            return builder;
        });
        urlExaminationService = await testHelper.getService(UrlExaminationService);
        urlExaminationTestHelper = testHelper.getTestHelperModule(UrlExaminationTestHelper);
        mockData = urlExaminationService.getData();
    });

    afterAll(async () => {
        await testHelper.close();
    });

    it('Gets reachable urls successfully without filtering priority', async () => {
        await urlExaminationTestHelper.mockRequestsBasedOnData(mockData);

        const result = await urlExaminationService.examineUrls({});

        expect(result.length).toStrictEqual(2);
        expect(result[0].url).toStrictEqual('http://app.scnt.me');
    });

    it('Gets reachable urls successfully in the correct order', async () => {
        await urlExaminationTestHelper.mockRequestsBasedOnData(mockData);

        const result = await urlExaminationService.examineUrls({});

        expect(result.length).toStrictEqual(2);
        expect(result[0].priority).toBeLessThan(result[1].priority);
    });

    it('Gets reachable urls successfully with filtering priority', async () => {
        await urlExaminationTestHelper.mockRequestsBasedOnData(mockData.filter((item) => item.priority === 3));
        const result = await urlExaminationService.examineUrls({ priority: 3 });

        expect(result.length).toStrictEqual(1);
        expect(result[0].url).toStrictEqual('https://github.com');
        expect(result[0].priority).toStrictEqual(3);
    });

    it('Returns an empty array since no urls are reachable', async () => {
        await urlExaminationTestHelper.mockAllRequests(HttpStatus.NOT_FOUND);

        const result = await urlExaminationService.examineUrls({ priority: 3 });

        expect(result.length).toStrictEqual(0);
    });
});
