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
import { Button } from "../../ui/button";
import { RequiredLabel } from "../../Common/RequiredLabel";

import {
  createDiagnostico,
  updateDiagnostico,
  getDiagnosticoByCodigo,
} from "../../../services/diagnosticoService";
import {
  Diagnostico,
  DiagnosticoResponse,
} from "../../../interfaces/IDiagnostico";
import { Input } from "../../../components/ui/input";
import { ArrowLeft, Save, XCircle } from "lucide-react";
import { getAuthData } from "../../../utils/authMemo";

const formSchema = z.object({
  codCie10: z.string().min(2, {
    message: "El código es requerido",
  }),
  nombre: z.string().min(2, {
    message: "El nombre es requerido.",
  }),
});

export const DiagnosticoForm = () => {
  const navigate = useNavigate();
  const { codigo } = useParams<{ codigo: string }>();
  const { showToast } = useToast();

  const [isLoadingData, setIsLoadingData] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codCie10: "",
      nombre: "",
    },
  });

  const isEditMode = !!codigo;

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  console.log({ userProfile });

  const { id_usuario } = userProfile;
  console.log({ id_usuario });

  const handleGoBack = () => {
    navigate("/mantenimiento/diagnostico");
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);

      try {
        if (isEditMode && codigo) {
          const responseDiagnostico = await getDiagnosticoByCodigo(codigo);

          const { result, data } = responseDiagnostico;

          if (result && data) {
            const diagnostico = data as Diagnostico;

            const dataForm = {
              codCie10: diagnostico.codCie10,
              nombre: diagnostico.nombre || "",
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
  }, [codigo, isEditMode]);

  const resetForm = () => {
    form.reset({
      codCie10: "",
      nombre: "",
    });
  };

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let messageError: string = "";
      let response: DiagnosticoResponse;

      const { codCie10, nombre } = values;

      const payload: Diagnostico = {
        codCie10,
        nombre,
      };

      if (isEditMode && codigo) {
        console.log("actualizar diagnóstico");
        messageError = "Error al actualizar el diagnóstico";
        payload.user_actualiza = id_usuario;
        console.log({ payload });
        response = await updateDiagnostico(codigo, payload);
      } else {
        console.log("crear diagnóstico");
        messageError = "Error al registrar el diagnóstico";
        payload.user_crea = id_usuario;
        console.log({ payload });
        response = await createDiagnostico(payload);
      }

      console.log({ response });

      const { result, message, error } = response;

      if (result) {
        showToast("success", message);
        navigate("/mantenimiento/diagnostico");
      } else {
        showToast("error", error || messageError);
        return;
      }
    } catch (error) {
      console.error("Error al registrar diagnóstico", error);
      showToast("error", error);
    }
  };

  return (
    <>
      <Card className="shadow-xl border-none bg-white">
        <CardHeader className="border-b border-gray-100 p-6 flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {isEditMode
                ? `Editar diagnóstico`
                : `Nuevo registro de diagnóstico`}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {isEditMode
                ? `Actualización de información de diagnóstico`
                : `Complete la información para registrar un diagnóstico`}
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
                  name="codCie10"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Nombre</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="A02.5"
                          autoComplete="off"
                          maxLength={10}
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

                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Nombre</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Fiebre tifoidea"
                          autoComplete="off"
                          maxLength={100}
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
