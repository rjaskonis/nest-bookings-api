import dayjs from 'dayjs';
import { parseDate } from '@rest/utils/datetime';

describe('Parse date', () => {
    it('should parse date correctly', () => {
        const parsedDate = parseDate('2020-01-01 20:30');

        expect(dayjs(parsedDate).format('HH:mm')).toBe('20:30');
    });
});
