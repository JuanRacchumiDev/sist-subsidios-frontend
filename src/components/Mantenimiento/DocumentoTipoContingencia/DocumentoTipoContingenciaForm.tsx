import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "../../../context/ToastContext";
import { Spinner } from "../../../components/Common/Spinner";
import {
  Form,
  FormControl,
  FormDescription,
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

import { getTipoContingencias } from "@/services/tipoContingenciaService";
import {
  createDocumentoTipoCont,
  getDocumentoTipoContById,
} from "@/services/documentoTipoContService";
import {
  DocumentoTipoContingencia,
  DocumentoTipoContingenciaResponse,
} from "@/interfaces/IDocumentoTipoContingencia";
import { TipoContingencia } from "@/interfaces/ITipoContingencia";
import { Input } from "@/components/ui/input";

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

  const [tipoContingencias, setTipoContingencias] = useState<
    DocumentoTipoContingencia[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idTipoContingencia: "",
      nombre: "",
    },
  });

  const { isSubmitting } = form.formState;
  const isEditMode = !!id;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { idTipoContingencia, nombre } = values;

      const payloadDocumentoTC: DocumentoTipoContingencia = {
        id_tipocontingencia: idTipoContingencia,
        nombre,
      };

      const response = await createDocumentoTipoCont(payloadDocumentoTC);
      const { result, message } = response as DocumentoTipoContingenciaResponse;

      if (result) {
        showToast("success", message);
        navigate("/mantenimiento/documento-tipo-contingencia");
      } else {
        showToast(
          "error",
          message || "Error al registrara el documento por tipo de contingencia"
        );
        return;
      }
    } catch (error) {
      console.error("Error al registrar colaborador", error);
      showToast("error", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // if (isEditMode) {
        //   const responseDocumentoTipoCont = await getDocumentoTipoContById(id);

        //   const {
        //     result: resultDocumento,
        //     data: dataDocumento,
        //     message,
        //   } = responseDocumentoTipoCont;

        //   if (resultDocumento && dataDocumento) {
        //     const documento = data as DocumentoTipoContingencia;
        //     const { id_tipocontingencia, nombre } = documento;

        //     form.reset({
        //       idTipoContingencia: id_tipocontingencia ?? "",
        //       nombre: nombre ?? "",
        //     });
        //   } else {
        //     showToast(
        //       "error",
        //       message || "Documento tipo de contingencia no encontrado"
        //     );
        //     navigate("/mantenimiento/documento-tipo-contingencia/nuevo");
        //   }
        // }

        let listTipoContingencias: TipoContingencia[] = [];

        const response = await getTipoContingencias();

        const { result, data } = response;

        if (result && data) {
          listTipoContingencias = data as TipoContingencia[];
        }

        setTipoContingencias(listTipoContingencias);

        // if (id) {
        //   const responseDocumentoTipoCont = await getDocumentoTipoContById(id);
        //   const {
        //     result: resultDocumento,
        //     data: dataDocumento,
        //     message,
        //   } = responseDocumentoTipoCont;

        //   if (resultDocumento && dataDocumento) {
        //     const documento = data as DocumentoTipoContingencia;
        //     const { id_tipocontingencia, nombre } = documento;

        //     form.reset({
        //       idTipoContingencia: id_tipocontingencia ?? "",
        //       nombre: nombre ?? "",
        //     });
        //   } else {
        //     showToast(
        //       "error",
        //       message || "Documento tipo de contingencia no encontrado"
        //     );
        //     navigate("/mantenimiento/documento-tipo-contingencia/nuevo");
        //   }
        // }
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, [form, navigate, showToast]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Información de documento</CardTitle>
          <CardDescription>Ingrese los datos del documento</CardDescription>
        </CardHeader>
        <CardContent>
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
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
                          >
                            <SelectValue placeholder="Seleccionar tipo de contingencia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tipoContingencias.map((tipo) => (
                            <SelectItem value={tipo.id} key={tipo.id}>
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
                          className={fieldState.invalid ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() =>
                    navigate("/mantenimiento/documento-tipo-contingencia")
                  }
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
