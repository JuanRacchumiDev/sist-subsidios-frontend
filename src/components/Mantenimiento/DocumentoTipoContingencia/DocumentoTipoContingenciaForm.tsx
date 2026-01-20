import { useEffect, useState } from "react";
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

// import { getTipoContingencias } from "../../../services/tipoContingenciaService";
import { getDetalles } from "../../../services/detalleParametroService";

import {
  createDocumentoTipoCont,
  updateDocumentoTipoCont,
} from "../../../services/documentoTipoContService";
import {
  DocumentoTipoContingencia,
  DocumentoTipoContingenciaResponse,
} from "../../../interfaces/IDocumentoTipoContingencia";
// import { TipoContingencia } from "../../../interfaces/ITipoContingencia";
import { Input } from "../../../components/ui/input";
import { getDocumentoTipoContById } from "../../../services/documentoTipoContService";
import { ArrowLeft } from "lucide-react";
import { Detalle } from "../../../interfaces/IDetalleParametro";
import { ParametroClase } from "@/constants/parametroClase";

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

  // const [tipoContingencias, setTipoContingencias] = useState<
  //   DocumentoTipoContingencia[]
  // >([]);

  const [tipoContingencias, setTipoContingencias] = useState<Detalle[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idTipoContingencia: "",
      nombre: "",
    },
  });

  const { isSubmitting } = form.formState;
  const isEditMode = !!id;

  const handleGoBack = () => {
    navigate("/mantenimiento/documento-tipo-contingencia");
  };

  const resetForm = () => {
    form.reset({
      idTipoContingencia: "",
      nombre: "",
    });
  };

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
        response = await updateDocumentoTipoCont(id, payloadDocumentoTC);
      } else {
        messageError = "Error al registrar el documento";
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
        error
      );
      showToast("error", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // let listTipoContingencias: TipoContingencia[] = [];
        let listTipoContingencias: Detalle[] = [];

        // const response = await getTipoContingencias();
        const response = await getDetalles(
          ParametroClase.TIPO_CONTINGENCIA,
          true
        );

        console.log({ response });

        const { result, data } = response;

        if (result && data) {
          // listTipoContingencias = data as TipoContingencia[];
          listTipoContingencias = data as Detalle[];
        }

        setTipoContingencias(listTipoContingencias);

        if (isEditMode && id) {
          const responseDocumento = await getDocumentoTipoContById(id);
          const { result, data } = responseDocumento;

          if (result && data) {
            const documento = data as DocumentoTipoContingencia;

            const dataForm = {
              idTipoContingencia: documento.id_tipocontingencia,
              nombre: documento.nombre || "",
            };
            // console.log("dataForm documento tipo contingencia", dataForm);
            form.reset(dataForm);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, [id, isEditMode]);
  // [form, navigate, showToast]

  return (
    <>
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between">
          <div className="flex-shrink min-w-0">
            <CardTitle className="text-xl font-bold text-gray-800">
              {isEditMode
                ? "Actualización de documento"
                : "Registro de documento"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {isEditMode
                ? "Formulario de actualización de documento"
                : "Complete el formulario para registrar un documento"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="idTipoContingencia"
                  render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <RequiredLabel>Tipo de Contingencia</RequiredLabel>
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
                              focus:ring-2 focus:ring-offset-2 transition-all duration-300
                            `}
                          >
                            <SelectValue placeholder="Seleccionar tipo de contingencia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-400">
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
                      <FormMessage />
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
                  onClick={() => resetForm()}
                  // onClick={() => navigate("/mantenimiento/documento-tipo-contingencia")}
                  className="hover:bg-gray-200 hover: cursor-pointer transition-colors duration-300"
                >
                  Cancelar
                  {/* {isSubmitting ? "Cancelando..." : "Cancelar"} */}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
