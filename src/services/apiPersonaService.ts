import { searchForTipoDocAndNumDoc } from "@/repositories/apiPersonaRepository";

export const getPersonaByApi = async (idTipoDoc: string, numDoc: string) => {
    const response = await searchForTipoDocAndNumDoc(idTipoDoc, numDoc)

    return {
        ...response
    }
}