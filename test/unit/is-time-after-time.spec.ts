import { isTimeEqualOrAfterAnotherTime } from '@rest/utils/time';

describe('Time range check', () => {
    test('time is after the other time', () => {
        expect(isTimeEqualOrAfterAnotherTime('10:00', '09:00')).toBe(true);
    });

    test('time is NOT after the other time', () => {
        expect(isTimeEqualOrAfterAnotherTime('08:00', '09:00')).toBe(false);
    });

    test('time is EQUAL after the other time', () => {
        expect(isTimeEqualOrAfterAnotherTime('09:00', '09:00')).toBe(true);
    });
});
