import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Spinner } from "../../Common/Spinner";

import {
  createDetalle,
  updateDetalle,
  getDetalleById,
} from "../../../services/detalleParametroService";
import {
  Detalle,
  DetalleResponse,
} from "../../../interfaces/IDetalleParametro";
import { useToast } from "../../../context/ToastContext";
import { RequiredLabel } from "../../../components/Common/RequiredLabel";
import { ParametroClase } from "../../../constants/parametroClase";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getAuthData } from "../../../utils/authMemo";

const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre es requerido.",
  }),
});

export const CargoForm = () => {
  const navigate = useNavigate();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
    },
  });

  const isEditMode = !!id;

  const inputErrorClass = (invalid: boolean) =>
    invalid ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500";

  const userProfile = useMemo(() => getAuthData()?.usuario, []);

  const { id_usuario } = userProfile;

  const handleGoBack = () => {
    navigate("/mantenimiento/cargo");
  };

  const resetForm = () => {
    form.reset({
      nombre: "",
    });
  };

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let messageError: string = "";
      let response: DetalleResponse;

      const payloadData: Detalle = {
        ...values,
        parametro_clase: ParametroClase.CARGO,
        estado: true,
      };

      if (isEditMode && id) {
        payloadData.user_actualiza = id_usuario;
        response = await updateDetalle(id, payloadData);
      } else {
        payloadData.user_crea = id_usuario;
        response = await createDetalle(payloadData);
      }

      const { result, message, error } = response;

      messageError = message;

      const colorNotification = error && error.length > 0 ? "error" : "warning";

      if (result) {
        showToast("success", message);
        navigate("/mantenimiento/cargo");
      } else {
        showToast(colorNotification, error || messageError);
        return;
      }
    } catch (error) {
      console.error("Error al registrar cargo", error);
      showToast("error", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);

      try {
        if (isEditMode) {
          const responseCargo = await getDetalleById(id);
          const { result, data, message } = responseCargo;

          if (result && data) {
            const cargo = data as Detalle;

            form.reset({
              nombre: cargo.nombre,
            });
          } else {
            showToast("error", message || "Cargo no encontrado");
            navigate("/mantenimiento/cargo/nuevo");
          }
        }
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los cargos del formulario.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id, isEditMode, form, navigate, showToast]);

  return (
    <Card className="shadow-xl border-none bg-white">
      <CardHeader className="border-b border-gray-100 p-6 flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {isEditMode ? `Editar cargo` : `Nuevo Registro de cargo`}
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            {isEditMode
              ? `Actualización de información de cargo`
              : `Complete la información para registrar un cargo`}
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
      <CardContent>
        {isLoadingData && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
            <Spinner className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field, fieldState }) => (
                <FormItem>
                  <RequiredLabel>Nombre</RequiredLabel>
                  <FormControl>
                    <Input
                      placeholder="Director General"
                      autoComplete="off"
                      maxLength={50}
                      {...field}
                      className={inputErrorClass(fieldState.invalid)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                className="hover:bg-gray-200 hover: cursor-pointer transition-colors duration-300"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
