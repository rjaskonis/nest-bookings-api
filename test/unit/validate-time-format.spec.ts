import { validateTimeFormat } from '@/rest/utils/datetime';

describe('Time format validation', () => {
    it('should validate input string in time format', () => {
        expect(validateTimeFormat('08:00')).toBe(true);
    });

    it('should invalidate input string in time format', () => {
        expect(validateTimeFormat('0800')).toBe(false);
        expect(validateTimeFormat('25:00')).toBe(false);
        expect(validateTimeFormat('23:60')).toBe(false);
    });
});
