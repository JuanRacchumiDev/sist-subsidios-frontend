import { DOMINIO_EMAIL_DEFAULT } from "@/params/constants"

export default class HEmail {
    static getUsernameFromEmail = (email?: string): string => {
        if (!email) return ""

        if (email.endsWith(DOMINIO_EMAIL_DEFAULT)) {
            return email.replace(DOMINIO_EMAIL_DEFAULT, "")
        }

        return email.split("@")[0]
    }
}