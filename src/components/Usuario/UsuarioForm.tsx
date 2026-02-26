import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useToast } from "../../context/ToastContext";
import { Spinner } from "../../components/Common/Spinner";
import { getPersonas } from "../../services/personaService";
import { getDetalles } from "../../services/detalleParametroService";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { Persona } from "../../interfaces/IPersona";
import {
  getUsuarioById,
  createUsuario,
  updateUsuario,
} from "../../services/usuarioService";
import { Usuario, UsuarioResponse } from "../../interfaces/IUsuario";
import {
  Form,
  FormControl,
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
import { ArrowLeft } from "lucide-react";

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

const getDataPersonas = async (): Promise<Persona[]> => {
  let personas: Persona[] = [];

  try {
    const response = await getPersonas();

    console.log("---- response getDataPersonas ----");
    console.log({ response });

    if (response.result && response.data) {
      personas = response.data as Persona[];
    }

    return personas;
  } catch (error) {
    console.error("Error al obtener personas", error);
    return [];
  }
};

const getDataPerfiles = async (): Promise<Detalle[]> => {
  let perfiles: Detalle[] = [];

  try {
    const clase: number = 1001;
    const estado: boolean = true;

    const response = await getDetalles(clase, estado);
    console.log("---- response getPerfiles ----");
    console.log({ response });

    if (response.result && response.data) {
      perfiles = response.data as Detalle[];
    }

    return perfiles;
  } catch (error) {
    console.error("Error al obtener perfiles", error);
    return [];
  }
};

export const UsuarioForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [perfiles, setPerfiles] = useState<Detalle[]>([]);
  const [correos, setCorreos] = useState<string[]>([]);

  const isEditMode = !!id;

  const handleGoBack = () => {
    navigate("/usuario");
  };

  const resetForm = () => {
    form.reset({
      idPersona: "",
      idPerfil: "",
      username: "",
      email: "",
    });
  };

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let messageError: string = "";
      let response: UsuarioResponse;

      const { idPerfil, idPersona, username, email } = values;

      const payloadData: Usuario = {
        id_perfil: idPerfil,
        id_persona: idPersona,
        username,
        email,
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

  const watchedIdPersona = form.watch("idPersona");

  useEffect(() => {
    if (watchedIdPersona) {
      const selectedPersona = personas.find((c) => c.id === watchedIdPersona);

      if (selectedPersona) {
        const listCorreos: string[] = [];
        const { email_institucional, email_personal } = selectedPersona;

        if (email_personal) listCorreos.push(email_personal);
        if (email_institucional) listCorreos.push(email_institucional);

        setCorreos(listCorreos);

        // Opcional: Si quieres que el campo email se limpie o resetee al cambiar de persona
        form.setValue("email", "");
      }
    } else {
      setCorreos([]);
    }
  }, [watchedIdPersona, personas, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let listPersonas: Persona[] = [];
        let listPerfiles: Detalle[] = [];

        const [responsePersonas, responsePerfiles] = await Promise.all([
          getDataPersonas(),
          getDataPerfiles(),
        ]);

        console.log({ responsePersonas });

        console.log({ responsePerfiles });

        if (responsePersonas) {
          listPersonas = responsePersonas as Persona[];
        }

        if (responsePerfiles) {
          listPerfiles = responsePerfiles as Detalle[];
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
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between">
          <div className="flex-shrink min-w-0">
            <CardTitle className="text-xl font-bold text-gray-800">
              {isEditMode ? "Actualización de usuario" : "Registro de usuario"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {isEditMode
                ? "Formulario de actualización de usuario"
                : "Complete el formulario para registrar un usuario"}
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
                  name="idPersona"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col">
                      <RequiredLabel>Persona</RequiredLabel>
                      <SearchableCombobox<Persona>
                        placeholder="Buscar una persona"
                        options={personas}
                        value={field.value}
                        onChange={field.onChange}
                        displayKey="nombre_completo"
                        valueKey="id"
                        searchKeys={["nombre_completo"]}
                        isInvalid={fieldState.invalid}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idPerfil"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Perfil</RequiredLabel>
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
                                focus:ring-2 focus:ring-offset-2 transition-all duration-300 cursor-pointer
                            `}
                          >
                            <SelectValue placeholder="Seleccionar perfil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-400">
                          {perfiles.map((perfil) => (
                            <SelectItem
                              value={perfil.id}
                              key={perfil.id}
                              className="cursor-pointer hover:bg-gray-100 transition-colors"
                            >
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
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Nombre de usuario</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese nombre de usuario"
                          autoComplete="off"
                          maxLength={12}
                          {...field}
                          className={fieldState.invalid ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Email</RequiredLabel>
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
                                focus:ring-2 focus:ring-offset-2 transition-all duration-300 cursor-pointer
                            `}
                          >
                            <SelectValue placeholder="Seleccionar email" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-400">
                          {correos.map((correo) => (
                            <SelectItem
                              value={correo}
                              key={correo}
                              className="cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                              {correo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  className="hover:bg-gray-200 hover: cursor-pointer transition-colors duration-300"
                >
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
