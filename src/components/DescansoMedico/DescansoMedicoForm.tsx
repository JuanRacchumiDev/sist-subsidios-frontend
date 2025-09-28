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
import { getColaboradorById } from "../../services/colaboradorService";
import { Colaborador } from "../../interfaces/IColaborador";
import { getTipoDescansoById } from "../../services/tipoDescansoMedicoService";
import { TipoDescansoMedico } from "../../interfaces/ITipoDescansoMedico";
import { getTipoContingenciaById } from "../../services/tipoContingenciaService";
import { TipoContingencia } from "../../interfaces/ITipoContingencia";
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

export const DescansoMedicoForm = () => {
  const [showResponsabilidad, setShowResponsabilidad] = useState(false);
  const [showPoliticaSubsidio, setShowPoliticaSubsidio] = useState(false);
  const [activeTab, setActiveTab] = useState("datos-descanso-medico");

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const { showToast } = useToast();

  const userProfile = useMemo(() => getAuthData()?.usuario, []);

  const isEditMode = !!id;

  // Deshabilitando campos para el perfil especialista
  const isModeLetter =
    (userProfile.slug_perfil === "especialista" ||
      userProfile.slug_perfil === "administrador") &&
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
      estadoRegistro: userProfile.id_colaborador
        ? EDescansoMedico.REGISTRO_INGRESADO
        : "",
      observacion: "",
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fecthDescansoMedico = async () => {
      if (isEditMode && id) {
        let idEmpresa = "";

        try {
          const responseDescanso = await getDescansoById(id);
          const { result, data } = responseDescanso;

          if (result && data) {
            const descanso = data as DescansoMedico;

            console.log({ descanso });

            const responseColaborador = await getColaboradorById(
              descanso.id_colaborador
            );

            const { result: resultColaborador, data: dataColaborador } =
              responseColaborador;

            if (resultColaborador && dataColaborador) {
              const { id_empresa } = dataColaborador as Colaborador;
              idEmpresa = id_empresa;
            }

            const dataForm = {
              // id: descanso.id || "",
              idEmpresa,
              idColaborador: descanso.id_colaborador,
              idTipoDescansoMedico: descanso.id_tipodescansomedico,
              idTipoContingencia: descanso.id_tipocontingencia,
              codigoCitt: descanso.codigo_citt || "",
              // fechaOtorgamiento: descanso.fecha_otorgamiento
              //   ? descanso.fecha_otorgamiento
              //   : "",
              // fechaInicio: descanso.fecha_inicio ? descanso.fecha_inicio : "",
              // fechaFinal: descanso.fecha_final ? descanso.fecha_final : "",
              fechaOtorgamiento: descanso.fecha_otorgamiento
                ? parseISO(descanso.fecha_otorgamiento)
                : null,
              fechaInicio: descanso.fecha_inicio
                ? parseISO(descanso.fecha_inicio)
                : null,
              fechaFinal: descanso.fecha_final
                ? parseISO(descanso.fecha_final)
                : null,
              totalDias: descanso.total_dias?.toString() || "",
              colegiadoMedico: descanso.numero_colegiatura,
              medicoTratante: descanso.medico_tratante,
              idDiagnostico: descanso.codcie10_diagnostico,
              nombreEstablecimiento: descanso.nombre_establecimiento,
              aceptaResponsabilidad: descanso.is_acepta_responsabilidad,
              aceptaPoliticaSubsidio: descanso.is_acepta_politica,
              estadoRegistro: descanso.estado_registro,
              observacion: descanso.observacion || "",
            };
            console.log("dataForm descanso médico", dataForm);
            form.reset(dataForm);
          }
        } catch (error) {
          showToast("error", "Error al cargar los datos del descanso médico.");
          console.error("Error fetching descanso medico:", error);
        }
      } else {
        // Crea un código temporal único por cada nuevo descanso médico
        if (userProfile) {
          const { id_empresa, id_colaborador } = userProfile;
          console.log({ id_empresa });
          console.log({ id_colaborador });
          form.setValue("idEmpresa", id_empresa);
          form.setValue("idColaborador", id_colaborador);
        }
        await createCodigoTempAuth();
        // const response = await createCodigoTempAuth();
        // console.log(
        //   "response create codigo_temp in new descanso médico",
        //   response
        // );
      }
    };
    fecthDescansoMedico();
  }, [id, isEditMode]);
  // [id, isEditMode, navigate, showToast, form]

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const {
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

      // Obteniendo la fecha actual en formato yyyy-mm-dd
      const fechaRegistro = HDate.formatDateTimezone(new Date());

      // Obtener el nombre del colaborador
      let nombreColaborador: string = "";
      const responseColaborador = await getColaboradorById(idColaborador);
      // console.log({ responseColaborador });
      const { result: resultCol, data: dataCol } = responseColaborador;

      if (resultCol && dataCol) {
        const { nombres, apellido_paterno, apellido_materno } =
          dataCol as Colaborador;
        nombreColaborador = `${nombres} ${apellido_paterno} ${apellido_materno}`;
      }

      // Obtener tipo de descanso médico
      let nombreTipoDescanso: string = "";
      const responseTipoDescanso = await getTipoDescansoById(
        idTipoDescansoMedico
      );
      // console.log({ responseTipoDescanso });

      const { result: resultTipoDescanso, data: dataTipoDescanso } =
        responseTipoDescanso;
      if (resultTipoDescanso && dataTipoDescanso) {
        const { nombre } = dataTipoDescanso as TipoDescansoMedico;
        nombreTipoDescanso = nombre;
      }

      // Obtener tipo de contingencia
      let nombreTipoContingencia: string = "";
      const responseTipoContingencia = await getTipoContingenciaById(
        idTipoContingencia
      );
      // console.log({ responseTipoContingencia });

      const { result: resultTipoContingencia, data: dataTipoContingencia } =
        responseTipoContingencia;
      if (resultTipoContingencia && dataTipoContingencia) {
        const { nombre } = dataTipoContingencia as TipoContingencia;
        nombreTipoContingencia = nombre;
      }

      // Obtener diagnóstico
      let nombreDiagnostico: string = "";
      const responseDiagnostico = await getDiagnosticoByCodigo(idDiagnostico);
      // console.log({ responseDiagnostico });
      const { result: resultDx, data: dataDx } = responseDiagnostico;

      if (resultDx && dataDx) {
        const { nombre } = dataDx as Diagnostico;
        nombreDiagnostico = nombre;
      }

      const payloadDescansoMedico: DescansoMedico = {
        // id: isEditMode && id ? id : undefined,
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
        response = await updateDescanso(id, payloadDescansoMedico); // Llama al servicio de actualización
      } else {
        response = await createDescanso(payloadDescansoMedico); // Llama al servicio de creación
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
        <CardHeader className="border-b border-gray-200">
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
                  {!userProfile.id_colaborador && (
                    <TabsTrigger
                      value="validacion"
                      className="bg-blue-400 hover:bg-blue-500 hover: cursor-pointer text-white transition-colors duration-300"
                    >
                      Validación
                    </TabsTrigger>
                  )}
                  {/* <TabsTrigger value="validacion">Validación</TabsTrigger> */}
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
                          className={
                            // Apply ring-red-500 for invalid state
                            `ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300
                            ${
                              fieldState.invalid
                                ? "text-red-500 focus-visible:ring-red-500 border-red-500"
                                : "text-blue-600 focus-visible:ring-blue-600 border-gray-300"
                            }`
                          }
                          // className={
                          //   fieldState.invalid
                          //     ? "border-red-500 text-red-500 focus:ring-red-500"
                          //     : ""
                          // }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <div className="flex items-center">
                            <label
                              htmlFor="responsabilidad"
                              className={`text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                fieldState.invalid ? "text-red-600" : ""
                              }`}
                              // className="text-sm text-gray-700"
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
                          // className={
                          //   fieldState.invalid
                          //     ? "border-red-500 text-red-500 focus:ring-red-500"
                          //     : ""
                          // }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <div className="flex items-center">
                            <label
                              htmlFor="politicaSubsidio"
                              className={`text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                fieldState.invalid ? "text-red-600" : ""
                              }`}
                              // className="text-sm text-gray-700"
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
                  onClick={() => navigate("/descanso-medico")}
                  className="hover:bg-gray-200 hover: cursor-pointer transition-colors duration-300"
                >
                  {isSubmitting ? "Cancelando..." : "Cancelar"}
                </Button>
              </div>
            </form>

            {/* Modales informativos */}
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
