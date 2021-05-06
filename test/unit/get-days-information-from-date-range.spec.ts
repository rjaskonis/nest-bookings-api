import { getDayInformationFromDateRange } from '@rest/utils/datetime';
import dayjs from 'dayjs';

it('should get days information from date range', () => {
    const d1 = dayjs('2021-05-01', 'YYYY-MM-DD').toDate();
    const d2 = dayjs('2021-05-05', 'YYYY-MM-DD').toDate();

    const daysInformation = getDayInformationFromDateRange(d1, d2);

    expect(daysInformation.length).toBe(5);
});
