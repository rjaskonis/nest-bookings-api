import { isTimeInTimeRange } from '@rest/utils/datetime';

describe('Time range check', () => {
    test('time is not in time range', () => {
        expect(isTimeInTimeRange('08:00', '09:00', '10:00')).toBe(false);
        expect(isTimeInTimeRange('09:00', '09:01', '10:00')).toBe(false);
    });

    test('time is in time range', () => {
        expect(isTimeInTimeRange('09:00', '09:00', '10:00')).toBe(true);
        expect(isTimeInTimeRange('09:01', '09:00', '10:00')).toBe(true);
        expect(isTimeInTimeRange('10:00', '09:00', '10:00')).toBe(true);
    });
});
