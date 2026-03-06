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
import { EReembolso } from "@/enums/EReembolso";
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

import { Reembolso } from "../../interfaces/IReembolso";
import {
  getReembolsoById,
  updateReembolso,
} from "../../services/reembolsoService";
import { useToast } from "../../context/ToastContext";
import HDate from "../../helpers/HDate";
import { getAuthData } from "../../utils/authMemo";

export const formSchema = z.object({
  id: z.string().optional(),
  // fechaPago: z
  //   .date({
  //     message: "La fecha de pago es requerida",
  //   })
  //   .nullable()
  //   .refine((val) => val !== null, {
  //     message: "La fecha de pago es requerida",
  //   }),
  fechaPago: z.string().optional(),
  numeroExpediente: z.string().optional(),
  estadoRegistro: z.string({ message: "Debe seleccionar un estado" }),
});

export const ReembolsoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { showToast } = useToast();

  const [idUserCrea, setIdUserCrea] = useState<string | "">("");
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el Collapsible

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  console.log({ userProfile });

  const { id_usuario } = userProfile;
  console.log({ id_usuario });

  const estadosPermitidos: EReembolso[] = useMemo(() => {
    return Object.values(EReembolso);
  }, []);

  const handleGoBack = () => {
    navigate("/reembolso");
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      fechaPago: null,
      numeroExpediente: "",
      estadoRegistro: EReembolso.REEMBOLSO_INGRESADO,
    },
  });

  const estadoRegistro = form.watch("estadoRegistro");
  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode && id) {
        try {
          const responseReembolso = await getReembolsoById(id);

          console.log({ responseReembolso });

          const { result, data } = responseReembolso;

          if (result && data) {
            const reembolso = data as Reembolso;

            console.log({ reembolso });

            const {
              fecha_pago,
              numero_expediente,
              estado_registro,
              user_crea,
            } = reembolso;

            const dataForm = {
              fechaPago: fecha_pago || null,
              numeroExpediente: numero_expediente || "",
              estadoRegistro: estado_registro,
            };

            form.reset(dataForm);

            setIdUserCrea(user_crea);
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
      const { fechaPago, numeroExpediente, estadoRegistro } = values;

      const payloadReembolso: Reembolso = {
        fecha_pago: HDate.formatDateTimezone(fechaPago),
        numero_expediente: numeroExpediente,
        estado_registro: estadoRegistro as EReembolso,
      };

      if (isEditMode && id) {
        payloadReembolso.user_actualiza = id_usuario;
      } else {
        payloadReembolso.user_crea = id_usuario;
      }

      console.log({ payloadReembolso });

      const response = await updateReembolso(id, payloadReembolso);

      const { result, message } = response;

      if (result) {
        showToast("success", message);
        navigate("/reembolso");
      } else {
        showToast("error", message || "Error al procesar el reembolso");
      }
    } catch (error) {
      console.error("Error al registrar reembolso", error);
      showToast("error", error);
    }
  };

  return (
    <>
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="border-b border-gray-200 p-4 sm:p-6 flex flex-row items-center justify-between">
          <div className="flex-shrink min-w-0">
            <CardTitle className="text-xl font-bold text-gray-800">
              {isEditMode
                ? "Actualización de reembolso"
                : "Registro de reembolso"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {isEditMode
                ? "Formulario de actualización de reembolso"
                : "Complete el formulario para registrar un reembolso"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="fechaPago"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Fecha de pago</RequiredLabel>
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
                  name="numeroExpediente"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Número de expediente</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Número de expediente"
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
              </div>

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
                  onClick={() => navigate("/reembolso")}
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
