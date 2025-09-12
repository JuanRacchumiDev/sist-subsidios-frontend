import { parseISO, format } from "date-fns";
import { es } from 'date-fns/locale';

export default class HDate {
    static formatDate = (dateString: string | null | undefined, dateFormat: string): string => {
        if (!dateString) {
            return '';
        }

        try {
            const date = parseISO(dateString);
            return format(date, dateFormat, { locale: es });
        } catch (error) {
            console.error('Error al formatear la fecha:', error);
            return '';
        }
    }
}