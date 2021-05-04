import dayjs from 'dayjs';

export function validateTimeFormat(time: string): boolean {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    return regex.test(time);
}

export function isTimeEqualOrAfterAnotherTime(firstTime, secondTime): boolean {
    const d1 = dayjs(`2001-01-01 ${firstTime}`);
    const d2 = dayjs(`2001-01-01 ${secondTime}`);

    return d1.isSame(d2) || d1.isAfter(d2);
}

export function isTimeInTimeRange(time, startTime, endTime): boolean {
    const d = dayjs(`2001-01-01 ${time}`);
    const dStart = dayjs(`2001-01-01 ${startTime}`);
    const dEnd = dayjs(`2001-01-01 ${endTime}`);

    return (d.isSame(dStart) || d.isAfter(dStart)) && (d.isSame(dEnd) || d.isBefore(dEnd));
}
