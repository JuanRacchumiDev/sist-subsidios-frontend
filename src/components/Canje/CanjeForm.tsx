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
import { format, parseISO } from "date-fns";
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
import { ChevronDown, ChevronUp } from "lucide-react";

import { DescansoMedico } from "../../interfaces/IDescansoMedico";
import { Canje } from "../../interfaces/ICanje";
import { getCanjeById, updateCanje } from "../../services/canjeService";
import { useToast } from "../../context/ToastContext";
import HDate from "../../helpers/HDate";
import { ArrowLeft } from "lucide-react";
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

  const [descanso, setDescanso] = useState<DescansoMedico | null>(null);

  const [fechaMaximaCanje, setFechaMaximaCanje] = useState<string | "">("");

  const [idUserCrea, setIdUserCrea] = useState<string | "">("");

  const { id } = useParams<{ id: string }>();

  const isEditMode = !!id;

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  console.log({ userProfile });

  const { id_usuario } = userProfile;
  console.log({ id_usuario });

  const { showToast } = useToast();

  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el Collapsible

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

            const dataForm = {
              fechaCanje: canje.fecha_canje
                ? parseISO(canje.fecha_canje)
                : null,
              codigoCanje: canje.codigo_canje || "",
              codigoCitt: canje.codigo_citt || "",
              estadoRegistro: canje.estado_registro,
              observacion: canje.observacion || "",
            };
            form.reset(dataForm);

            const { fecha_maxima_canje, user_crea } = canje;

            setFechaMaximaCanje(fecha_maxima_canje);

            setIdUserCrea(user_crea);

            const descansoMedico = canje.descansoMedico;
            setDescanso(descansoMedico);
          }
        } catch (error) {
          showToast("error", "Error al cargar los datos del descanso médico.");
          console.error("Error fetching descanso medico:", error);
        }
      }
    };
    fetchData();
  }, [id, isEditMode]);

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
        user_crea: id_usuario,
      };

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
              <Collapsible
                className="w-full space-y-2"
                open={isOpen}
                onOpenChange={setIsOpen}
              >
                <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-2 font-medium transition-all hover:bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 cursor-pointer">
                  <span className="text-gray-700">
                    Ver datos del descanso médico
                  </span>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="space-y-2 overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 transition-all duration-300">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fechaCanje"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Fecha de canje</RequiredLabel>
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
                            className={`
                              ${
                                fieldState.invalid
                                  ? "border-red-500 focus:ring-red-500"
                                  : "focus:ring-blue-500"
                              }
                                focus:ring-2 focus:ring-offset-2 transition-all duration-300 cursor-pointer
                            `}
                          >
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-400">
                          {estadosPermitidos.map((estado) => (
                            <SelectItem
                              key={estado}
                              value={estado}
                              className="cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {showObservacion && (
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
                )}

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
                )}
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
                  onClick={() => navigate("/canje")}
                  className="hover:bg-gray-200 hover: cursor-pointer transition-colors duration-300"
                >
                  {isSubmitting ? "Cancelando..." : "Cancelar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
