import { searchForRuc } from "@/repositories/apiEmpresaRepository";

export const getEmpresaByApi = async (ruc: string) => {
    const response = await searchForRuc(ruc)

    return {
        ...response
    }
}