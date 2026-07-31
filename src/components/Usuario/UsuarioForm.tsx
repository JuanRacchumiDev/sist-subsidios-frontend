import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
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
import { getPersonasNoUsuarios } from "../../services/personaService";
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
import { ArrowLeft, Save, XCircle } from "lucide-react";
import { ParametroClase } from "../../constants/parametroClase";
import { getAuthData } from "../../utils/authMemo";

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

const loadPersonas = async (): Promise<Persona[]> => {
  let personas: Persona[] = [];

  try {
    const response = await getPersonasNoUsuarios();

    console.log("---- response loadPersonas ----");
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

const loadPerfiles = async (): Promise<Detalle[]> => {
  let perfiles: Detalle[] = [];

  try {
    const estado: boolean = true;
    // const enPersona: boolean = false;

    const response = await getDetalles(
      ParametroClase.PERFIL,
      estado,
      // enPersona,
    );

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
  const [isLoadingData, setIsLoadingData] = useState(false);

  const isEditMode = !!id;

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  console.log({ userProfile });

  const { id_usuario } = userProfile;
  console.log({ id_usuario });

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
      setIsLoadingData(true);

      try {
        const [listPersonas, listPerfiles] = await Promise.all([
          loadPersonas(),
          loadPerfiles(),
        ]);

        setPersonas(listPersonas);
        setPerfiles(listPerfiles);

        if (isEditMode && id) {
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
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);
  // [id, form, navigate, showToast]

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
        payloadData.user_actualiza = id_usuario;
        response = await updateUsuario(id, payloadData);
      } else {
        messageError = "Error al registrar el usuario";
        payloadData.user_crea = id_usuario;
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
      console.error("Error al registrar usuario", error);
      showToast("error", error);
    }
  };

  return (
    <>
      <Card className="shadow-xl border-none bg-white">
        <CardHeader className="border-b border-gray-100 p-6 flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {isEditMode ? `Editar usuario` : `Nuevo registro de usuario`}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {isEditMode
                ? `Actualización de información de usuario`
                : `Complete la información para registrar un usuario`}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
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
                    <FormItem className="flex flex-col">
                      <RequiredLabel>Perfil</RequiredLabel>
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
                      <FormMessage className="text-xs font-medium text-red-500" />
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
                          className={`transition-all bg-white ${
                            fieldState.invalid
                              ? "border-red-400 focus-visible:ring-red-100"
                              : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                          }`}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-500" />
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
