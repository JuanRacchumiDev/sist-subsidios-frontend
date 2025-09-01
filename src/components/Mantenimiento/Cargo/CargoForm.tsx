import { Link, useNavigate, useParams } from "react-router-dom";
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
import { RequiredLabel } from "@/components/Common/RequiredLabel";
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
      const cargoData: Cargo = {
        ...values,
        estado: true,
      };

      let messageError: string = "";

      // const response = await createCargo(cargoData);
      let response: CargoResponse;
      if (isEditMode && id) {
        messageError = "Error al actualizar el cargo";
        response = await updateCargo(id, cargoData);
      } else {
        messageError = "Error al registrar el cargo";
        response = await createCargo(cargoData);
      }

      const { result, message } = response;

      if (result) {
        showToast("success", message);
        navigate("/mantenimiento/cargo");
      } else {
        showToast("error", messageError);
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
        // if (id) {
        //   const responseCargo = await getCargoById(id);
        //   console.log({ responseCargo });
        //   const { result, data, message } = responseCargo;

        //   if (result && data) {
        //     const cargo = data as Cargo;
        //     const { nombre } = cargo;

        //     form.reset({
        //       nombre,
        //     });
        //   } else {
        //     showToast("error", message || "Cargo no encontrado");
        //     navigate("/cargo/nuevo");
        //   }
        // }
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los cargos del formulario.");
      }
    };

    fetchData();
  }, [id, isEditMode, form, navigate, showToast]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Editar" : "Registrar"} Cargo
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? "Actualice los datos del cargo"
              : "Complete el formulario para registrar un nuevo cargo"}
          </p>
        </div>
        <Link
          to="/mantenimiento/cargo"
          className="text-sm text-blue-600 hover:underline mt-2 md:mt-0"
        >
          ← Volver al listado
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
          <CardDescription>Ingrese los datos del cargo</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Nombre</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Director General"
                          autoComplete="off"
                          maxLength={50}
                          {...field}
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
