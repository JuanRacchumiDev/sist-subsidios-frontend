import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { useNavigate, useParams, Link } from "react-router-dom";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "../../context/ToastContext";
import { Spinner } from "../../components/Common/Spinner";
import { getPersonas } from "@/services/personaService";
import { getPerfiles } from "@/services/perfilService";
import {
  getUsuarioById,
  createUsuario,
  updateUsuario,
} from "@/services/usuarioService";
import { Usuario, UsuarioResponse } from "../../interfaces/IUsuario";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { RequiredLabel } from "../Common/RequiredLabel";
import { Input } from "../ui/input";
import SearchableCombobox from "../Common/SearchableCombobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

export const formSchema = z.object({
  idPerfil: z
    .string({
      message: "Debe seleccionar un perfil",
    })
    .min(1, "Debe seleccionar un perfil"),
  idPersona: z
    .string({
      message: "Por favor seleccione una persona",
    })
    .min(1, "Por favor seleccione una persona"),
  username: z.string().min(3, "El nombre de usuario es obligatorio"),
  email: z.string().email({
    message: "Por favor ingrese un correo válido",
  }),
});

type Persona = {
  id: string;
  apellido_paterno: string;
  apellido_materno: string;
  nombres: string;
  nombre_completo: string;
};

type Perfil = {
  id: string;
  nombre: string;
};

const dataPersonas = async () => {
  let personas: Persona[] = [];
  const response = await getPersonas();
  const { result, data } = response;
  if (result && data) {
    personas = data as Persona[];
  }
  return personas;
};

const dataPerfiles = async () => {
  let perfiles: Perfil[] = [];
  const response = await getPerfiles();
  const { result, data } = response;
  if (result && data) {
    perfiles = data as Perfil[];
  }
  return perfiles;
};

export const UsuarioForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idPerfil: "",
      idPersona: "",
      username: "",
      email: "",
    },
  });

  const { isSubmitting } = form.formState;
  const isEditMode = !!id;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let messageError: string = "";
      let response: UsuarioResponse;

      const payloadData: Usuario = {
        ...values,
        estado: true,
      };

      if (isEditMode && id) {
        messageError = "Error al actualizar el usuario";
        response = await updateUsuario(id, payloadData);
      } else {
        messageError = "Error al registrar el usuario";
        response = await createUsuario(payloadData);
      }

      const { result, message, error } = response;

      if (result) {
        showToast("success", message);
        navigate("/usuario");
      } else {
        showToast("error", error || messageError);
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
        let listPersonas: Persona[] = [];
        let listPerfiles: Perfil[] = [];

        const [responsePersonas, responsePerfiles] = await Promise.all([
          getPersonas(),
          getPerfiles(),
        ]);

        const { result: resultPersonas, data: dataPersonas } = responsePersonas;
        if (resultPersonas && dataPersonas) {
          listPersonas = dataPersonas as Persona[];
        }

        const { result: resultPerfiles, data: dataPerfiles } = responsePerfiles;
        if (resultPerfiles && dataPerfiles) {
          listPerfiles = dataPerfiles as Perfil[];
        }

        setPersonas(listPersonas);
        setPerfiles(listPerfiles);

        if (id) {
          const responseUsuario = await getUsuarioById(id);
          const { result, data, message } = responseUsuario;

          if (result && data) {
            const usuario = data as Usuario;
            const { id_perfil, id_persona, username, email } = usuario;

            form.reset({
              idPerfil: id_perfil ?? "",
              idPersona: id_persona ?? "",
              username: username ?? "",
              email: email ?? "",
            });
          } else {
            showToast("error", message || "Usuario no encontrado");
            navigate("/usuario/nuevo");
          }
        }
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, [id, form, navigate, showToast]);

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Editar" : "Registrar"} Usuario
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? "Actualice los datos del usuario"
              : "Complete el formulario para registrar un nuevo usuario"}
          </p>
        </div>
        <Link
          to="/usuario"
          className="text-sm text-blue-600 hover:underline mt-2 md:mt-0"
        >
          ← Volver al listado
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Información de usuario</CardTitle>
          <CardDescription>
            Complete el formulario para registrar un usuario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="idPersona"
                  render={({ field }) => {
                    const selectedPersona = personas.find(
                      (c) => c.id === field.value
                    );

                    return (
                      <FormItem className="flex flex-col">
                        <RequiredLabel>Persona</RequiredLabel>
                        <SearchableCombobox<Persona>
                          placeholder="Buscar una persona"
                          options={personas}
                          value={field.value}
                          onChange={field.onChange}
                          displayKey="nombre_completo"
                          valueKey="id"
                        />
                        {selectedPersona && (
                          <FormDescription>
                            Persona seleccionada:{" "}
                            <b>{selectedPersona.nombre_completo}</b>
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="idPerfil"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Perfil</RequiredLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar perfil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {perfiles.map((perfil) => (
                            <SelectItem key={perfil.id} value={perfil.id}>
                              {perfil.nombre}
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Nombre de usuario</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese nombre de usuario"
                          autoComplete="off"
                          maxLength={10}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Correo Electrónico</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="luz.perez@email.com"
                          type="email"
                          autoComplete="off"
                          maxLength={60}
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
                  onClick={() => navigate("/usuario")}
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
