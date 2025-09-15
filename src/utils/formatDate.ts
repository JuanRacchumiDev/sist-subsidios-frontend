import { formatInTimeZone } from 'date-fns-tz'

export const formatDateToString = (date: Date, formatString: string = 'yyyy-MM-dd'): string => {
    // Especifica la zona horaria para Lima, Peru
    const limaTimeZone = 'America/Lima';

    // Convierte la fecha a la zona Lima
    const zonedDate = formatInTimeZone(date, limaTimeZone, formatString);

    // Formateo de fecha
    return zonedDate
};