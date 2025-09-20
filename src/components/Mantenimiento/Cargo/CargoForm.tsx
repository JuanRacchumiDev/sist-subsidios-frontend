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
  createCargo,
  getCargoById,
  updateCargo,
} from "../../../services/cargoService";
import { Cargo, CargoResponse } from "../../../interfaces/ICargo";
import { useToast } from "../../../context/ToastContext";
import { RequiredLabel } from "../../../components/Common/RequiredLabel";
import { useEffect } from "react";

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let messageError: string = "";
      let response: CargoResponse;

      const payloadData: Cargo = {
        ...values,
        estado: true,
      };

      if (isEditMode && id) {
        messageError = "Error al actualizar el cargo";
        response = await updateCargo(id, payloadData);
      } else {
        messageError = "Error al registrar el cargo";
        response = await createCargo(payloadData);
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
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditMode) {
          const responseCargo = await getCargoById(id);
          const { result, data, message } = responseCargo;

          if (result && data) {
            const cargo = data as Cargo;
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
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-bold text-gray-800">
            {isEditMode ? "Actualización de cargo" : "Registro de cargo"}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {isEditMode
              ? "Formulario de actualización de cargo"
              : "Complete el formulario para registrar nuevo cargo"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
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
              {/* </div> */}
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
                  onClick={() => navigate("/mantenimiento/cargo")}
                  className="hover:bg-gray-200 hover: cursor-pointer transition-colors duration-300"
                >
                  {isSubmitting ? "Cancelando..." : "Cancelar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
