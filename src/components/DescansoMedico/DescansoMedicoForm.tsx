import { useMemo, useState, useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { isAfter, isBefore, parseISO } from "date-fns";
import {
  ArrowLeft,
  FileText,
  Stethoscope,
  ShieldCheck,
  Lock,
  RotateCcw,
  Save,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Spinner } from "../Common/Spinner";
import { InfoModal } from "../Common/InfoModal";

// Sub-componentes
import { DescansoMedicoDetalle } from "./Tabs/DescansoMedicoDetalle";
import { DatosMedicos } from "./Tabs/DatosMedicos";
import { Validacion } from "./Tabs/Validacion";

// Interfaces y servicios
import {
  DescansoMedico,
  DescansoMedicoResponse,
} from "../../interfaces/IDescansoMedico";
import { Persona } from "../../interfaces/IPersona";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { Diagnostico } from "../../interfaces/IDiagnostico";

import { getPersonaById } from "../../services/personaService";
import { getDetalleById } from "../../services/detalleParametroService";
import { getDiagnosticoByCodigo } from "../../services/diagnosticoService";
import {
  createDescanso,
  getDescansoById,
  updateDescanso,
} from "../../services/descansoMedicoService";
import { createCodigoTempAuth } from "../../services/authService";

import { useToast } from "../../context/ToastContext";
import { EDescansoMedico } from "../../enums/EDescansoMedico";
import { getAuthData } from "../../utils/authMemo";
import HDate from "../../helpers/HDate";

export const formSchema = z
  .object({
    id: z.string().optional(),
    idEmpresa: z
      .string({
        message: "Debe seleccionar una empresa",
      })
      .min(1, "Debe seleccionar una empresa"),
    idColaborador: z
      .string({
        message: "Debe seleccionar un colaborador",
      })
      .min(1, "Debe seleccionar un colaborador"),
    idTipoDescansoMedico: z
      .string({
        message: "Debe seleccionar un tipo de descanso médico",
      })
      .min(1, "Debe seleccionar un tipo de descanso médico"),
    idTipoContingencia: z
      .string({
        message: "Debe seleccionar un tipo de contingencia",
      })
      .min(1, "Debe seleccionar un tipo de contingencia"),
    fechaOtorgamiento: z
      .date({
        message: "La fecha de otorgamiento es requerida",
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "La fecha de otorgamiento es requerida",
      }),
    fechaInicio: z
      .date({
        message: "La fecha de inicio es requerida",
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "La fecha de inicio es requerida",
      }),
    fechaFinal: z
      .date({
        message: "La fecha final es requerida",
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "La fecha final es requerida",
      }),
    codigoCitt: z.string().optional(),
    totalDias: z.string().optional(),
    colegiadoMedico: z.string().min(1, "El número de colegiado es requerido"),
    medicoTratante: z
      .string()
      .min(1, "El nombre del médico tratante es requerido"),
    idDiagnostico: z
      .string({
        message: "Debe seleccionar un diagnóstico",
      })
      .min(1, "Debe seleccionar un diagnóstico"),
    nombreEstablecimiento: z
      .string()
      .min(1, "El nombre del médico tratante es requerido"),
    documentos: z.record(z.string(), z.any()).optional(),
    aceptaResponsabilidad: z.boolean().refine((val) => val === true, {
      message: "Debe aceptar la declaración de responsabilidad",
    }),
    aceptaPoliticaSubsidio: z.boolean().refine((val) => val === true, {
      message: "Debe aceptar la política de subsidio",
    }),
    estadoRegistro: z
      .string({
        message: "Debe seleccionar un estado",
      })
      .min(1, "Debe seleccionar un estado"),
    observacion: z.string().optional(),
  })
  .superRefine(async (data, ctx) => {
    const { fechaOtorgamiento, fechaInicio, fechaFinal } = data;

    if (fechaOtorgamiento && fechaInicio) {
      if (isBefore(fechaInicio, fechaOtorgamiento)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "La fecha de inicio debe ser posterior o igual fecha de otorgamiento",
          path: ["fechaInicio"],
        });
      }
    }

    if (fechaFinal && fechaInicio) {
      if (!isAfter(fechaFinal, fechaInicio)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La fecha final debe ser posterior a la fecha de inicio",
          path: ["fechaFinal"],
        });
      }
    }
  });

