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
import { ECanje } from "@/enums/ECanje";
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
  const [fechaMaximaCanje, setFechaMaximaCanje] = useState<string | "">("");
  const [idUserCrea, setIdUserCrea] = useState<string | "">("");
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el Collapsible

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  console.log({ userProfile });

  const { id_usuario } = userProfile;
  console.log({ id_usuario });

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
  const { isSubmitting } = form.formState;

  // Lógica para calcular la fecha máxima de canje permitida
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

          console.log({ responseCanje });

          const { result, data } = responseCanje;

          if (result && data) {
            const canje = data as Canje;

            console.log({ canje });

            const {
              fecha_canje,
              fecha_maxima_canje,
              codigo_citt,
              estado_registro,
              observacion,
              user_crea,
              descansoMedico,
            } = canje;

            let fechaDefault: Date | null = null;

            if (fecha_canje) {
              fechaDefault = parseISO(fecha_canje);
            } else if (fecha_maxima_canje) {
              fechaDefault = addDays(parseISO(fecha_maxima_canje), 7);
            }

            const dataForm = {
              fechaCanje: fechaDefault,
              codigoCitt: codigo_citt || "",
              estadoRegistro: estado_registro,
              observacion: observacion || "",
            };

            form.reset(dataForm);

            setFechaMaximaCanje(fecha_maxima_canje);
            setIdUserCrea(user_crea);
            setDescanso(descansoMedico);
          }
        } catch (error) {
          showToast("error", "Error al cargar los datos del descanso médico.");
          console.error("Error fetching descanso medico:", error);
        }
      }
    };
    fetchData();
  }, [id, isEditMode, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { fechaCanje, codigoCitt, estadoRegistro, observacion } = values;

      console.log({ idUserCrea });

      const payloadCanje: Canje = {
        fecha_canje: HDate.formatDateTimezone(fechaCanje),
        codigo_citt: codigoCitt,
        estado_registro: estadoRegistro as ECanje,
        observacion,
      };

      if (isEditMode && id) {
        payloadCanje.user_actualiza = id_usuario;
      } else {
        payloadCanje.user_crea = id_usuario;
      }

      console.log({ payloadCanje });

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
      showToast("error", error);
    }
  };

  return (
    <>
      <Card className="max-w-5xl mx-auto shadow-xl border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200 flex flex-row items-center justify-between py-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold text-slate-900">
              {isEditMode ? "Actualización de Canje" : "Registro de Canje"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {isEditMode
                ? "Modifique los detalles del canje de subsidio"
                : "Ingrese la información necesaria para el proceso de canje"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold transition-all"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver
          </Button>
        </CardHeader>

        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="group border border-blue-100 rounded-xl bg-blue-50/30 overflow-hidden transition-all shadow-sm"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-2 text-blue-800 font-bold">
                      <Info className="h-5 w-5" />
                      <span>Información del Descanso Médico Relacionado</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-5 pb-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Colaborador
                      </label>
                      <p className="text-sm font-semibold text-slate-800 bg-white p-2 rounded border border-blue-100">
                        {descanso?.colaborador_dm.nombre_completo || "---"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Tipo Descanso médico
                      </label>
                      <p className="text-sm font-semibold text-slate-800 bg-white p-2 rounded border border-blue-100">
                        {descanso?.nombre_tipodescansomedico || "---"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Tipo Contingencia
                      </label>
                      <p className="text-sm font-semibold text-slate-800 bg-white p-2 rounded border border-blue-100">
                        {descanso?.nombre_tipocontingencia || "---"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Inicio descanso médico
                      </label>
                      <p className="text-sm font-semibold text-slate-800 bg-white p-2 rounded border border-blue-100">
                        {descanso?.fecha_inicio
                          ? HDate.formatDateTimezone(
                              descanso.fecha_inicio,
                              "dd/MM/yyyy",
                            )
                          : ""}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Fin descanso médico
                      </label>
                      <p className="text-sm font-semibold text-slate-800 bg-white p-2 rounded border border-blue-100">
                        {descanso?.fecha_final
                          ? HDate.formatDateTimezone(
                              descanso.fecha_final,
                              "dd/MM/yyyy",
                            )
                          : ""}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Días Totales
                      </label>
                      <p className="text-sm font-semibold text-slate-800 bg-white p-2 rounded border border-blue-100">
                        {descanso?.total_dias || 0} días
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Fecha máxima canje
                      </label>
                      <p className="text-sm font-semibold text-slate-800 bg-white p-2 rounded border border-blue-100">
                        {fechaMaximaCanje
                          ? HDate.formatDateTimezone(
                              fechaMaximaCanje,
                              "dd/MM/yyyy",
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
                <FormField
                  control={form.control}
                  name="fechaCanje"
                  render={({ field, fieldState }) => (
                    <FormItem className="md:col-span-2 lg:col-span-1">
                      <RequiredLabel>Fecha de canje</RequiredLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                          <Input
                            type="date"
                            max={maxInputDate}
                            className={`pl-10 focus:ring-2 focus:ring-blue-500/20 ${fieldState.invalid ? "border-red-500" : "border-slate-300"}`}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estadoRegistro"
                  render={({ field, fieldState }) => (
                    <FormItem className="md:col-span-2 lg:col-span-2">
                      <RequiredLabel>Estado del registro</RequiredLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`h-10 bg-white font-medium ${fieldState.invalid ? "border-red-500" : "border-slate-300 focus:ring-blue-500/20"}`}
                          >
                            <SelectValue placeholder="Seleccione el estado actual..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          {estadosPermitidos.map((estado) => (
                            <SelectItem
                              key={estado}
                              value={estado}
                              className="cursor-pointer font-medium hover:bg-slate-100"
                            >
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showCodigoCitt && (
                  <FormField
                    control={form.control}
                    name="codigoCitt"
                    render={({ field, fieldState }) => (
                      <FormItem className="md:col-span-2">
                        <RequiredLabel>Código CITT</RequiredLabel>
                        <FormControl>
                          <div className="relative">
                            <ClipboardCheck className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                            <Input
                              placeholder="Ingrese el CITT"
                              className={`pl-10 focus:ring-2 focus:ring-blue-500/20 ${fieldState.invalid ? "border-red-500" : "border-slate-300"}`}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {showObservacion && (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <FormField
                    control={form.control}
                    name="observacion"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>
                          Detalles de Observación / Documentación Pendiente
                        </RequiredLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escriba aquí los motivos de la observación o documentos faltantes..."
                            className={`min-h-[100px] bg-white resize-none focus:ring-2 focus:ring-blue-500/20 ${fieldState.invalid ? "border-red-500" : "border-slate-300"}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => navigate("/canje")}
                  className="w-full sm:w-auto px-8 h-11 font-bold text-slate-600 hover:bg-slate-100 transition-all border-slate-300"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 h-11 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : isEditMode ? (
                    "Guardar Cambios"
                  ) : (
                    "Confirmar Registro"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
