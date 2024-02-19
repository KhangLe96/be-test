import { HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UrlExaminationService } from '~url-examination/services/url-examination.service';
import { UrlExaminationServiceMock } from '~url-examination/tests/mocks/url-examination-service.mock';
import { TestHelper } from '~core/tests/test.helper';

jest.mock('axios');

describe('UrlExaminationService', () => {
    const testHelper = new TestHelper();
    let urlExaminationService: UrlExaminationService;
    let httpService: HttpService;

    beforeAll(async () => {
        await testHelper.initialize((builder) => {
            builder.overrideProvider(UrlExaminationService).useClass(UrlExaminationServiceMock);
            return builder;
        });
        urlExaminationService = await testHelper.getService(UrlExaminationService);
        httpService = await testHelper.getService(HttpService);
    });

    afterAll(async () => {
        await testHelper.close();
    });

    it('Gets reachable urls successfully without filtering priority', async () => {
        (httpService.axiosRef.get as jest.MockedFunction<typeof httpService.axiosRef.get>)
            .mockResolvedValueOnce({
                status: HttpStatus.BAD_REQUEST
            })
            .mockResolvedValueOnce({
                status: HttpStatus.NOT_FOUND
            })
            .mockResolvedValueOnce({
                status: HttpStatus.OK
            })
            .mockResolvedValueOnce({
                status: HttpStatus.OK
            });

        const result = await urlExaminationService.examineUrls({});

        expect(result.length).toStrictEqual(2);
        expect(result[0].url).toStrictEqual('http://app.scnt.me');
    });

    it('Gets reachable urls successfully in the correct order', async () => {
        (httpService.axiosRef.get as jest.MockedFunction<typeof httpService.axiosRef.get>)
            .mockResolvedValueOnce({
                status: HttpStatus.BAD_REQUEST
            })
            .mockResolvedValueOnce({
                status: HttpStatus.NOT_FOUND
            })
            .mockResolvedValueOnce({
                status: HttpStatus.OK
            })
            .mockResolvedValueOnce({
                status: HttpStatus.OK
            });

        const result = await urlExaminationService.examineUrls({});

        expect(result.length).toStrictEqual(2);
        expect(result[0].priority).toBeLessThan(result[1].priority);
    });

    it('Gets reachable urls successfully with filtering priority', async () => {
        // only mock 2 requests since only 2 requests have priority equal to 3
        (httpService.axiosRef.get as jest.MockedFunction<typeof httpService.axiosRef.get>)
            .mockResolvedValueOnce({
                status: HttpStatus.NOT_FOUND
            })
            .mockResolvedValueOnce({
                status: HttpStatus.OK
            });
        const result = await urlExaminationService.examineUrls({ priority: 3 });

        expect(result.length).toStrictEqual(1);
        expect(result[0].url).toStrictEqual('https://github.com');
        expect(result[0].priority).toStrictEqual(3);
    });

    it('Returns an empty array since no urls are reachable', async () => {
        (httpService.axiosRef.get as jest.MockedFunction<typeof httpService.axiosRef.get>).mockResolvedValue({
            status: HttpStatus.BAD_REQUEST
        });

        const result = await urlExaminationService.examineUrls({ priority: 3 });

        expect(result.length).toStrictEqual(0);
    });
});