type FormSchemaType = z.infer<typeof formSchema>;

const defaultValues: FormSchemaType = {
  id: "",
  idEmpresa: "",
  idColaborador: "",
  idTipoDescansoMedico: "",
  idTipoContingencia: "",
  fechaOtorgamiento: null,
  fechaInicio: null,
  fechaFinal: null,
  codigoCitt: "",
  totalDias: "",
  colegiadoMedico: "",
  medicoTratante: "",
  idDiagnostico: "",
  nombreEstablecimiento: "",
  documentos: {},
  aceptaResponsabilidad: false,
  aceptaPoliticaSubsidio: false,
  estadoRegistro: "",
  observacion: "",
};

export const DescansoMedicoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [showResponsabilidad, setShowResponsabilidad] = useState(false);
  const [showPoliticaSubsidio, setShowPoliticaSubsidio] = useState(false);
  const [activeTab, setActiveTab] = useState("datos-descanso-medico");

  const [isLoading, setIsLoading] = useState<boolean>(Boolean(id));
  const [estado, setEstado] = useState<string | null>(null);

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  console.log({ userProfile });

  const {
    nombre_perfil_url,
    id_persona: idPersonaUser,
    id_empresa: idEmpresaUser,
    id_usuario: idUsuarioUser,
  } = userProfile || {};

  // const isDisabled = useMemo(() => {
  //   if (!id) return false;
  //   return estado !== EDescansoMedico.REGISTRO_INGRESADO;
  // }, [id, estado]);

  // console.log({ isDisabled });

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleGoBack = () => {
    navigate("/descanso-medico");
  };

  const resetForm = () => {
    form.reset(defaultValues);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (id) {
        setIsLoading(true);

        try {
          const responseDescanso = await getDescansoById(id);
          console.log({ responseDescanso });

          const { result, data } = responseDescanso;

          if (result && data) {
            const descanso = data as DescansoMedico;

            console.log({ descanso });

            const {
              id_colaborador,
              id_tipodescansomedico,
              id_tipocontingencia,
              codigo_citt,
              fecha_otorgamiento,
              fecha_inicio,
              fecha_final,
              total_dias,
              numero_colegiatura,
              medico_tratante,
              codcie10_diagnostico,
              nombre_establecimiento,
              is_acepta_responsabilidad,
              is_acepta_politica,
              estado_registro,
              observacion,
            } = descanso;

            setEstado(estado_registro);

            let idEmpresaColaborador = "";

            if (id_colaborador) {
              const responseColaborador = await getPersonaById(id_colaborador);
              const { result: resultColaborador, data: dataColaborador } =
                responseColaborador;

              if (resultColaborador && dataColaborador) {
                const { id_empresa } = dataColaborador as Persona;
                idEmpresaColaborador = id_empresa || "";
              }
            }

            const dataForm = {
              idEmpresa: idEmpresaColaborador,
              idColaborador: id_colaborador ?? "",
              idTipoDescansoMedico: id_tipodescansomedico ?? "",
              idTipoContingencia: id_tipocontingencia ?? "",
              codigoCitt: codigo_citt ?? "",
              fechaOtorgamiento: fecha_otorgamiento
                ? parseISO(fecha_otorgamiento)
                : null,
              fechaInicio: fecha_inicio ? parseISO(fecha_inicio) : null,
              fechaFinal: fecha_final ? parseISO(fecha_final) : null,
              totalDias: total_dias?.toString() ?? "",
              colegiadoMedico: numero_colegiatura ?? "",
              medicoTratante: medico_tratante ?? "",
              idDiagnostico: codcie10_diagnostico ?? "",
              nombreEstablecimiento: nombre_establecimiento ?? "",
              aceptaResponsabilidad: is_acepta_responsabilidad ?? false,
              aceptaPoliticaSubsidio: is_acepta_politica ?? false,
              estadoRegistro: estado_registro ?? "",
              observacion: observacion ?? "",
            };

            console.log("dataForm descanso médico", dataForm);

            form.reset(dataForm);
          }
        } catch (error) {
          showToast("error", "Error al cargar los datos del descanso médico.");
          console.error("Error fetching descanso medico:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        if (userProfile && idEmpresaUser && idPersonaUser) {
          form.setValue("idEmpresa", idEmpresaUser);
          form.setValue("idColaborador", idPersonaUser);
        }

        await createCodigoTempAuth();
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  // const isRegistroBloqueado =
  //   isDisabled && estado === EDescansoMedico.REGISTRO_EXITOSO;

  const { isSubmitting } = form.formState;

  const isButtonDisabled =
    isSubmitting ||
    (Boolean(id) &&
      Boolean(estado) &&
      estado === EDescansoMedico.REGISTRO_EXITOSO);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let response: DescansoMedicoResponse;

      let nombreColaborador: string = "";

      let nombreTipoDescanso: string = "";

      let nombreTipoContingencia: string = "";

      let nombreDiagnostico: string = "";

      const fechaActual = HDate.formatDateTimezone(new Date());

      console.log({ values });

      const {
        idEmpresa,
        idColaborador,
        idTipoDescansoMedico,
        idTipoContingencia,
        idDiagnostico,
        fechaOtorgamiento,
        fechaInicio,
        fechaFinal,
        codigoCitt,
        colegiadoMedico,
        medicoTratante,
        totalDias,
        aceptaPoliticaSubsidio,
        aceptaResponsabilidad,
        estadoRegistro,
        nombreEstablecimiento,
        observacion,
      } = values;

      const responseColaborador = await getPersonaById(idColaborador);
      const { result: resultCol, data: dataCol } = responseColaborador;

      if (resultCol && dataCol) {
        const { nombres, apellido_paterno, apellido_materno } =
          dataCol as Persona;

        nombreColaborador = `${nombres} ${apellido_paterno} ${apellido_materno}`;
      }

      const responseTipoDescanso = await getDetalleById(idTipoDescansoMedico);

      const { result: resultTipoDescanso, data: dataTipoDescanso } =
        responseTipoDescanso;

      if (resultTipoDescanso && dataTipoDescanso) {
        const { nombre } = dataTipoDescanso as Detalle;
        nombreTipoDescanso = nombre;
      }

      const responseTipoContingencia = await getDetalleById(idTipoContingencia);

      const { result: resultTipoContingencia, data: dataTipoContingencia } =
        responseTipoContingencia;
      if (resultTipoContingencia && dataTipoContingencia) {
        const { nombre } = dataTipoContingencia as Detalle;
        nombreTipoContingencia = nombre;
      }

      const responseDiagnostico = await getDiagnosticoByCodigo(idDiagnostico);
      const { result: resultDx, data: dataDx } = responseDiagnostico;

      if (resultDx && dataDx) {
        const { nombre } = dataDx as Diagnostico;
        nombreDiagnostico = nombre;
      }

      const payloadDescansoMedico: DescansoMedico = {
        id_empresa: idEmpresa,
        id_colaborador: idColaborador,
        id_tipodescansomedico: idTipoDescansoMedico,
        id_tipocontingencia: idTipoContingencia,
        codcie10_diagnostico: idDiagnostico,
        codigo_citt: codigoCitt,
        fecha_otorgamiento: HDate.formatDateTimezone(fechaOtorgamiento),
        fecha_inicio: HDate.formatDateTimezone(fechaInicio),
        fecha_final: HDate.formatDateTimezone(fechaFinal),
        numero_colegiatura: colegiadoMedico,
        medico_tratante: medicoTratante,
        total_dias: totalDias ? parseInt(totalDias) : 0,
        nombre_perfil_url,
        is_acepta_responsabilidad: aceptaResponsabilidad,
        is_acepta_politica: aceptaPoliticaSubsidio,
        nombre_colaborador: nombreColaborador,
        nombre_tipodescansomedico: nombreTipoDescanso,
        nombre_tipocontingencia: nombreTipoContingencia,
        nombre_diagnostico: nombreDiagnostico,
        nombre_establecimiento: nombreEstablecimiento,
        estado_registro: estadoRegistro as EDescansoMedico,
        observacion,
      };

      if (id) {
        console.log("update");
        payloadDescansoMedico.fecha_actualiza = fechaActual;
        payloadDescansoMedico.user_actualiza = idUsuarioUser;
        response = await updateDescanso(id, payloadDescansoMedico);
      } else {
        console.log("create");
        payloadDescansoMedico.fecha_registro = fechaActual;
        payloadDescansoMedico.user_crea = idUsuarioUser;
        response = await createDescanso(payloadDescansoMedico);
      }

      console.log({ payloadDescansoMedico });

      const { result, message } = response;

      if (result) {
        showToast("success", message);
        navigate("/descanso-medico");
      } else {
        showToast("error", message || "Error al procesar el descanso médico.");
      }
    } catch (error) {
      console.error("Error al registrar descanso médico", error);
      showToast("error", error?.message || "Ocurrió un error inesperado");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <Spinner className="w-8 h-8 text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">
          Cargando información...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-3 px-2 sm:px-4">
      <Card className="shadow-md border border-slate-200 bg-white rounded-xl overflow-hidden">
        {/* Header Principal Compacto */}
        <CardHeader className="border-b border-slate-100 bg-slate-50/60 py-3 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                {id ? "Modo Edición" : "Nuevo Registro"}
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">
              {id
                ? "Editar descanso médico"
                : "Nuevo registro de descanso médico"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-normal text-xs">
              {id
                ? "Actualice la información general y médica de este registro."
                : "Complete todos los campos requeridos para registrar el descanso médico."}
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="h-8 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200 transition-all rounded-md px-3 self-start sm:self-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Volver
          </Button>
        </CardHeader>

        {/* Notificación de bloqueo por estado */}
        {estado && estado === EDescansoMedico.REGISTRO_EXITOSO && (
          <div className="bg-amber-50 border-b border-amber-200 py-2 px-4 sm:px-5 flex items-center gap-2 text-amber-800 text-xs font-medium">
            <Lock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              Este descanso médico ya cuenta con el estado{" "}
              <strong>"Registro exitoso"</strong> y no se puede modificar.
            </span>
          </div>
        )}

        <CardContent className="p-4 sm:p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Contenedor de Pestañas Integrado y Compacto */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full space-y-4"
              >
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-slate-100/90 p-1 rounded-lg gap-1 h-auto">
                  {/* Tab 1: Datos del descanso */}
                  <TabsTrigger
                    value="datos-descanso-medico"
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-xs"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Datos del descanso</span>
                  </TabsTrigger>

                  {/* Tab 2: Datos médicos */}
                  <TabsTrigger
                    value="datos-medicos"
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-xs"
                  >
                    <Stethoscope className="h-3.5 w-3.5" />
                    <span>Datos médicos</span>
                  </TabsTrigger>

                  {/* Tab 3: Validación */}
                  <TabsTrigger
                    value="validacion"
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-xs"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Validación</span>
                  </TabsTrigger>
                </TabsList>

                <div className="pt-1">
                  <TabsContent
                    value="datos-descanso-medico"
                    className="m-0 focus-visible:outline-none"
                  >
                    <DescansoMedicoDetalle
                      form={form}
                      isModoLectura={
                        Boolean(id) &&
                        Boolean(estado) &&
                        estado === EDescansoMedico.REGISTRO_EXITOSO
                      }
                    />
                  </TabsContent>

                  <TabsContent
                    value="datos-medicos"
                    className="m-0 focus-visible:outline-none"
                  >
                    <DatosMedicos
                      form={form}
                      isModoLectura={
                        Boolean(id) &&
                        Boolean(estado) &&
                        estado === EDescansoMedico.REGISTRO_EXITOSO
                      }
                    />
                  </TabsContent>

                  <TabsContent
                    value="validacion"
                    className="m-0 focus-visible:outline-none"
                  >
                    <Validacion
                      form={form}
                      isModoLectura={
                        Boolean(id) &&
                        Boolean(estado) &&
                        estado === EDescansoMedico.REGISTRO_EXITOSO
                      }
                    />
                  </TabsContent>
                </div>
              </Tabs>

              {/* Declaraciones y Términos (Compacto) */}
              <div className="bg-slate-50/80 rounded-lg border border-slate-200/80 p-3 sm:p-4 space-y-2.5">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Declaraciones obligatorias
                </h4>

                <div className="space-y-2">
                  {/* Checkbox 1 */}
                  <FormField
                    control={form.control}
                    name="aceptaResponsabilidad"
                    render={({ field, fieldState }) => (
                      <FormItem className="space-y-0.5">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            disabled={
                              Boolean(id) &&
                              Boolean(estado) &&
                              estado === EDescansoMedico.REGISTRO_EXITOSO
                            }
                            id="responsabilidad"
                            className={`mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition cursor-pointer disabled:cursor-not-allowed ${
                              fieldState.invalid
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                          />
                          <div className="text-xs leading-tight">
                            <label
                              htmlFor="responsabilidad"
                              className="font-medium text-slate-700 cursor-pointer"
                            >
                              <span className="text-red-500 mr-0.5">*</span>
                              Declaro que la información proporcionada es
                              verdadera y asumo la responsabilidad sobre los
                              datos entregados.
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowResponsabilidad(true)}
                              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-[11px] font-semibold ml-1.5 hover:underline focus:outline-none"
                            >
                              Ver detalle{" "}
                              <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                            </button>
                          </div>
                        </div>
                        <FormMessage className="ml-5 text-[11px]" />
                      </FormItem>
                    )}
                  />

                  {/* Checkbox 2 */}
                  <FormField
                    control={form.control}
                    name="aceptaPoliticaSubsidio"
                    render={({ field, fieldState }) => (
                      <FormItem className="space-y-0.5">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            disabled={
                              Boolean(id) &&
                              Boolean(estado) &&
                              estado === EDescansoMedico.REGISTRO_EXITOSO
                            }
                            id="politicaSubsidio"
                            className={`mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition cursor-pointer disabled:cursor-not-allowed ${
                              fieldState.invalid
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                          />
                          <div className="text-xs leading-tight">
                            <label
                              htmlFor="politicaSubsidio"
                              className="font-medium text-slate-700 cursor-pointer"
                            >
                              <span className="text-red-500 mr-0.5">*</span>
                              Acepto las políticas internas referentes al
                              proceso de subsidios y validez documental.
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowPoliticaSubsidio(true)}
                              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-[11px] font-semibold ml-1.5 hover:underline focus:outline-none"
                            >
                              Ver detalle{" "}
                              <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                            </button>
                          </div>
                        </div>
                        <FormMessage className="ml-5 text-[11px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Botones de Acción Reducidos */}
              <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={resetForm}
                  className="w-full sm:w-auto h-8 text-xs text-slate-600 border-slate-200 hover:bg-slate-100 rounded-md px-3"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Restablecer
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={
                    Boolean(id) &&
                    Boolean(estado) &&
                    estado === EDescansoMedico.REGISTRO_EXITOSO
                  }
                  className={`w-full sm:w-auto h-8 text-xs rounded-md px-4 font-medium transition-all ${
                    Boolean(id) &&
                    Boolean(estado) &&
                    estado === EDescansoMedico.REGISTRO_EXITOSO
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      {isButtonDisabled ? "Guardando..." : "Procesando..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5 mr-1.5" />
                      {id ? "Actualizar registro" : "Guardar registro"}
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Modales Informativos */}
            <InfoModal
              open={showResponsabilidad}
              onClose={() => setShowResponsabilidad(false)}
              title="Responsabilidad del colaborador"
              content="Como colaborador, usted es responsable de la veracidad y autenticidad de los documentos entregados. La presentación de documentos alterados o falsos acarreará sanciones legales y administrativas."
            />

            <InfoModal
              open={showPoliticaSubsidio}
              onClose={() => setShowPoliticaSubsidio(false)}
              title="Política de subsidio"
              content="La empresa se reserva el derecho de rechazar tramitaciones de subsidios si la documentación entregada no cumple con las exigencias de ESSALUD o es presentada fuera de los plazos normativos vigentes."
            />
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
