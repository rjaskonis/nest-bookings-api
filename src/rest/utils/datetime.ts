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

export function validateDateFormat(date: string): boolean {
    const regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

    return regex.test(date);
}

export function validateDatetimeSpecification(datetime: string): boolean {
    // only able to define half or full hour
    const regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):((0|3)0)$/;

    return regex.test(datetime);
}

export function parseDate(datetime: string): Date {
    return dayjs(datetime, datetime.length === 16 ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD').toDate();
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
interface DayInformation {
    dayOfWeek: number;
    date: Date;
}

export function getDayInformationFromDateRange(fromDate, toDate): DayInformation[] {
    const daysInformation: DayInformation[] = [];

    const fd = dayjs(fromDate);
    const td = dayjs(toDate);

    const totalDays = td.diff(fd, 'day');

    daysInformation.push({ dayOfWeek: fd.day(), date: fd.toDate() });

    for (let i = 1; i < totalDays; i++) {
        const nextDate = fd.add(i, 'day');
        daysInformation.push({ dayOfWeek: nextDate.day(), date: nextDate.toDate() });
    }

    daysInformation.push({ dayOfWeek: td.day(), date: td.toDate() });

    return daysInformation;
}

export function getTimesFromTimeRange(fromTime, toTime, minutesOffset = 30) {
    const d1 = dayjs(`2001-01-01 ${fromTime}`);
    const d2 = dayjs(`2001-01-01 ${toTime}`);

    const points = [];

    let finalTime = d1;
    let offsetCount = 0;

    points.push(d1.format('HH:mm'));

    while (!finalTime.isSame(d2) || finalTime.isAfter(d2)) {
        offsetCount++;

        const point = d1.add(minutesOffset * offsetCount, 'minutes');

        points.push(point.format('HH:mm'));

        finalTime = point;
    }

    return points;
}
