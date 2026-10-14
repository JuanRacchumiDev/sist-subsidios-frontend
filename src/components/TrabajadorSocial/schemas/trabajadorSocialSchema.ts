
import * as z from "zod";

export const trabajadorSocialSchema = z.object({
    idTipoDocumento: z
        .string({ message: "Por favor seleccione un tipo de documento." })
        .min(1, "Por favor seleccione un tipo de documento."),
    numeroDocumento: z.string().min(8, {
        message: "El número de documento debe tener 8 caracteres.",
    }),
    nombres: z.string().min(2, {
        message: "Los nombres son requeridos.",
    }),
    apellidoPaterno: z.string().min(2, {
        message: "El apellido paterno es requerido.",
    }),
    apellidoMaterno: z.string().min(2, {
        message: "El apellido materno es requerido.",
    }),
    sexo: z
        .string({ message: "Por favor seleccione el sexo." })
        .min(1, "Por favor seleccione el sexo."),
    // fechaNacimiento: z
    //     .date({
    //         message: "La fecha de nacimiento es requerida",
    //     })
    //     .nullable()
    //     .refine((val) => val !== null, {
    //         message: "La fecha de nacimiento es requerida",
    //     }),
    fechaNacimiento: z.date().nullable().optional(),
    idEmpresa: z
        .string({ message: "Por favor seleccione una empresa." })
        .min(1, "Por favor seleccione una empresa"),
    idCargo: z
        .string({ message: "Por favor seleccione un cargo." })
        .min(1, "Por favor seleccione un cargo"),
    nombreArea: z.string().min(2, {
        message: "El área es requerida.",
    }),
    nombreSede: z.string().min(2, {
        message: "La sede es requerida.",
    }),
    emailInstitucional: z.string().email({
        message: "Por favor ingrese un correo institucional válido.",
    }),
    emailPersonal: z.string().email({
        message: "Por favor ingrese un correo personal válido.",
    }),
    telefono: z.string().min(9, {
        message: "El número de celular debe tener al menos 9 dígitos.",
    }),
    fechaIngreso: z.date().nullable().optional(),
});

export type TrabajadorSocialFormValues = z.infer<typeof trabajadorSocialSchema>;

export const defaultValues: TrabajadorSocialFormValues = {
    idTipoDocumento: "",
    numeroDocumento: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    sexo: "",
    fechaNacimiento: null,
    idEmpresa: "",
    idCargo: "",
    nombreArea: "",
    nombreSede: "",
    emailInstitucional: "",
    emailPersonal: "",
    telefono: "",
    fechaIngreso: null,
};