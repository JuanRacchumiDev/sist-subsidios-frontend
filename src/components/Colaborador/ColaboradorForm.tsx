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
import { ArrowLeft, Save, XCircle } from "lucide-react";
import { getAuthData } from "../../utils/authMemo";
import { ParametroClase } from "../../constants/parametroClase";
import { EOrigen } from "../../enums/EOrigen";

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
  sexo: z
    .string({
      message: "Por favor seleccione un sexo.",
    })
    .min(1, "Por favor seleccione un sexo"),
  esAsociadoSindicato: z.boolean().optional(),
  esPresentaInconvenientes: z.boolean().optional(),
});

const loadEmpresas = async (): Promise<Empresa[]> => {
  let empresas: Empresa[] = [];

  try {
    const response = await getEmpresas();

    const { result, data } = response;

    if (result && data) {
      empresas = data as Empresa[];
    }

    return empresas;
  } catch (error) {
    console.error("Error al obtener empresas", error);
    return [];
  }
};

const loadTipoDocumentos = async (): Promise<Detalle[]> => {
  let tipos: Detalle[] = [];

  try {
    const estado: boolean = true;
    // const enPersona: boolean = true;

    const response = await getDetalles(
      ParametroClase.TIPO_DOCUMENTO,
      estado,
      // enPersona,
    );
    console.log("response loadTipoDocumentos");
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

const loadCargos = async (): Promise<Detalle[]> => {
  let cargos: Detalle[] = [];

  try {
    const estado: boolean = true;
    // const enPersona: boolean = false;

    const response = await getDetalles(
      ParametroClase.CARGO,
      estado,
      // enPersona
    );

    console.log("response loadCargos");
    console.log({ response });

    const { result, data } = response;

    if (result && data) {
      cargos = data as Detalle[];
    }

    return cargos;
  } catch (error) {
    console.error("Error al obtener cargos", error);
    return [];
  }
};

const defaultValues = {
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
  sexo: "",
  esAsociadoSindicato: false,
  esPresentaInconvenientes: false,
};

export const ColaboradorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  console.log("---- idColaborador ----");
  console.log({ id });

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [tipos, setTipos] = useState<Detalle[]>([]);
  const [cargos, setCargos] = useState<Detalle[]>([]);
  const [idPersona, setIdPersona] = useState<string>("");
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [camposHabilitados, setCamposHabilitados] = useState(false);
  const [campoFecNacHabilitado, setCampoFecNacHabilitado] = useState(false);

  const isEditMode = !!id;

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  console.log({ userProfile });

  const { id_usuario } = userProfile;
  console.log({ id_usuario });

  const handleGoBack = () => {
    navigate("/colaborador");
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const resetForm = () => {
    form.reset(defaultValues);
    setCamposHabilitados(false);
    setCampoFecNacHabilitado(false);
    setIdPersona("");
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);

      try {
        const [listEmpresas, listTipoDocumentos, listCargos] =
          await Promise.all([
            loadEmpresas(),
            loadTipoDocumentos(),
            loadCargos(),
          ]);

        console.log({ listTipoDocumentos });

        setEmpresas(listEmpresas);
        setTipos(listTipoDocumentos);
        setCargos(listCargos);

        console.log("---- fetchData id ----");
        console.log({ id });

        if (isEditMode && id) {
          const responseColaborador = await getPersonaById(id);

          console.log({ responseColaborador });

          const { result, data, message } = responseColaborador;

          if (result && data) {
            const colaborador = data as Persona;

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
              sexo,
              is_asociado_sindicato,
              is_tiene_inconvenientes,
            } = colaborador;

            setIdPersona(id);

            const dataForm = {
              idTipoDocumento: id_tipodocumento || "",
              numeroDocumento: numero_documento || "",
              nombres: nombres || "",
              apellidoPaterno: apellido_paterno || "",
              apellidoMaterno: apellido_materno || "",
              fechaNacimiento: fecha_nacimiento
                ? parseISO(fecha_nacimiento)
                : null,
              fechaIngreso: fecha_ingreso ? parseISO(fecha_ingreso) : null,
              idEmpresa: id_empresa || "",
              idCargo: id_cargo || "",
              nombreArea: nombre_area || "",
              nombreSede: nombre_sede || "",
              emailInstitucional: email_institucional || "",
              emailPersonal: email_personal || "",
              telefono: telefono || "",
              sexo: sexo || "",
              esAsociadoSindicato: is_asociado_sindicato || false,
              esPresentaInconvenientes: is_tiene_inconvenientes || false,
            };

            form.reset(dataForm);
          } else {
            showToast("error", message || "Colaborador no encontrado");
            navigate("/colaborador/nuevo");
          }
        }
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

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
      esAsociadoSindicato,
      esPresentaInconvenientes,
      sexo,
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
      nombre_grupo: "GRUPO COLABORADOR",
      is_asociado_sindicato: esAsociadoSindicato,
      is_tiene_inconvenientes: esPresentaInconvenientes,
    };

    if (!idPersona) {
      payload.origen = EOrigen.WEB;
      if (sexo) {
        payload.sexo = sexo;
      }
    }

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
        navigate("/colaborador");
      } else {
        showToast("error", error || messageError);
        return;
      }
    } catch (error) {
      console.error("Error al registrar colaborador", error);
      showToast("error", error);
    }
  };

  return (
    <>
      <Card className="shadow-xl border-none bg-white">
        <CardHeader className="border-b border-gray-100 p-6 flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {isEditMode
                ? `Editar colaborador`
                : `Nuevo registro de colaborador`}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {isEditMode
                ? `Actualización de información de colaborador`
                : `Complete la información para registrar un colaborador`}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </CardHeader>
        <CardContent className="px-6 sm:px-8 relative">
          {isLoadingData && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
              <Spinner className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-bold border border-blue-100">
                    01
                  </span>
                  <h3 className="text-lg font-bold text-slate-800">
                    Información Personal
                  </h3>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                {/* Tipo de Documento */}
                <FormField
                  control={form.control}
                  name="idTipoDocumento"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col">
                      <RequiredLabel>Tipo de Documento</RequiredLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                        disabled={isSubmitting || isEditMode}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`w-full transition-all bg-white ${
                              fieldState.invalid
                                ? "border-red-400 focus:ring-red-100"
                                : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
                            }`}
                          >
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          {tipos.map((tipo) => (
                            <SelectItem value={tipo.id} key={tipo.id}>
                              {tipo.nombre} - {tipo.abreviatura}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                {/* N° de Documento */}
                <FormField
                  control={form.control}
                  name="numeroDocumento"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>N° de documento</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="12345678"
                          autoComplete="off"
                          maxLength={8}
                          disabled={isSubmitting || isEditMode}
                          {...field}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();

                              if (!field.value) return;

                              try {
                                showToast("success", "Buscando datos...");

                                const idTipoDocumento =
                                  form.getValues("idTipoDocumento");

                                const responsePersona =
                                  await getPersonaByIdTipoDocAndNumDoc(
                                    idTipoDocumento,
                                    field.value,
                                  );

                                console.log({ responsePersona });

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

                                  setIdPersona(id);

                                  form.setValue("nombres", nombres, {
                                    shouldValidate: true,
                                  });

                                  form.setValue(
                                    "apellidoPaterno",
                                    apellido_paterno,
                                    { shouldValidate: true },
                                  );

                                  form.setValue(
                                    "apellidoMaterno",
                                    apellido_materno,
                                    { shouldValidate: true },
                                  );

                                  if (fecha_nacimiento) {
                                    form.setValue(
                                      "fechaNacimiento",
                                      parseISO(fecha_nacimiento),
                                      { shouldValidate: true },
                                    );
                                    setCampoFecNacHabilitado(false);
                                  } else {
                                    form.setValue("fechaNacimiento", null, {
                                      shouldValidate: true,
                                    });
                                    setCampoFecNacHabilitado(true);
                                  }

                                  showToast("success", message as string);
                                } else {
                                  setCamposHabilitados(true);

                                  setCampoFecNacHabilitado(true);

                                  showToast(
                                    "warning",
                                    message ||
                                      "No se encontraron registros previos. Complete los datos manualmente.",
                                  );
                                }
                              } catch (error) {
                                setCamposHabilitados(true);
                                showToast(
                                  "error",
                                  "Error al consultar el documento.",
                                );
                              }
                            }
                          }}
                          className={`transition-all bg-white ${
                            fieldState.invalid
                              ? "border-red-400 focus-visible:ring-red-100"
                              : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                          }`}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Nombres */}
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
                          disabled={!camposHabilitados || isSubmitting}
                          className={`transition-all ${
                            fieldState.invalid
                              ? "border-red-400 focus-visible:ring-red-100"
                              : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                          } ${!camposHabilitados ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white"}`}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Apellido Paterno */}
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
                          disabled={!camposHabilitados || isSubmitting}
                          className={`transition-all ${
                            fieldState.invalid
                              ? "border-red-400 focus-visible:ring-red-100"
                              : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                          } ${!camposHabilitados ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white"}`}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Apellido Materno */}
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
                          disabled={!camposHabilitados || isSubmitting}
                          className={`transition-all ${
                            fieldState.invalid
                              ? "border-red-400 focus-visible:ring-red-100"
                              : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                          } ${!camposHabilitados ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white"}`}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Fecha de Nacimiento */}
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
                            field.value ? format(field.value, "yyyy-MM-dd") : ""
                          }
                          autoComplete="off"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseISO(e.target.value) : null,
                            )
                          }
                          disabled={!campoFecNacHabilitado || isSubmitting}
                          className={`transition-all ${
                            fieldState.invalid
                              ? "border-red-400 focus-visible:ring-red-100"
                              : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                          } ${!campoFecNacHabilitado ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white"}`}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-bold border border-blue-100">
                    02
                  </span>
                  <h3 className="text-lg font-bold text-slate-800">
                    Información laboral
                  </h3>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
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
                            field.value ? format(field.value, "yyyy-MM-dd") : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseISO(e.target.value) : null,
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

                {!idPersona && !isEditMode && (
                  <FormField
                    control={form.control}
                    name="sexo"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col">
                        <RequiredLabel>Sexo</RequiredLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                          disabled={isSubmitting || isEditMode}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`w-full transition-all bg-white ${
                                fieldState.invalid
                                  ? "border-red-400 focus:ring-red-100"
                                  : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
                              }`}
                            >
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="M" key="M">
                              Masculino
                            </SelectItem>
                            <SelectItem value="F" key="F">
                              Femenino
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs font-medium text-red-500" />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                <FormField
                  control={form.control}
                  name="esAsociadoSindicato"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="checkbox"
                          id="acceptSindicato"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-4 h-4"
                        />
                        <label htmlFor="acceptSindicato" className="text-sm">
                          Asociado a un sindicato
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="esPresentaInconvenientes"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="checkbox"
                          id="acceptInconvenientes"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-4 h-4"
                        />
                        <label
                          htmlFor="acceptInconvenientes"
                          className="text-sm"
                        >
                          Presenta inconvenientes
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-100 transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isEditMode ? "Actualizar Datos" : "Confirmar Registro"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={resetForm}
                  className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-all"
                >
                  <XCircle className="h-4 w-4 mr-2 text-slate-500" />
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
