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
import { ECanje } from "../../enums/ECanje";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { RequiredLabel } from "../Common/RequiredLabel";
import { Input } from "../ui/input";
import { format, parseISO, addDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Calendar,
  Info,
  ClipboardCheck,
  RotateCcw,
  Save,
  Lock,
  CalendarDays,
  FileCheck2,
} from "lucide-react";

import { DescansoMedico } from "../../interfaces/IDescansoMedico";
import { Canje } from "../../interfaces/ICanje";
import { getCanjeById, updateCanje } from "../../services/canjeService";
import { useToast } from "../../context/ToastContext";
import HDate from "../../helpers/HDate";
import { getAuthData } from "../../utils/authMemo";

export const formSchema = z.object({
  id: z.string().optional(),
  fechaCanje: z
    .date({
      message: "La fecha de canje es requerida",
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "La fecha de canje es requerida",
    }),
  codigoCitt: z.string().optional(),
  estadoRegistro: z.string({ message: "Debe seleccionar un estado" }),
  observacion: z.string().optional(),
});

export const CanjeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { showToast } = useToast();

  const [descanso, setDescanso] = useState<DescansoMedico | null>(null);
  const [canje, setCanje] = useState<Canje | null>(null);
  const [fechaMaximaCanje, setFechaMaximaCanje] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  const { id_usuario } = userProfile || {};

  const estadosPermitidos: ECanje[] = useMemo(() => {
    return Object.values(ECanje);
  }, []);

  const handleGoBack = () => {
    navigate("/canje");
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      fechaCanje: null,
      codigoCitt: "",
      estadoRegistro: ECanje.CANJE_REGISTRADO,
      observacion: "",
    },
  });

  const estadoRegistro = form.watch("estadoRegistro");
  const showObservacion = estadoRegistro === ECanje.CANJE_ORSERVADO;
  const showCodigoCitt = estadoRegistro === ECanje.CANJE_CONFORME;

  const maxInputDate = useMemo(() => {
    if (!fechaMaximaCanje) return undefined;
    const date = parseISO(fechaMaximaCanje);
    return format(addDays(date, 7), "yyyy-MM-dd");
  }, [fechaMaximaCanje]);

  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode && id) {
        try {
          const responseCanje = await getCanjeById(id);
          const { result, data } = responseCanje;

          if (result && data) {
            const dataCanje = data as Canje;
            const {
              fecha_canje,
              fecha_maxima_canje,
              codigo_citt,
              estado_registro,
              observacion,
              descansoMedico,
            } = dataCanje;

            setFechaMaximaCanje(fecha_maxima_canje || "");
            setCanje(dataCanje);
            setDescanso(descansoMedico || null);

            let fechaDefault: Date | null = null;
            if (fecha_canje) {
              fechaDefault = parseISO(fecha_canje);
            } else if (fecha_maxima_canje) {
              fechaDefault = addDays(parseISO(fecha_maxima_canje), 7);
            }

            form.reset({
              id,
              fechaCanje: fechaDefault,
              codigoCitt: codigo_citt || "",
              estadoRegistro: estado_registro,
              observacion: observacion || "",
            });
          }
        } catch (error) {
          showToast("error", "Error al cargar los datos del canje.");
          console.error("Error fetching canje:", error);
        }
      }
    };
    fetchData();
  }, [id, isEditMode, form]);

  const isRegistroBloqueado =
    isEditMode && canje && canje.estado_registro === ECanje.CANJE_CONFORME;

  const { isSubmitting } = form.formState;
  const isButtonDisabled = isSubmitting || isRegistroBloqueado;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { fechaCanje, codigoCitt, estadoRegistro, observacion } = values;
      const fechaActual = HDate.formatDateTimezone(new Date());

      const payloadCanje: Canje = {
        fecha_canje: fechaCanje ? HDate.formatDateTimezone(fechaCanje) : "",
        codigo_citt: codigoCitt,
        estado_registro: estadoRegistro as ECanje,
        observacion,
      };

      if (isEditMode && id) {
        payloadCanje.fecha_actualiza = fechaActual;
        payloadCanje.user_actualiza = id_usuario;
      } else {
        payloadCanje.fecha_registro = fechaActual;
        payloadCanje.user_crea = id_usuario;
      }

      const response = await updateCanje(id, payloadCanje);
      const { result, message } = response;

      if (result) {
        showToast("success", message);
        navigate("/canje");
      } else {
        showToast("error", message || "Error al procesar el canje");
      }
    } catch (error) {
      console.error("Error al registrar canje", error);
      showToast("error", "Error al guardar el registro.");
    }
  };

  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return "---";
    try {
      return HDate.formatDateTimezone(dateString, "dd/MM/yyyy");
    } catch {
      return "---";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-3 px-2 sm:px-4">
      <Card className="shadow-md border border-slate-200 bg-white rounded-xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/60 pt-3 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                {isEditMode ? "Modo Edición" : "Nuevo Registro"}
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">
              {isEditMode ? "Editar canje" : "Nuevo registro de canje"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-normal text-xs">
              {isEditMode
                ? "Actualice la información general y médica de este registro."
                : "Complete todos los campos requeridos para registrar el canje"}
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

        {isRegistroBloqueado && (
          <div className="bg-amber-50 border-b border-amber-200 py-2 px-4 sm:px-5 flex items-center gap-2 text-amber-800 text-xs font-medium">
            <Lock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              Este canje ya cuenta con el estado{" "}
              <strong>"Registro conforme"</strong> y no se puede modificar.
            </span>
          </div>
        )}

        <CardContent className="pb-4 px-4 sm:pb-5 sm:px-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pt-4"
            >
              {/* Información del Descanso Médico y Canje (Collapsible) */}
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="border border-indigo-100 rounded-lg bg-indigo-50/20 overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-indigo-50/50 transition-colors">
                    <div className="flex items-center gap-1.5 text-indigo-950 font-semibold text-xs">
                      <Info className="h-4 w-4 text-indigo-600" />
                      <span>Información del Descanso Médico y Canje</span>
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
                <CollapsibleContent className="px-3 pb-3 pt-2 border-t border-indigo-100/60 space-y-3">
                  {/* SECCIÓN DESCANSO MÉDICO */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      <FileCheck2 className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Detalle del Descanso Médico</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2.5">
                      <div className="col-span-12 md:col-span-6 space-y-0.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                          Colaborador
                        </label>
                        <p className="text-xs font-medium text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                          {descanso?.colaborador_dm?.nombre_completo || "---"}
                        </p>
                      </div>

                      <div className="col-span-6 md:col-span-3 space-y-0.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                          Tipo Descanso
                        </label>
                        <p className="text-xs font-medium text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                          {descanso?.nombre_tipodescansomedico || "---"}
                        </p>
                      </div>

                      <div className="col-span-6 md:col-span-3 space-y-0.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                          Tipo Contingencia
                        </label>
                        <p className="text-xs font-medium text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                          {descanso?.nombre_tipocontingencia || "---"}
                        </p>
                      </div>

                      <div className="col-span-6 md:col-span-3 space-y-0.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                          Inicio Descanso
                        </label>
                        <p className="text-xs font-medium text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                          {formatDateDisplay(descanso?.fecha_inicio)}
                        </p>
                      </div>

                      <div className="col-span-6 md:col-span-3 space-y-0.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                          Fin Descanso
                        </label>
                        <p className="text-xs font-medium text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                          {formatDateDisplay(descanso?.fecha_final)}
                        </p>
                      </div>

                      <div className="col-span-6 md:col-span-3 space-y-0.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                          Total Días
                        </label>
                        <p className="text-xs font-semibold text-indigo-700 bg-indigo-50/60 p-1.5 px-2 rounded border border-indigo-100 truncate">
                          {descanso?.total_dias ?? 0} días
                        </p>
                      </div>

                      <div className="col-span-6 md:col-span-3 space-y-0.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                          Fecha Máxima Canje
                        </label>
                        <p className="text-xs font-semibold text-slate-800 bg-white p-1.5 px-2 rounded border border-slate-200/80 truncate">
                          {formatDateDisplay(
                            canje?.fecha_maxima_canje || fechaMaximaCanje,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN INFORMACIÓN DE SUBSIDIO / CANJE */}
                  <div className="space-y-2 pt-2 border-t border-indigo-100/80">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      <CalendarDays className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Detalle del Subsidio / Canje (Informativo)</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2.5">
                      <div className="col-span-6 md:col-span-4 space-y-0.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                          Inicio Subsidio
                        </label>
                        <p className="text-xs font-medium text-slate-700 bg-slate-50 p-1.5 px-2 rounded border border-slate-200/80 truncate">
                          {formatDateDisplay(canje?.fecha_inicio_subsidio)}
                        </p>
                      </div>

                      <div className="col-span-6 md:col-span-4 space-y-0.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                          Fin Subsidio
                        </label>
                        <p className="text-xs font-medium text-slate-700 bg-slate-50 p-1.5 px-2 rounded border border-slate-200/80 truncate">
                          {formatDateDisplay(canje?.fecha_final_subsidio)}
                        </p>
                      </div>

                      <div className="col-span-12 md:col-span-4 space-y-0.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                          Días Subsidio
                        </label>
                        <p className="text-xs font-medium text-slate-700 bg-slate-50 p-1.5 px-2 rounded border border-slate-200/80 truncate">
                          {canje?.total_dias ?? 0} días
                        </p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="fechaCanje"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-1">
                      <RequiredLabel className="text-xs font-medium">
                        Fecha de canje
                      </RequiredLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                          <Input
                            type="date"
                            max={maxInputDate}
                            autoComplete="off"
                            disabled={isButtonDisabled}
                            className={`pl-8 h-8 text-xs focus-visible:ring-1 ${
                              fieldState.invalid
                                ? "border-red-500"
                                : "border-slate-300"
                            }`}
                            {...field}
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
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estadoRegistro"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-1">
                      <RequiredLabel className="text-xs font-medium">
                        Estado del registro
                      </RequiredLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                        disabled={isButtonDisabled}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`h-8 text-xs bg-white ${
                              fieldState.invalid
                                ? "border-red-500"
                                : "border-slate-300"
                            }`}
                          >
                            <SelectValue placeholder="Seleccione estado..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          {estadosPermitidos.map((estado) => (
                            <SelectItem
                              key={estado}
                              value={estado}
                              className="cursor-pointer text-xs font-medium hover:bg-slate-100 py-1.5"
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

                {showCodigoCitt && (
                  <FormField
                    control={form.control}
                    name="codigoCitt"
                    render={({ field, fieldState }) => (
                      <FormItem className="space-y-1">
                        <RequiredLabel className="text-xs font-medium">
                          Código CITT
                        </RequiredLabel>
                        <FormControl>
                          <div className="relative">
                            <ClipboardCheck className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                            <Input
                              placeholder="Ingrese CITT"
                              autoComplete="off"
                              maxLength={15}
                              className={`pl-8 h-8 text-xs focus-visible:ring-1 ${
                                fieldState.invalid
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                              {...field}
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

              {/* Observación Section */}
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
                            autoComplete="off"
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

              {/* Form Footer Action Buttons */}
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
