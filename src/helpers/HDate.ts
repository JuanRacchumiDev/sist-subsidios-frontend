import { parseISO, format } from "date-fns";
import { TIMEZONE_AMERICA_LIMA } from '../params/constants';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

export default class HDate {
    static formatDateTimezone = (dateInput: string | Date, formatOutput: string = 'yyyy-MM-dd'): string => {
        let dateToProcess: Date = null

        if (dateInput instanceof Date) {
            dateToProcess = dateInput
        } else {
            dateToProcess = parseISO(dateInput);
        }

        // Convierte la fecha a la zona Lima
        const zonedDate = formatInTimeZone(dateToProcess, TIMEZONE_AMERICA_LIMA, formatOutput);

        // Formateo de fecha
        return zonedDate
    }

    /**
     * Obtiene la fecha actual
     * @returns {string} La fecha en formato 'YYYY-MM-DD'
     */
    static getCurrentDateToString(formatDate: string): string {
        const now = new Date();
        const dateLima = toZonedTime(now, TIMEZONE_AMERICA_LIMA)
        return format(dateLima, formatDate)
    }
}