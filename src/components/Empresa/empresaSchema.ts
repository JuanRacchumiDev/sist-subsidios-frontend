import * as z from "zod";

export const empresaFormSchema = z.object({
    ruc: z.string().min(11, { message: "El RUC debe tener 11 dígitos." }),
    razonSocial: z.string().min(2, { message: "La razón social es requerida." }),
    direccion: z.string().optional().or(z.literal("")),
    idTipoDocumento: z
        .string({ message: "Seleccione un tipo de documento." })
        .min(1, "Seleccione un tipo de documento."),
    numeroDocumento: z
        .string()
        .min(8, { message: "Número de documento inválido." }),
    apellidoPaterno: z
        .string()
        .min(2, { message: "El apellido paterno es requerido." }),
    apellidoMaterno: z
        .string()
        .min(2, { message: "El apellido materno es requerido." }),
    nombres: z.string().min(2, { message: "Los nombres son requeridos." }),
    sexo: z
        .string({ message: "Seleccione el sexo." })
        .min(1, "Seleccione el sexo."),
    direccionFiscal: z
        .string()
        .min(2, { message: "La dirección fiscal es requerida." }),
    partidaRegistral: z
        .string()
        .min(1, { message: "Partida registral requerida." }),
    idCargo: z
        .string({ message: "Seleccione un cargo." })
        .min(1, "Seleccione un cargo."),
    telefono: z.string().min(6, { message: "Teléfono inválido." }),
    emailPersonal: z.string().email({ message: "Correo electrónico inválido." }),
    ospe: z.string().min(1, { message: "El OSPE es requerido." }),
});

export type EmpresaFormValues = z.infer<typeof empresaFormSchema>;

export const defaultValues: EmpresaFormValues = {
    ruc: "",
    razonSocial: "",
    direccion: "",
    idTipoDocumento: "",
    numeroDocumento: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    nombres: "",
    sexo: "",
    direccionFiscal: "",
    partidaRegistral: "",
    idCargo: "",
    telefono: "",
    emailPersonal: "",
    ospe: "",
};