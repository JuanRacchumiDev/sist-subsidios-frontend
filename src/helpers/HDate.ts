import { parseISO } from "date-fns";
// import { es } from 'date-fns/locale';
import { TIMEZONE_AMERICA_LIMA } from '../params/constants';
import { formatInTimeZone } from 'date-fns-tz'

export default class HDate {
    // static formatDate = (dateString: string | null | undefined, dateFormat: string): string => {
    //     if (!dateString) {
    //         return '';
    //     }

    //     try {
    //         const date = parseISO(dateString);
    //         return format(date, dateFormat, { locale: es });
    //     } catch (error) {
    //         console.error('Error al formatear la fecha:', error);
    //         return '';
    //     }
    // }

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
}