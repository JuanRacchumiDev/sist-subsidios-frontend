import { useEffect, useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useToast } from "../../context/ToastContext";
import { Spinner } from "../../components/Common/Spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { getEmpresas } from "../../services/empresaService";
import { getDetalles } from "../../services/detalleParametroService";
import {
  getPersonaByIdTipoDocAndNumDoc,
  getPersonaById,
} from "../../services/personaService";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RequiredLabel } from "../Common/RequiredLabel";
import { Persona, PersonaResponse } from "../../interfaces/IPersona";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { Empresa } from "../../interfaces/IEmpresa";
import { createPersona, updatePersona } from "../../services/personaService";
import SearchableCombobox from "../Common/SearchableCombobox";
import { ArrowLeft } from "lucide-react";
import { ParametroClase } from "../../constants/parametroClase";
import { getAuthData } from "../../utils/authMemo";

const formSchema = z.object({
  idTipoDocumento: z
    .string({
      message: "Por favor seleccione un tipo de documento.",
    })
    .min(1, "Por favor seleccione un tipo de documento."),
  numeroDocumento: z.string().min(8, {
    message: "El número de documento debe tener al menos 8 caracteres.",
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
  fechaNacimiento: z
    .date({
      message: "La fecha de nacimiento es requerida",
    })
    .refine((val) => val !== null, {
      message: "La fecha de nacimiento es requerida",
    }),
  idEmpresa: z
    .string({
      message: "Por favor seleccione una empresa.",
    })
    .min(1, "Por favor seleccione una empresa"),
  idCargo: z
    .string({
      message: "Por favor seleccione un cargo.",
    })
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
  fechaIngreso: z.date().optional(),
});

const getTipoDocumentos = async (): Promise<Detalle[]> => {
  let tipos: Detalle[] = [];

  try {
    const estado: boolean = true;

    const response = await getDetalles(ParametroClase.TIPO_DOCUMENTO, estado);
    console.log("response getTipoDocumentos");
    console.log({ response });

    const { result, data } = response;

    if (result && data) {
      tipos = data as Detalle[];
    }

    return tipos;
  } catch (error) {
    console.error("Error al obtener tipo de documentos", error);
    return [];
  }
};

const getCargos = async (): Promise<Detalle[]> => {
  let cargos: Detalle[] = [];

  try {
    const estado: boolean = true;

    const response = await getDetalles(ParametroClase.CARGO, estado);
    console.log("response getCargos");
    console.log({ response });

    if (response.result && response.data) {
      cargos = response.data as Detalle[];
    }

    return cargos;
  } catch (error) {
    console.error("Error al obtener cargos", error);
    return [];
  }
};

type TPersona = {
  idTipoDocumento?: string;
  numeroDocumento?: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: null;
  idEmpresa?: string;
  idCargo?: string;
  nombreArea?: string;
  nombreSede?: string;
  emailInstitucional?: string;
  emailPersonal?: string;
  telefono?: string;
  fechaIngreso?: null;
};

export const TrabajadorSocialForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  console.log("---- idTrabajadorSocial ----");
  console.log({ id });

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [tipos, setTipos] = useState<Detalle[]>([]);
  const [cargos, setCargos] = useState<Detalle[]>([]);
  const [idPersona, setIdPersona] = useState<string>("");

  const [camposHabilitadosPersona, setCamposHabilitadosPersona] =
    useState(false);

  const isEditMode = !!id;

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  console.log({ userProfile });

  const { id_usuario } = userProfile;
  console.log({ id_usuario });

  const handleGoBack = () => {
    navigate("/trabajador-social");
  };

  const resetForm = () => {
    const dataForm: TPersona = {
      idTipoDocumento: "",
      numeroDocumento: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
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

    form.reset(dataForm);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idTipoDocumento: "",
      numeroDocumento: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      fechaNacimiento: null,
      idEmpresa: "",
      idCargo: "",
      nombreArea: "",
      nombreSede: "",
      emailInstitucional: "",
      emailPersonal: "",
      telefono: "",
      fechaIngreso: null,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({ values });
    let messageError: string = "";
    let response: PersonaResponse;

    const {
      idTipoDocumento,
      idCargo,
      idEmpresa,
      numeroDocumento,
      apellidoPaterno,
      apellidoMaterno,
      nombres,
      fechaNacimiento,
      fechaIngreso,
      nombreArea,
      nombreSede,
      emailInstitucional,
      emailPersonal,
      telefono,
    } = values;

    const nombreCompleto: string = `${nombres} ${apellidoPaterno} ${apellidoMaterno}`;

    const fechaNacimientoToString: string | null = fechaNacimiento
      ? fechaNacimiento.toISOString()
      : null;

    const partsFechaNacimientoStr: string[] =
      fechaNacimientoToString.split("T");

    const fechaNacimientoStr: string = partsFechaNacimientoStr[0];

    let fechaIngresoStr: string | null = null;

    if (fechaIngreso) {
      const fechaIngresoToString: string | null = fechaIngreso.toISOString();
      const partsFechaIngreso: string[] = fechaIngresoToString.split("T");
      fechaIngresoStr = partsFechaIngreso[0];
    }

    const payload: Persona = {
      id_tipodocumento: idTipoDocumento,
      id_cargo: idCargo,
      id_empresa: idEmpresa,
      numero_documento: numeroDocumento,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      nombres,
      nombre_completo: nombreCompleto,
      fecha_nacimiento: fechaNacimientoStr,
      fecha_ingreso: fechaIngresoStr,
      nombre_area: nombreArea,
      nombre_sede: nombreSede,
      email_institucional: emailInstitucional,
      email_personal: emailPersonal,
      telefono,
      nombre_grupo: "GRUPO TRABAJADOR SOCIAL",
    };

    console.log("---- payload persona ----");
    console.log({ payload });

    try {
      console.log({ isEditMode });
      console.log({ idPersona });

      if (!isEditMode && idPersona) {
        console.log("create persona");
        payload.user_crea = id_usuario;
        response = await updatePersona(idPersona, payload);
      } else if (isEditMode && idPersona) {
        console.log("update persona");
        payload.user_actualiza = id_usuario;
        response = await updatePersona(idPersona, payload);
      } else {
        console.log("ccc");
        payload.user_crea = id_usuario;
        response = await createPersona(payload);
      }

      console.log("---- response createPersona or updatePersona ----");
      console.log(response);

      const { result, message, error } = response as PersonaResponse;

      if (result) {
        showToast("success", message);
        navigate("/trabajador-social");
      } else {
        showToast("error", error || messageError);
        return;
      }
    } catch (error) {
      console.error("Error al registrar trabajador social", error);
      showToast("error", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let listEmpresas: Empresa[] = [];
        let listTipoDocumentos: Detalle[] = [];
        let listCargos: Detalle[] = [];

        const [responseEmpresas, responseTipoDocumentos, responseCargos] =
          await Promise.all([getEmpresas(), getTipoDocumentos(), getCargos()]);

        const { result: resultEmpresas, data: dataEmpresas } = responseEmpresas;
        if (resultEmpresas && dataEmpresas) {
          listEmpresas = dataEmpresas as Empresa[];
        }

        listTipoDocumentos = responseTipoDocumentos as Detalle[];

        listCargos = responseCargos as Detalle[];

        setEmpresas(listEmpresas);
        setTipos(listTipoDocumentos);
        setCargos(listCargos);

        console.log("---- fetchData id ----");
        console.log({ id });

        if (id) {
          const responseTrabajadorSocial = await getPersonaById(id);

          console.log({ responseTrabajadorSocial });

          const { result, data, message } = responseTrabajadorSocial;

          if (result && data) {
            let dataForm: TPersona = {};
            const trabajadorSocial = data as Persona;

            console.log({ trabajadorSocial });

            const {
              id_tipodocumento,
              numero_documento,
              nombres,
              apellido_paterno,
              apellido_materno,
              fecha_nacimiento,
              fecha_ingreso,
              id_empresa,
              id_cargo,
              nombre_area,
              nombre_sede,
              email_institucional,
              email_personal,
              telefono,
            } = trabajadorSocial;

            dataForm.idTipoDocumento = id_tipodocumento || "";
            dataForm.numeroDocumento = numero_documento || "";
            ((dataForm.nombres = nombres || ""),
              (dataForm.apellidoPaterno = apellido_paterno || ""));
            dataForm.apellidoMaterno = apellido_materno || "";
            dataForm.fechaNacimiento = fecha_nacimiento
              ? parseISO(fecha_nacimiento)
              : null;
            dataForm.fechaIngreso = fecha_ingreso
              ? parseISO(fecha_ingreso)
              : null;
            dataForm.idEmpresa = id_empresa || "";
            dataForm.idCargo = id_cargo || "";
            dataForm.nombreArea = nombre_area || "";
            dataForm.nombreSede = nombre_sede || "";
            dataForm.emailInstitucional = email_institucional || "";
            dataForm.emailPersonal = email_personal || "";
            dataForm.telefono = telefono || "";
            form.reset(dataForm);
            setIdPersona(id);
          } else {
            showToast("error", message || "Trabajador social no encontrado");
            navigate("/trabajador-social/nuevo");
          }
        }
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, [id, form]);

  return (
    <>
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="border-b border-gray-200 p-4 sm:p-6 flex flex-row items-center justify-between">
          <div className="flex-shrink min-w-0">
            <CardTitle className="text-xl font-bold text-gray-800 truncate">
              {isEditMode
                ? "Actualización de trabajador social"
                : "Registro de trabajador social"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {isEditMode
                ? "Formulario de actualización de trabajador social"
                : "Complete el formulario para registrar un trabajador social"}
            </CardDescription>
          </div>
          <button
            onClick={handleGoBack}
            className="
              flex items-center text-sm font-semibold 
              text-blue-600 
              hover:text-blue-800 
              hover:bg-blue-50 
              transition-colors 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
              rounded-md p-2 ml-4 
              cursor-pointer
            "
            aria-label="Volver al listado"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </button>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <fieldset className="border border-gray-300 p-4 rounded-md">
                <legend className="text-base font-semibold text-gray-800 px-2">
                  Información personal
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="idTipoDocumento"
                    render={({ field, fieldState }) => (
                      <FormItem className="mb-4">
                        <RequiredLabel>Tipo de Documento</RequiredLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`
                                ${
                                  fieldState.invalid
                                    ? "border-red-500 focus:ring-red-500"
                                    : "focus:ring-blue-500"
                                }
                                  focus:ring-2 focus:ring-offset-2 transition-all duration-300 cursor-pointer
                              `}
                            >
                              <SelectValue placeholder="Seleccionar tipo de documento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-400">
                            {tipos.map((tipo) => (
                              <SelectItem
                                value={tipo.id}
                                key={tipo.id}
                                className="cursor-pointer hover:bg-gray-100 transition-colors"
                              >
                                {tipo.abreviatura}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numeroDocumento"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Número de Documento</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="44668800"
                            autoComplete="off"
                            maxLength={8}
                            {...field}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                try {
                                  showToast("success", "Buscando persona...");

                                  const idTipoDocumento =
                                    form.getValues("idTipoDocumento");

                                  const responsePersona =
                                    await getPersonaByIdTipoDocAndNumDoc(
                                      idTipoDocumento,
                                      field.value,
                                    );

                                  const { result, data, message } =
                                    responsePersona;

                                  if (result && data) {
                                    const persona = data as Persona;

                                    const {
                                      id,
                                      nombres,
                                      apellido_paterno,
                                      apellido_materno,
                                      fecha_nacimiento,
                                    } = persona;

                                    form.setValue("nombres", nombres);

                                    form.setValue(
                                      "apellidoPaterno",
                                      apellido_paterno,
                                    );

                                    form.setValue(
                                      "apellidoMaterno",
                                      apellido_materno,
                                    );

                                    if (fecha_nacimiento) {
                                      const fechaParsed =
                                        parseISO(fecha_nacimiento);
                                      form.setValue(
                                        "fechaNacimiento",
                                        fechaParsed,
                                      );
                                    }
                                    setIdPersona(id);
                                    setCamposHabilitadosPersona(false);
                                    showToast("success", message);
                                  } else {
                                    setCamposHabilitadosPersona(true);
                                    showToast(
                                      "warning",
                                      "No se encontraron datos de persona",
                                    );
                                  }
                                } catch (error) {
                                  setCamposHabilitadosPersona(true);
                                  showToast("error", "Error al crear persona");
                                }
                              }
                            }}
                            className={`
                              ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-500"
                                  : "focus:ring-blue-500"
                              }
                                transition-all duration-300
                            `}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Nombres</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="María Angélica"
                            autoComplete="off"
                            maxLength={40}
                            {...field}
                            disabled={!camposHabilitadosPersona}
                            className={`
                              ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-500"
                                  : "focus:ring-blue-500"
                              }
                                transition-all duration-300
                            `}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apellidoPaterno"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Apellido Paterno</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="Pérez"
                            autoComplete="off"
                            maxLength={40}
                            {...field}
                            disabled={!camposHabilitadosPersona}
                            className={`
                              ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-500"
                                  : "focus:ring-blue-500"
                              }
                                transition-all duration-300
                            `}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apellidoMaterno"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Apellido Materno</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="Vallejos"
                            autoComplete="off"
                            maxLength={40}
                            {...field}
                            disabled={!camposHabilitadosPersona}
                            className={`
                              ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-500"
                                  : "focus:ring-blue-500"
                              }
                                transition-all duration-300
                            `}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaNacimiento"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Fecha de Nacimiento</RequiredLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={
                              field.value
                                ? format(field.value, "yyyy-MM-dd")
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseISO(e.target.value)
                                  : null,
                              )
                            }
                            className={`
                              ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-500"
                                  : "focus:ring-blue-500"
                              }
                                transition-all duration-300
                            `}
                            disabled={!camposHabilitadosPersona}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="border border-gray-300 p-4 rounded-md">
                <legend className="text-base font-semibold text-gray-800 px-2">
                  Información laboral
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="idEmpresa"
                    render={({ field, fieldState }) => {
                      return (
                        <FormItem className="flex flex-col">
                          <RequiredLabel>Empresa</RequiredLabel>
                          <SearchableCombobox<Empresa>
                            placeholder="Buscar una empresa"
                            options={empresas}
                            value={field.value}
                            onChange={field.onChange}
                            displayKey="nombre_o_razon_social"
                            valueKey="id"
                            searchKeys={["nombre_o_razon_social"]}
                            isInvalid={fieldState.invalid}
                          />
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="idCargo"
                    render={({ field, fieldState }) => {
                      return (
                        <FormItem className="flex flex-col">
                          <RequiredLabel>Cargo</RequiredLabel>
                          <SearchableCombobox<Detalle>
                            placeholder="Buscar un cargo"
                            options={cargos}
                            value={field.value}
                            onChange={field.onChange}
                            displayKey="nombre"
                            valueKey="id"
                            searchKeys={["nombre"]}
                            isInvalid={fieldState.invalid}
                          />
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="nombreArea"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Área</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="Recursos Humanos"
                            autoComplete="off"
                            maxLength={40}
                            {...field}
                            className={`
                              ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-500"
                                  : "focus:ring-blue-500"
                              }
                                transition-all duration-300
                            `}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nombreSede"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Sede</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="Lima"
                            autoComplete="off"
                            maxLength={40}
                            {...field}
                            className={`
                              ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-500"
                                  : "focus:ring-blue-500"
                              }
                                transition-all duration-300
                            `}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailInstitucional"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Correo Institucional</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="maria.lopez@empresa.com"
                            autoComplete="off"
                            maxLength={50}
                            {...field}
                            className={`
                              ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-500"
                                  : "focus:ring-blue-500"
                              }
                                transition-all duration-300
                            `}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailPersonal"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Correo Personal</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="maria.lopez@gmail.com"
                            autoComplete="off"
                            maxLength={50}
                            {...field}
                            className={`
                              ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-500"
                                  : "focus:ring-blue-500"
                              }
                                transition-all duration-300
                            `}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Número de Celular</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="987654321"
                            autoComplete="off"
                            maxLength={9}
                            {...field}
                            className={`
                              ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-500"
                                  : "focus:ring-blue-500"
                              }
                                transition-all duration-300
                            `}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaIngreso"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Fecha de Ingreso</RequiredLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={
                              field.value
                                ? format(field.value, "yyyy-MM-dd")
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseISO(e.target.value)
                                  : null,
                              )
                            }
                            className={`
                              ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-500"
                                  : "focus:ring-blue-500"
                              }
                                transition-all duration-300
                            `}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 hover: cursor-pointer text-white transition-colors duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Actualizando..." : "Registrando..."}
                    </>
                  ) : isEditMode ? (
                    "Actualizar"
                  ) : (
                    "Registrar"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => resetForm()}
                  className="hover:bg-gray-200 hover: cursor-pointer transition-colors duration-300"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
