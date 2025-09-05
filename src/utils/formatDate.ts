// import { format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

export const formatDateToString = (date: Date, formatString: string = 'yyyy-MM-dd'): string => {
    // Specify the time zone for Lima, Peru
    const limaTimeZone = 'America/Lima';

    // Convert the date to the Lima time zone
    const zonedDate = formatInTimeZone(date, limaTimeZone, formatString);

    // Format the zoned date
    // return format(zonedDate, formatString);
    return zonedDate
};