import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DescansoMedicoDetalle } from "./Tabs/DescansoMedicoDetalle";
import { DatosMedicos } from "./Tabs/DatosMedicos";
import { InfoModal } from "../Common/InfoModal";
import { Button } from "../ui/button";
import { Spinner } from "../Common/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { Validacion } from "./Tabs/Validacion";
import {
  DescansoMedico,
  DescansoMedicoResponse,
} from "../../interfaces/IDescansoMedico";
import { getPersonaById } from "../../services/personaService";
import { Persona } from "../../interfaces/IPersona";
import { getDetalleById } from "../../services/detalleParametroService";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { getDiagnosticoByCodigo } from "../../services/diagnosticoService";
import { Diagnostico } from "../../interfaces/IDiagnostico";
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
import { isAfter, isBefore, parseISO } from "date-fns";
import { ArrowLeft } from "lucide-react";

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
    const {
      idTipoDescansoMedico,
      codigoCitt,
      fechaOtorgamiento,
      fechaInicio,
      fechaFinal,
    } = data;

    if (
      idTipoDescansoMedico === "972d5ed2-26f9-4ffd-b7cf-127384fad9db" &&
      !codigoCitt
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El código CITT es requerido para este tipo de descanso",
        path: ["codigoCitt"],
      });
    }

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

type TDescanso = {
  idEmpresa?: string;
  idColaborador?: string;
  idTipoDescansoMedico?: string;
  idTipoContingencia?: string;
  fechaOtorgamiento?: null;
  fechaInicio?: null;
  fechaFinal?: null;
  codigoCitt?: string;
  totalDias?: string;
  colegiadoMedico?: string;
  medicoTratante?: string;
  idDiagnostico?: string;
  nombreEstablecimiento?: string;
  aceptaResponsabilidad?: boolean;
  aceptaPoliticaSubsidio?: boolean;
  observacion?: string;
};

