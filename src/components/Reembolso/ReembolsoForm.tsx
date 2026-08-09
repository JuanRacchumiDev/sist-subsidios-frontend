import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Spinner } from "../Common/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { EReembolso } from "../../enums/EReembolso";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { RequiredLabel } from "../Common/RequiredLabel";
import { Input } from "../ui/input";
import { format, parseISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  Lock,
  RotateCcw,
  Save,
} from "lucide-react";

import { Canje } from "../../interfaces/ICanje";
import { Reembolso } from "../../interfaces/IReembolso";
import {
  getReembolsoById,
  updateReembolso,
} from "../../services/reembolsoService";
import { useToast } from "../../context/ToastContext";
import HDate from "../../helpers/HDate";
import { getAuthData } from "../../utils/authMemo";
import { Textarea } from "../ui/textarea";

export const formSchema = z.object({
  id: z.string().optional(),
  fechaSolicitud: z.string().optional().nullable(),
  valorDia: z.coerce.number().optional(),
  estadoRegistro: z.string({ message: "Debe seleccionar un estado" }),
  observacion: z.string().optional(),
});

export const ReembolsoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { showToast } = useToast();

  const [defineCanje, setDefineCanje] = useState<Canje | null>(null);
  const [fechaMaximoReembolso, setFechaMaximoReembolso] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [defineNombreColaborador, setDefineNombreColaborador] =
    useState<string>("");
  const [estado, setEstado] = useState<string | null>();

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  const id_usuario = userProfile?.id_usuario;

  const estadosPermitidos: EReembolso[] = useMemo(() => {
    return Object.values(EReembolso);
  }, []);

  const handleGoBack = () => {
    navigate("/reembolso");
  };

  type FormInput = z.input<typeof formSchema>;
  type FormOutput = z.infer<typeof formSchema>;

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      fechaSolicitud: "",
      valorDia: 0,
      estadoRegistro: EReembolso.REEMBOLSO_INGRESADO,
      observacion: "",
    },
  });

  const estadoRegistro = form.watch("estadoRegistro");
  const showObservacion = estadoRegistro === EReembolso.REEMBOLSO_OBSERVADO;
  const showPendienteSubsidio =
    estadoRegistro === EReembolso.PENDIENTE_SUBSIDIO;
  const showSolicitudEssalud = estadoRegistro === EReembolso.SOLICITUD_ESSALUD;

  console.log({ id });

  console.log({ isEditMode });

  useEffect(() => {
    const fetchData = async () => {
      // Log para depurar qué valor tiene id al montar el componente
      console.log("Componente montado. id:", id, "| isEditMode:", isEditMode);

      if (isEditMode && id) {
        console.log("Modo edición detectado. Solicitando datos para id:", id);
        try {
          const responseReembolso = await getReembolsoById(id);
          console.log("Respuesta recibida del backend:", responseReembolso);

          const { result, data } = responseReembolso;

          if (result && data) {
            const reembolso = data as Reembolso;
            console.log("Objeto reembolso:", reembolso);

            const {
              fecha_solicitud,
              valor_dia,
              estado_registro,
              nombre_colaborador,
              canje,
              fecha_maxima_reembolso,
              observacion,
            } = reembolso;

            setEstado(estado_registro);

            if (canje) {
              setDefineCanje(canje as Canje);
            }

            if (nombre_colaborador) {
              setDefineNombreColaborador(nombre_colaborador as string);
            }

            if (fecha_maxima_reembolso) {
              setFechaMaximoReembolso(fecha_maxima_reembolso as string);
            }

            const dataForm = {
              fechaSolicitud: fecha_solicitud || "",
              valorDia: valor_dia || 0,
              estadoRegistro: estado_registro || EReembolso.REEMBOLSO_INGRESADO,
              observacion: observacion || "",
            };

            console.log({ dataForm });

            // Actualizamos el formulario
            form.reset(dataForm);
          }
        } catch (error) {
          showToast("error", "Error al cargar los datos del reembolso.");
          console.error("Error fetching reembolso:", error);
        }
      } else {
        console.log("Modo creación (no edición)");
      }
    };

    fetchData();
  }, [id, isEditMode, form]); // Solo depender de id e isEditMode

  const isRegistroBloqueado =
    isEditMode && estado === EReembolso.REEMBOLSO_CORRECTO;

  const { isSubmitting } = form.formState;

  const isButtonDisabled = isSubmitting || isRegistroBloqueado;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { fechaSolicitud, valorDia, estadoRegistro, observacion } = values;

      const fechaActual = HDate.formatDateTimezone(new Date());

      const payloadReembolso: Reembolso = {
        fecha_solicitud: fechaSolicitud
          ? HDate.formatDateTimezone(fechaSolicitud)
          : undefined,
        valor_dia: valorDia,
        estado_registro: estadoRegistro as EReembolso,
        observacion,
      };

      if (isEditMode && id) {
        payloadReembolso.fecha_actualiza = fechaActual;
        payloadReembolso.user_actualiza = id_usuario;
      } else {
        payloadReembolso.fecha_registro = fechaActual;
        payloadReembolso.user_crea = id_usuario;
      }

      console.log({ payloadReembolso });

      const response = await updateReembolso(id!, payloadReembolso);
      const { result, message } = response;

      if (result) {
        showToast("success", message);
        navigate("/reembolso");
      } else {
        showToast("error", message || "Error al procesar el reembolso");
      }
    } catch (error: any) {
      console.error("Error al registrar reembolso", error);
      showToast("error", error?.message || "Ocurrió un error inesperado");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-3 px-2 sm:px-4">
      <Card className="shadow-md border border-slate-200 bg-white rounded-xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/60 pt-3 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                {isEditMode ? "Modo Edición" : "Nuevo Registro"}
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">
              {isEditMode ? "Editar reembolso" : "Nuevo registro de reembolso"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-normal text-xs">
              {isEditMode
                ? "Actualice la información general y médica de este registro."
                : "Complete todos los campos requeridos para registrar el reembolso"}
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
        {isRegistroBloqueado && (
          <div className="bg-amber-50 border-b border-amber-200 py-2 px-4 sm:px-5 flex items-center gap-2 text-amber-800 text-xs font-medium">
            <Lock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              Este reembolso ya cuenta con el estado{" "}
              <strong>"Registro conforme"</strong> y no se puede modificar.
            </span>
          </div>
        )}

        <CardContent className="pb-4 px-4 sm:pb-5 sm:px-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="border border-blue-100 rounded-lg bg-blue-50/20 overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-blue-50/50 transition-colors">
                    <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-xs">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span>Información del Canje Relacionado</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full text-slate-500"
                    >
                      {isOpen ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="px-3 pb-3 pt-1 border-t border-blue-100/60">
                  <div className="grid grid-cols-12 gap-2.5">
                    {/* FILA 1 */}
                    {/* Colaborador - 6 columnas */}
                    <div className="col-span-12 md:col-span-6 space-y-0.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                        Colaborador
                      </label>
                      <p className="text-xs font-medium text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                        {defineNombreColaborador ||
                          defineCanje?.descansoMedico?.colaborador_dm
                            ?.nombre_completo ||
                          "---"}
                      </p>
                    </div>

                    {/* Tipo Descanso - 3 columnas */}
                    <div className="col-span-6 md:col-span-3 space-y-0.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                        Tipo Descanso
                      </label>
                      <p className="text-xs font-medium text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                        {defineCanje?.nombre_tipodescansomedico ||
                          defineCanje?.descansoMedico
                            ?.nombre_tipodescansomedico ||
                          "---"}
                      </p>
                    </div>

                    {/* Tipo Contingencia - 3 columnas */}
                    <div className="col-span-6 md:col-span-3 space-y-0.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                        Tipo Contingencia
                      </label>
                      <p className="text-xs font-medium text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                        {defineCanje?.nombre_tipocontingencia ||
                          defineCanje?.descansoMedico
                            ?.nombre_tipocontingencia ||
                          "---"}
                      </p>
                    </div>

                    {/* FILA 2 */}
                    {/* Inicio Descanso - 3 columnas */}
                    <div className="col-span-6 md:col-span-3 space-y-0.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                        Inicio Descanso
                      </label>
                      <p className="text-xs font-medium text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                        {defineCanje?.descansoMedico?.fecha_inicio
                          ? HDate.formatDateTimezone(
                              defineCanje.descansoMedico.fecha_inicio,
                              "dd/MM/yyyy",
                            )
                          : "---"}
                      </p>
                    </div>

                    {/* Fin Descanso - 3 columnas */}
                    <div className="col-span-6 md:col-span-3 space-y-0.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                        Fin Descanso
                      </label>
                      <p className="text-xs font-medium text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                        {defineCanje?.descansoMedico?.fecha_final
                          ? HDate.formatDateTimezone(
                              defineCanje.descansoMedico.fecha_final,
                              "dd/MM/yyyy",
                            )
                          : "---"}
                      </p>
                    </div>

                    {/* Días Totales - 3 columnas */}
                    <div className="col-span-6 md:col-span-3 space-y-0.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                        Días Totales
                      </label>
                      <p className="text-xs font-medium text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                        {defineCanje?.descansoMedico?.total_dias
                          ? `${defineCanje.descansoMedico.total_dias} días`
                          : "---"}
                      </p>
                    </div>

                    {/* Fecha Máxima Reembolso - 3 columnas */}
                    <div className="col-span-6 md:col-span-3 space-y-0.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                        Fecha Máxima Reembolso
                      </label>
                      <p className="text-xs font-medium text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                        {fechaMaximoReembolso
                          ? HDate.formatDateTimezone(
                              fechaMaximoReembolso,
                              "dd/MM/yyyy",
                            )
                          : "---"}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* FORMULARIO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="estadoRegistro"
                  render={({ field, fieldState }) => (
                    <FormItem
                      className={`space-y-1.5 transition-all duration-200 ${
                        !showPendienteSubsidio
                          ? "md:col-span-3 lg:col-span-1"
                          : ""
                      }`}
                    >
                      <RequiredLabel className="text-xs font-semibold text-slate-700">
                        Estado del registro
                      </RequiredLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                        disabled={isButtonDisabled}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`w-full h-9 text-xs bg-white shadow-sm transition-colors ${
                              fieldState.invalid
                                ? "border-red-500 focus:ring-red-200"
                                : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            }`}
                          >
                            <SelectValue placeholder="Seleccione estado..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-slate-200 shadow-md">
                          {estadosPermitidos.map((estado) => (
                            <SelectItem
                              key={estado}
                              value={estado}
                              className="cursor-pointer text-xs font-medium hover:bg-slate-100 py-2 focus:bg-slate-100"
                            >
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                {showSolicitudEssalud && (
                  <>
                    <FormField
                      control={form.control}
                      name="fechaSolicitud"
                      render={({ field, fieldState }) => (
                        <FormItem className="space-y-1.5">
                          <RequiredLabel className="text-xs font-semibold text-slate-700">
                            Fecha de solicitud
                          </RequiredLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                              <Input
                                type="date"
                                value={
                                  field.value
                                    ? format(
                                        typeof field.value === "string"
                                          ? parseISO(field.value)
                                          : field.value,
                                        "yyyy-MM-dd",
                                      )
                                    : ""
                                }
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseISO(e.target.value)
                                      : null,
                                  )
                                }
                                className={`pl-9 h-9 text-xs bg-white shadow-sm transition-colors ${
                                  fieldState.invalid
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                }`}
                                disabled={isButtonDisabled}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {showPendienteSubsidio && (
                  <FormField
                    control={form.control}
                    name="valorDia"
                    render={({ field, fieldState }) => (
                      <FormItem className="space-y-1.5">
                        <RequiredLabel className="text-xs font-semibold text-slate-700">
                          Valor por día
                        </RequiredLabel>
                        <FormControl>
                          <div className="relative">
                            <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                            <Input
                              type="number"
                              placeholder="10.00"
                              autoComplete="off"
                              maxLength={20}
                              value={(field.value as number | string) ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(
                                  val === "" ? undefined : parseFloat(val),
                                );
                              }}
                              // onBlur={field.onBlur} // Recomendado incluir onBlur
                              // name={field.name} // Recomendado incluir name
                              // ref={field.ref} // Recomendado incluir ref para auto-focus de errores
                              className={`pl-9 h-9 text-xs bg-white shadow-sm transition-colors ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-200"
                                  : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              }`}
                              disabled={isButtonDisabled}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {showObservacion && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <FormField
                    control={form.control}
                    name="observacion"
                    render={({ field, fieldState }) => (
                      <FormItem className="space-y-1">
                        <RequiredLabel className="text-xs font-medium">
                          Detalles de Observación / Documentación Pendiente
                        </RequiredLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Motivos de la observación o documentos faltantes..."
                            className={`min-h-[70px] text-xs bg-white resize-none focus-visible:ring-1 ${
                              fieldState.invalid
                                ? "border-red-500"
                                : "border-slate-300"
                            }`}
                            {...field}
                            disabled={isButtonDisabled}
                          />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* ACCIONES */}
              <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={handleGoBack}
                  className="w-full sm:w-auto h-8 text-xs text-slate-600 border-slate-200 hover:bg-slate-100 rounded-md px-3"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Restablecer
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  // disabled={isSubmitting}
                  // className="w-full sm:w-auto h-8 text-xs rounded-md px-4 font-medium transition-all bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isButtonDisabled}
                  className={`w-full sm:w-auto h-8 text-xs rounded-md px-4 font-medium transition-all ${
                    isRegistroBloqueado
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      {isEditMode ? "Guardando..." : "Procesando..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5 mr-1.5" />
                      {isEditMode ? "Actualizar registro" : "Guardar registro"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
