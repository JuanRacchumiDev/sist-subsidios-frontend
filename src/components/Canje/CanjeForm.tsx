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
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

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
  codigoCanje: z.string().min(1, "El código de canje es requerido"),
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
      codigoCanje: "",
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
              codigo_canje,
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
              codigoCanje: codigo_canje || "",
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
      const {
        fechaCanje,
        codigoCanje,
        codigoCitt,
        estadoRegistro,
        observacion,
      } = values;

      console.log({ idUserCrea });

      const payloadCanje: Canje = {
        fecha_canje: HDate.formatDateTimezone(fechaCanje),
        codigo_canje: codigoCanje,
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
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between">
          <div className="flex-shrink min-w-0">
            <CardTitle className="text-xl font-bold text-gray-800">
              {isEditMode ? "Actualización de canje" : "Registro de canje"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {isEditMode
                ? "Formulario de actualización de canje"
                : "Complete el formulario para registrar un canje"}
            </CardDescription>
          </div>
          <button
            onClick={handleGoBack}
            className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors rounded-md p-2 ml-4 cursor-pointer"
            aria-label="Volver al listado"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </button>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Collapsible
                className="w-full space-y-2"
                open={isOpen}
                onOpenChange={setIsOpen}
              >
                <div className="flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 px-4 py-2 font-medium transition-all hover:bg-blue-100 cursor-pointer">
                  <span className="text-blue-700 font-semibold">
                    Ver datos del descanso médico
                  </span>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-9 p-0 text-blue-700 hover:bg-blue-200"
                    >
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2 overflow-hidden transition-all duration-300">
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Colaborador
                        </label>
                        <Input
                          disabled
                          value={descanso?.colaborador_dm.nombre_completo || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de descanso médico
                        </label>
                        <Input
                          disabled
                          value={descanso?.nombre_tipodescansomedico || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de contingencia
                        </label>
                        <Input
                          disabled
                          value={descanso?.nombre_tipocontingencia || ""}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Inicio Descanso
                        </label>
                        <Input
                          disabled
                          value={
                            descanso?.fecha_inicio
                              ? HDate.formatDateTimezone(
                                  descanso.fecha_inicio,
                                  "dd/MM/yyyy",
                                )
                              : ""
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fin Descanso
                        </label>
                        <Input
                          disabled
                          value={
                            descanso?.fecha_final
                              ? HDate.formatDateTimezone(
                                  descanso.fecha_final,
                                  "dd/MM/yyyy",
                                )
                              : ""
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Días
                        </label>
                        <Input disabled value={descanso?.total_dias || ""} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha Máxima Canje
                        </label>
                        <Input
                          disabled
                          value={
                            fechaMaximaCanje
                              ? HDate.formatDateTimezone(
                                  fechaMaximaCanje,
                                  "dd/MM/yyyy",
                                )
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="fechaCanje"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Fecha de canje</RequiredLabel>
                      <FormControl>
                        <Input
                          type="date"
                          max={maxInputDate}
                          value={
                            field.value ? format(field.value, "yyyy-MM-dd") : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseISO(e.target.value) : null,
                            )
                          }
                          className={
                            fieldState.invalid
                              ? "border-red-500"
                              : "focus:ring-blue-500"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codigoCanje"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Código</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Código de canje"
                          autoComplete="off"
                          maxLength={20}
                          {...field}
                          className={
                            fieldState.invalid
                              ? "border-red-500"
                              : "focus:ring-blue-500"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estadoRegistro"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Estado del registro</RequiredLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={
                              fieldState.invalid
                                ? "border-red-500"
                                : "focus:ring-blue-500"
                            }
                          >
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-400">
                          {estadosPermitidos.map((estado) => (
                            <SelectItem
                              key={estado}
                              value={estado}
                              className="cursor-pointer"
                            >
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {showCodigoCitt && (
                  <FormField
                    control={form.control}
                    name="codigoCitt"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Código Citt</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="Código CITT"
                            autoComplete="off"
                            maxLength={20}
                            {...field}
                            className={
                              fieldState.invalid
                                ? "border-red-500"
                                : "focus:ring-blue-500"
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* <div className="grid grid-cols-1 gap-6"> */}
              {showObservacion && (
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="observacion"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Observación</RequiredLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detalle la documentación pendiente..."
                            {...field}
                            className={
                              fieldState.invalid
                                ? "border-red-500"
                                : "focus:ring-blue-500"
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {/* </div> */}

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors"
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
                  onClick={() => navigate("/canje")}
                  className="hover:bg-gray-200 cursor-pointer"
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
