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
import { ArrowLeft, ChevronDown, ChevronUp, Info } from "lucide-react";

import { Canje } from "../../interfaces/ICanje";
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
  fechaPago: z.string().optional(),
  numeroExpediente: z.string().optional(),
  estadoRegistro: z.string({ message: "Debe seleccionar un estado" }),
});

export const ReembolsoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { showToast } = useToast();

  const [canje, setCanje] = useState<Canje | null>(null);
  const [fechaMaximoReembolso, setFechaMaximoReembolso] = useState<string | "">(
    "",
  );
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
  const showObservacion = estadoRegistro === EReembolso.REEMBOLSO_OBSERVADO;
  const showCodigo = estadoRegistro === EReembolso.REEMBOLSO_CONFORME;
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
              canje,
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
      <Card className="max-w-5xl mx-auto shadow-xl border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200 flex flex-row items-center justify-between py-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold text-slate-900">
              {isEditMode
                ? "Actualización de reembolso"
                : "Registro de reembolso"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {isEditMode
                ? "Modifique los detalles del reembolso de subsidio"
                : "Ingrese la información necesaria para el procesos de reembolso"}
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
                      <span>Información del Canje Relacionado</span>
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
                        {canje.descansoMedico.colaborador_dm.nombre_completo ||
                          "---"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Tipo Descanso médico
                      </label>
                      <p className="text-sm font-semibold text-slate-800 bg-white p-2 rounded border border-blue-100">
                        {canje.descansoMedico.nombre_tipodescansomedico ||
                          "---"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Tipo Contingencia
                      </label>
                      <p className="text-sm font-semibold text-slate-800 bg-white p-2 rounded border border-blue-100">
                        {canje.descansoMedico.nombre_tipocontingencia || "---"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Inicio descanso médico
                      </label>
                      <p className="text-sm font-semibold text-slate-800 bg-white p-2 rounded border border-blue-100">
                        {canje.descansoMedico.fecha_inicio
                          ? HDate.formatDateTimezone(
                              canje.descansoMedico.fecha_inicio,
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
                        {canje.descansoMedico.fecha_final
                          ? HDate.formatDateTimezone(
                              canje.descansoMedico.fecha_final,
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
                        {canje.descansoMedico.total_dias || 0} días
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Fecha máxima reembolso
                      </label>
                      <p className="text-sm font-semibold text-slate-800 bg-white p-2 rounded border border-blue-100">
                        {fechaMaximoReembolso
                          ? HDate.formatDateTimezone(
                              fechaMaximoReembolso,
                              "dd/MM/yyyy",
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

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
