import { useEffect, useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useToast } from "../../../context/ToastContext";
import { Spinner } from "../../../components/Common/Spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";
import { RequiredLabel } from "../../Common/RequiredLabel";

import { getDetalles } from "../../../services/detalleParametroService";

import {
  createDocumentoTipoCont,
  updateDocumentoTipoCont,
} from "../../../services/documentoTipoContService";
import {
  DocumentoTipoContingencia,
  DocumentoTipoContingenciaResponse,
} from "../../../interfaces/IDocumentoTipoContingencia";
import { Input } from "../../../components/ui/input";
import { getDocumentoTipoContById } from "../../../services/documentoTipoContService";
import { ArrowLeft, Save, XCircle } from "lucide-react";
import { Detalle } from "../../../interfaces/IDetalleParametro";
import { ParametroClase } from "../../../constants/parametroClase";
import { getAuthData } from "../../../utils/authMemo";

const loadTipoContingencias = async (): Promise<Detalle[]> => {
  const estado: boolean = true;
  let tipoContingencias: Detalle[] = [];

  try {
    const response = await getDetalles(
      ParametroClase.TIPO_CONTINGENCIA,
      estado,
    );

    const { result, data } = response;

    if (result && data) {
      tipoContingencias = data as Detalle[];
    }

    return tipoContingencias;
  } catch (error) {
    console.error("Error al obtener cargos", error);
    return [];
  }
};

const formSchema = z.object({
  idTipoContingencia: z
    .string({
      message: "Por favor seleccione un tipo de contingencia",
    })
    .min(1, "Por favor seleccione un tipo de contingencia"),
  nombre: z.string().min(2, {
    message: "El nombre es requerido.",
  }),
});

export const DocumentoTipoContigenciaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [tipoContingencias, setTipoContingencias] = useState<Detalle[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idTipoContingencia: "",
      nombre: "",
    },
  });

  const isEditMode = !!id;

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  console.log({ userProfile });

  const { id_usuario } = userProfile;
  console.log({ id_usuario });

  const handleGoBack = () => {
    navigate("/mantenimiento/documento-tipo-contingencia");
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);

      try {
        let dataTipoContingencias = await loadTipoContingencias();

        setTipoContingencias(dataTipoContingencias);

        if (isEditMode && id) {
          const responseDocumento = await getDocumentoTipoContById(id);

          const { result, data } = responseDocumento;

          if (result && data) {
            const documento = data as DocumentoTipoContingencia;

            const dataForm = {
              idTipoContingencia: documento.id_tipocontingencia,
              nombre: documento.nombre || "",
            };
            form.reset(dataForm);
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
  }, [id, isEditMode]);

  const resetForm = () => {
    form.reset({
      idTipoContingencia: "",
      nombre: "",
    });
  };

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let messageError: string = "";
      let response: DocumentoTipoContingenciaResponse;

      const { idTipoContingencia, nombre } = values;

      const payloadDocumentoTC: DocumentoTipoContingencia = {
        id_tipocontingencia: idTipoContingencia,
        nombre,
      };

      if (isEditMode && id) {
        messageError = "Error al actualizar el documento";
        payloadDocumentoTC.user_actualiza = id_usuario;
        response = await updateDocumentoTipoCont(id, payloadDocumentoTC);
      } else {
        messageError = "Error al registrar el documento";
        payloadDocumentoTC.user_crea = id_usuario;
        response = await createDocumentoTipoCont(payloadDocumentoTC);
      }

      const { result, message, error } = response;

      if (result) {
        showToast("success", message);
        navigate("/mantenimiento/documento-tipo-contingencia");
      } else {
        showToast("error", error || messageError);
        return;
      }
    } catch (error) {
      console.error(
        "Error al registrar documento de tipo de contingencia",
        error,
      );
      showToast("error", error);
    }
  };

  return (
    <>
      <Card className="shadow-xl border-none bg-white">
        <CardHeader className="border-b border-gray-100 p-6 flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {isEditMode ? `Editar documento` : `Nuevo registro de documento`}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {isEditMode
                ? `Actualización de información de documento`
                : `Complete la información para registrar un documento`}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-5">
                <FormField
                  control={form.control}
                  name="idTipoContingencia"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col">
                      <RequiredLabel>Tipo de Contingencia</RequiredLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`w-full transition-all bg-white ${
                              fieldState.invalid
                                ? "border-red-400 focus:ring-red-100"
                                : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
                            }`}
                          >
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          {tipoContingencias.map((tipo) => (
                            <SelectItem
                              value={tipo.id}
                              key={tipo.id}
                              className="cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                              {tipo.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Nombre</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Receta médica"
                          autoComplete="off"
                          maxLength={60}
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
                      <FormMessage className="text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
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
                  {isEditMode ? "Actualizar Datos" : "Confirmar Registro"}
                </Button>
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
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
