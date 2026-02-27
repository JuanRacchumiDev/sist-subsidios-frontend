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
import { useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { getAuthData } from "../../../utils/authMemo";

const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre es requerido.",
  }),
});

export const CargoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
    },
  });

  const { isSubmitting } = form.formState;

  const isEditMode = !!id;

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  console.log({ userProfile });

  const { id_usuario } = userProfile;
  console.log({ id_usuario });

  const handleGoBack = () => {
    navigate("/mantenimiento/cargo");
  };

  const resetForm = () => {
    form.reset({
      nombre: "",
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let messageError: string = "";
      let response: DetalleResponse;

      console.log({ values });

      const payloadData: Detalle = {
        ...values,
        parametro_clase: ParametroClase.CARGO,
        estado: true,
      };

      if (isEditMode && id) {
        console.log("actualizar detalle");
        messageError = "Error al actualizar el cargo";
        payloadData.user_actualiza = id_usuario;
        console.log({ payloadData });
        response = await updateDetalle(id, payloadData);
      } else {
        console.log("crear detalle");
        messageError = "Error al registrar el cargo";
        payloadData.user_crea = id_usuario;
        console.log({ payloadData });
        response = await createDetalle(payloadData);
      }

      const { result, message, error } = response;

      if (result) {
        showToast("success", message);
        navigate("/mantenimiento/cargo");
      } else {
        showToast("error", error || messageError);
        return;
      }
    } catch (error) {
      console.error("Error al registrar cargo", error);
      showToast("error", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
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
      }
    };

    fetchData();
  }, [id, isEditMode, form, navigate, showToast]);

  return (
    <div className="flex justify-center w-full mx-auto max-w-md">
      <Card className="shadow-lg border-gray-200 w-full">
        <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between">
          <div className="flex-shrink min-w-0">
            <CardTitle className="text-xl font-bold text-gray-800">
              {isEditMode ? "Actualización de cargo" : "Registro de cargo"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {isEditMode
                ? "Formulario de actualización de cargo"
                : "Complete el formulario para registrar nuevo cargo"}
            </CardDescription>
          </div>
          <button
            onClick={handleGoBack}
            className="flex items-center text-sm font-semibold 
              text-blue-600 
              hover:text-blue-800 
              hover:bg-blue-50 
              transition-colors 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
              rounded-md p-2 ml-4 
              cursor-pointer"
            aria-label="Volver al listado"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Volver
          </button>
        </CardHeader>
        <CardContent className="pt-6">
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
                        className={`
                          ${
                            fieldState.invalid
                              ? "border-red-500 focus:ring-red-500"
                              : "focus:ring-blue-500"
                          }
                            transition-all duration-300 w-full
                          `}
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
    </div>
  );
};
