import { useToast } from "@/context/ToastContext";
import { getAuthData } from "@/utils/authMemo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import {
  getConfiguracionById,
  createConfiguracion,
  updateConfiguracion,
} from "../../services/configuracionService";
import {
  Configuracion,
  ConfiguracionResponse,
} from "../../interfaces/IConfiguracion";
import { ETipoDato } from "@/enums/ETipoDato";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Save, XCircle } from "lucide-react";
import { Spinner } from "../Common/Spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { RequiredLabel } from "../Common/RequiredLabel";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const formSchema = z.object({
  clave: z
    .string({
      message: "Por favor ingrese una clave",
    })
    .min(3, "La clave es obligatoria"),
  valor: z
    .string({
      message: "Por favor ingrese un valor",
    })
    .min(3, "El valor es obligatorio"),
  tipoDato: z.nativeEnum(ETipoDato, {
    message: "Por favor seleccione un tipo de dato válido",
  }),
  criterio: z.string().optional(),
  descripcion: z.string().optional(),
});

export const ConfiguracionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [isLoadingData, setIsLoadingData] = useState(false);

  const isEditMode = !!id;

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  const { id_usuario } = userProfile || {};

  console.log({ id });

  const handleGoBack = () => {
    navigate("/configuracion");
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clave: "",
      valor: "",
      tipoDato: ETipoDato.STRING,
      criterio: "",
      descripcion: "",
    },
  });

  const resetForm = () => {
    form.reset({
      clave: "",
      valor: "",
      tipoDato: ETipoDato.STRING,
      criterio: "",
      descripcion: "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);

      try {
        if (isEditMode && id) {
          const responseConfiguracion = await getConfiguracionById(id);
          console.log({ responseConfiguracion });

          const { result, data, message } = responseConfiguracion;

          if (result && data) {
            const configuracion = data as Configuracion;
            const { clave, valor, tipo_dato, criterio, descripcion } =
              configuracion;

            form.reset({
              clave: clave ?? "",
              valor: valor ?? "",
              tipoDato: (tipo_dato as ETipoDato) ?? ETipoDato.STRING,
              criterio: criterio ?? "",
              descripcion: descripcion ?? "",
            });
          } else {
            showToast("error", message || "Configuración no encontrada");
            navigate("/configuracion/nuevo");
          }
        }
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id, isEditMode, form, navigate, showToast]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let messageError: string = "";
      let response: ConfiguracionResponse;

      const { clave, valor, tipoDato, criterio, descripcion } = values;

      const payloadData: Configuracion = {
        clave,
        valor,
        tipo_dato: tipoDato,
        criterio,
        descripcion,
        estado: true,
        sistema: false,
      };

      if (isEditMode && id) {
        messageError = "Error al actualizar la configuración";
        payloadData.user_actualiza = id_usuario;
        response = await updateConfiguracion(id, payloadData);
      } else {
        messageError = "Error al registrar la configuración";
        payloadData.user_crea = id_usuario;
        response = await createConfiguracion(payloadData);
      }

      const { result, message, error } = response;

      if (result) {
        showToast("success", message);
        navigate("/configuracion");
      } else {
        showToast("error", error || messageError);
        return;
      }
    } catch (error: any) {
      console.error("Error al registrar la configuración", error);
      showToast("error", error?.message || "Ocurrió un error inesperado");
    }
  };

  return (
    <>
      <Card className="shadow-xl border-none bg-white">
        <CardHeader className="border-b border-gray-100 p-6 flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {isEditMode
                ? `Editar configuración`
                : `Nuevo registro de configuración`}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {isEditMode
                ? `Actualización de información de configuración`
                : `Complete la información para registrar una configuración`}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </CardHeader>
        <CardContent className="px-6 sm:px-8 relative">
          {isLoadingData && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
              <Spinner className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                {/* Campo Clave */}
                <FormField
                  control={form.control}
                  name="clave"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel isRequired={true}>Clave</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese clave"
                          autoComplete="off"
                          {...field}
                          className={`transition-all bg-white ${
                            fieldState.invalid
                              ? "border-red-400 focus-visible:ring-red-100"
                              : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                          }`}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Campo Valor */}
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel isRequired={true}>Valor</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese valor"
                          autoComplete="off"
                          {...field}
                          className={`transition-all bg-white ${
                            fieldState.invalid
                              ? "border-red-400 focus-visible:ring-red-100"
                              : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                          }`}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Campo Tipo de Dato (Usando ETipoDato) */}
                <FormField
                  control={form.control}
                  name="tipoDato"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel
                        className="text-xs font-semibold text-gray-700"
                        isRequired={true}
                      >
                        Tipo de Dato
                      </RequiredLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`w-full h-8 text-xs transition-all bg-white ${
                              fieldState.invalid
                                ? "border-red-400 focus-visible:ring-red-100"
                                : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                            }`}
                          >
                            <SelectValue placeholder="Seleccione un tipo de dato" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white text-xs border border-slate-200 shadow-md outline-none">
                          {Object.values(ETipoDato).map((tipo) => (
                            <SelectItem
                              key={tipo}
                              value={tipo}
                              className="cursor-pointer hover:bg-gray-100 py-1 text-xs"
                            >
                              {tipo.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Campo Criterio */}
                <FormField
                  control={form.control}
                  name="criterio"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel isRequired={false}>Criterio</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese criterio (opcional)"
                          autoComplete="off"
                          {...field}
                          className={`transition-all bg-white ${
                            fieldState.invalid
                              ? "border-red-400 focus-visible:ring-red-100"
                              : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                          }`}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Campo Descripción */}
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel isRequired={false}>
                        Descripción
                      </RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese descripción (opcional)"
                          autoComplete="off"
                          {...field}
                          className={`transition-all bg-white ${
                            fieldState.invalid
                              ? "border-red-400 focus-visible:ring-red-100"
                              : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                          }`}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={resetForm}
                  className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-all"
                >
                  <XCircle className="h-4 w-4 mr-2 text-slate-500" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-100 transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isEditMode ? "Actualizar" : "Registrar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