export const DescansoMedicoForm = () => {
  const [showResponsabilidad, setShowResponsabilidad] = useState(false);
  const [showPoliticaSubsidio, setShowPoliticaSubsidio] = useState(false);
  const [activeTab, setActiveTab] = useState("datos-descanso-medico");
  const [estadoOriginal, setEstadoOriginal] = useState<string | null>(null);

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const { showToast } = useToast();

  const isEditMode = !!id;

  const userProfile = useMemo(() => getAuthData()?.usuario, []);

  console.log({ userProfile });

  const { nombre_perfil_url, id_persona, id_empresa, id_usuario } = userProfile;

  console.log({ nombre_perfil_url });

  console.log({ id_persona });

  console.log({ id_usuario });

  const handleGoBack = () => {
    navigate("/descanso-medico");
  };

  const resetForm = () => {
    const dataForm: TDescanso = {
      idEmpresa: "",
      idColaborador: "",
      idTipoDescansoMedico: "",
      idTipoContingencia: "",
      fechaOtorgamiento: null,
      fechaInicio: null,
      fechaFinal: null,
      totalDias: "",
      colegiadoMedico: "",
      medicoTratante: "",
      idDiagnostico: "",
      nombreEstablecimiento: "",
      aceptaResponsabilidad: false,
      aceptaPoliticaSubsidio: false,
      observacion: "",
    };

    form.reset(dataForm);
  };

  const isModeLetter =
    (nombre_perfil_url === "especialista-empresa" ||
      nombre_perfil_url === "administrador") &&
    isEditMode
      ? true
      : false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      estadoRegistro: id_persona ? EDescansoMedico.REGISTRO_INGRESADO : "",
      observacion: "",
    },
  });

  const { isSubmitting } = form.formState;

  // const currentEstado = form.watch("estadoRegistro");

  // const isButtonDisabled =
  //   isSubmitting || (isEditMode && currentEstado === "Registro exitoso");

  const isRegistroBloqueado =
    isEditMode && estadoOriginal === "Registro exitoso";

  const isButtonDisabled = isSubmitting || isRegistroBloqueado;

  useEffect(() => {
    const fecthDescansoMedico = async () => {
      if (isEditMode && id) {
        console.log("---- isEditMode ----");
        console.log({ isEditMode });

        console.log("---- id ----");
        console.log({ id });

        let idEmpresa = "";

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

            setEstadoOriginal(estado_registro);

            const responseColaborador = await getPersonaById(id_colaborador);

            console.log({ responseColaborador });

            const { result: resultColaborador, data: dataColaborador } =
              responseColaborador;

            if (resultColaborador && dataColaborador) {
              const { id_empresa } = dataColaborador as Persona;
              idEmpresa = id_empresa;
            }

            const dataForm = {
              idEmpresa,
              idColaborador: id_colaborador,
              idTipoDescansoMedico: id_tipodescansomedico,
              idTipoContingencia: id_tipocontingencia,
              codigoCitt: codigo_citt || "",
              fechaOtorgamiento: fecha_otorgamiento
                ? parseISO(fecha_otorgamiento)
                : null,
              fechaInicio: fecha_inicio ? parseISO(fecha_inicio) : null,
              fechaFinal: fecha_final ? parseISO(fecha_final) : null,
              totalDias: total_dias?.toString() || "",
              colegiadoMedico: numero_colegiatura,
              medicoTratante: medico_tratante,
              idDiagnostico: codcie10_diagnostico,
              nombreEstablecimiento: nombre_establecimiento,
              aceptaResponsabilidad: is_acepta_responsabilidad,
              aceptaPoliticaSubsidio: is_acepta_politica,
              estadoRegistro: estado_registro,
              observacion: observacion || "",
            };

            console.log("dataForm descanso médico", dataForm);

            form.reset(dataForm);
          }
        } catch (error) {
          showToast("error", "Error al cargar los datos del descanso médico.");
          console.error("Error fetching descanso medico:", error);
        }
      } else {
        if (userProfile) {
          form.setValue("idEmpresa", id_empresa);
          form.setValue("idColaborador", id_persona);
        }

        await createCodigoTempAuth();
      }
    };

    fecthDescansoMedico();
  }, [id, isEditMode]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
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

      const fechaRegistro = HDate.formatDateTimezone(new Date());

      let nombreColaborador: string = "";
      const responseColaborador = await getPersonaById(idColaborador);
      const { result: resultCol, data: dataCol } = responseColaborador;

      if (resultCol && dataCol) {
        const { nombres, apellido_paterno, apellido_materno } =
          dataCol as Persona;

        nombreColaborador = `${nombres} ${apellido_paterno} ${apellido_materno}`;
      }

      let nombreTipoDescanso: string = "";

      const responseTipoDescanso = await getDetalleById(idTipoDescansoMedico);

      const { result: resultTipoDescanso, data: dataTipoDescanso } =
        responseTipoDescanso;
      if (resultTipoDescanso && dataTipoDescanso) {
        const { nombre } = dataTipoDescanso as Detalle;
        nombreTipoDescanso = nombre;
      }

      let nombreTipoContingencia: string = "";

      const responseTipoContingencia = await getDetalleById(idTipoContingencia);

      const { result: resultTipoContingencia, data: dataTipoContingencia } =
        responseTipoContingencia;
      if (resultTipoContingencia && dataTipoContingencia) {
        const { nombre } = dataTipoContingencia as Detalle;
        nombreTipoContingencia = nombre;
      }

      let nombreDiagnostico: string = "";
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
        fecha_registro: fechaRegistro,
        numero_colegiatura: colegiadoMedico,
        medico_tratante: medicoTratante,
        total_dias: parseInt(totalDias),
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

      console.log({ payloadDescansoMedico });

      let response: DescansoMedicoResponse;

      if (isEditMode) {
        console.log("update");
        payloadDescansoMedico.user_actualiza = id_usuario;
        response = await updateDescanso(id, payloadDescansoMedico);
      } else {
        console.log("create");
        payloadDescansoMedico.user_crea = id_usuario;
        response = await createDescanso(payloadDescansoMedico);
      }

      const { result, message } = response;

      if (result) {
        showToast("success", message);
        navigate("/descanso-medico");
      } else {
        showToast("error", message || "Error al procesar el descanso médico.");
      }
    } catch (error) {
      console.error("Error al registrar cargo", error);
      showToast("error", error);
    }
  };

  return (
    <>
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between">
          <div className="flex-shrink min-w-0">
            <CardTitle className="text-xl font-bold text-gray-800">
              {isEditMode
                ? "Actualización de descanso médico"
                : "Registro de descanso médico"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {isEditMode
                ? "Formulario de actualización de descanso médico"
                : "Complete el formulario para registrar un descanso médico"}
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
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="datos-descanso-medico"
                    className="bg-blue-400 hover:bg-blue-500 hover: cursor-pointer text-white transition-colors duration-300 mr-2"
                  >
                    Datos del descanso médico
                  </TabsTrigger>
                  <TabsTrigger
                    value="datos-medicos"
                    className="bg-blue-400 hover:bg-blue-500 hover: cursor-pointer text-white transition-colors duration-300 mr-2"
                  >
                    Datos médicos
                  </TabsTrigger>
                  <TabsTrigger
                    value="validacion"
                    className="bg-blue-400 hover:bg-blue-500 hover: cursor-pointer text-white transition-colors duration-300"
                  >
                    Validación
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="datos-descanso-medico" className="mt-6">
                  <DescansoMedicoDetalle
                    form={form}
                    isModeLetter={isModeLetter}
                  />
                </TabsContent>

                <TabsContent value="datos-medicos" className="mt-6">
                  <DatosMedicos form={form} isModeLetter={isModeLetter} />
                </TabsContent>

                <TabsContent value="validacion" className="mt-6">
                  <Validacion form={form} isModeLetter={isModeLetter} />
                </TabsContent>
              </Tabs>

              <div className="space-y-4 mt-6">
                <FormField
                  control={form.control}
                  name="aceptaResponsabilidad"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          id="responsabilidad"
                          className={`ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300
                            ${
                              fieldState.invalid
                                ? "text-red-500 focus-visible:ring-red-500 border-red-500"
                                : "text-blue-600 focus-visible:ring-blue-600 border-gray-300"
                            }`}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <div className="flex items-center">
                            <label
                              htmlFor="responsabilidad"
                              className={`text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                fieldState.invalid ? "text-red-600" : ""
                              }`}
                            >
                              <span className="text-red-500 mr-1">*</span>
                              Declaro que la información proporcionada es
                              verdadera y es mi responsabilidad
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowResponsabilidad(true)}
                              className="text-blue-500 underline text-sm text-left ml-2"
                            >
                              Ver más
                            </button>
                          </div>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aceptaPoliticaSubsidio"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          id="politicaSubsidio"
                          className={`ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300
                            ${
                              fieldState.invalid
                                ? "text-red-500 focus-visible:ring-red-500 border-red-500"
                                : "text-blue-600 focus-visible:ring-blue-600 border-gray-300"
                            }`}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <div className="flex items-center">
                            <label
                              htmlFor="politicaSubsidio"
                              className={`text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                fieldState.invalid ? "text-red-600" : ""
                              }`}
                            >
                              <span className="text-red-500 mr-1">*</span>
                              Acepto la política de la empresa en caso de
                              subsidio por documentación incorrecta
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowPoliticaSubsidio(true)}
                              className="text-blue-500 underline text-sm text-left ml-2"
                            >
                              Ver más
                            </button>
                          </div>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={isButtonDisabled}
                  // className="bg-blue-600 hover:bg-blue-700 hover: cursor-pointer text-white transition-colors duration-300"
                  className={`${isRegistroBloqueado ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"} text-white transition-colors duration-300`}
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

            <InfoModal
              open={showResponsabilidad}
              onClose={() => setShowResponsabilidad(false)}
              title="Responsabilidad del colaborador"
              content="Como colaborador, usted es responsable de la veracidad y autenticidad de los documentos entregados"
            />

            <InfoModal
              open={showPoliticaSubsidio}
              onClose={() => setShowPoliticaSubsidio(false)}
              title="Política de subsidio"
              content="La empresa se reserva el derecho de rechazar subsidios si la documentación no está completa o es observada"
            />
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
