import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

dayjs.locale('pt-br');

export function validateTimeFormat(time: string): boolean {
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

    return regex.test(time);
}

export function validateTimeSpecification(time: string): boolean {
    // only able to define half or full hour
    const regex = /^([0-1][0-9]|2[0-3]):(0|3)0$/;

    return regex.test(time);
}

export function validateDatetimeFormat(datetime: string): boolean {
    const regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

    return regex.test(datetime);
}

export function validateDatetimeSpecification(datetime: string): boolean {
    // only able to define half or full hour
    const regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):((0|3)0)$/;

    return regex.test(datetime);
}

export function parseDate(datetime: string): Date {
    return dayjs(datetime, 'YYYY-MM-DD HH:mm').toDate();
}

export function parseDateToTimeString(datetime: Date): string {
    return dayjs(datetime).format('HH:mm');
}

export function isDatetimeEqualAnotherTime(firstDate, secondDate): boolean {
    const d1 = dayjs(firstDate);
    const d2 = dayjs(secondDate);

    return d1.isSame(d2);
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

export function addTimeToDatetime(date, value, unit) {
    return dayjs(date).add(value, unit).toDate();
}

export function addTimeToTime(time, value, unit) {
    return dayjs(`2001-01-01 ${time}`).add(value, unit).format('HH:mm');
}
