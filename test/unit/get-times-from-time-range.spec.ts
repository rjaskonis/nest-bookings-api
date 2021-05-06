import { getTimesFromTimeRange } from '@rest/utils/datetime';

it('should get times time range', () => {
    const times = getTimesFromTimeRange('07:30', '12:00');

    console.log(times);

    expect(times.length).toBeGreaterThan(0);
});
