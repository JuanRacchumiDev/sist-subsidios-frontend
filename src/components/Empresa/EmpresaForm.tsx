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
} from "../ui/card";
import { useToast } from "../../context/ToastContext";
import { Spinner } from "../../components/Common/Spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RequiredLabel } from "../Common/RequiredLabel";
import { Input } from "../ui/input";
import { getEmpresaByApi } from "../../services/apiEmpresaService";
import { Empresa } from "../../interfaces/IEmpresa";
import { getPersonaByApi } from "../../services/apiPersonaService";
import { getEmpresaById } from "../../services/empresaService";
import {
  createPersona,
  updatePersona,
  getPersonaByEmpresaWithGrupo,
} from "../../services/personaService";
import { getDetalles } from "../../services/detalleParametroService";
import { Persona, PersonaResponse } from "../../interfaces/IPersona";
import { Button } from "../ui/button";
import SearchableCombobox from "../Common/SearchableCombobox";
import { ArrowLeft, Save, XCircle } from "lucide-react";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { ParametroClase } from "../../constants/parametroClase";
import { getAuthData } from "../../utils/authMemo";

const getTipoDocumentos = async (): Promise<Detalle[]> => {
  let tipos: Detalle[] = [];

  try {
    const estado: boolean = true;

    const response = await getDetalles(ParametroClase.TIPO_DOCUMENTO, estado);
    console.log("response getTipoDocumentos");
    console.log({ response });

    const { result, data } = response;

    if (result && data) {
      tipos = data as Detalle[];
    }

    return tipos;
  } catch (error) {
    console.error("Error al obtener tipo de documentos", error);
    return [];
  }
};

const getCargos = async (): Promise<Detalle[]> => {
  let cargos: Detalle[] = [];

  try {
    const estado: boolean = true;

    const response = await getDetalles(ParametroClase.CARGO, estado);

    console.log("response getCargos");
    console.log({ response });

    const { result, data } = response;

    if (result && data) {
      cargos = data as Detalle[];
    }

    return cargos;
  } catch (error) {
    console.error("Error al obtener cargos", error);
    return [];
  }
};

const formSchema = z.object({
  ruc: z.string().min(2, {
    message: "El RUC es requerido.",
  }),
  razonSocial: z.string().min(2, {
    message: "La razón social es requerida.",
  }),
  direccion: z.string().min(2, {
    message: "La dirección es requerida.",
  }),
  idTipoDocumento: z
    .string({
      message: "Por favor seleccione un tipo de documento.",
    })
    .min(1, "Por favor seleccione un tipo de documento."),
  numeroDocumento: z
    .string()
    .min(8, { message: "Número de documento inválido." }),
  apellidoPaterno: z
    .string()
    .min(2, { message: "El apellido paterno es requerido." }),
  apellidoMaterno: z
    .string()
    .min(2, { message: "El apellido materno es requerido." }),
  nombres: z.string().min(2, { message: "Los nombres son requeridos." }),
  direccionFiscal: z
    .string()
    .min(2, { message: "La dirección fiscal es requerida." }),
  partidaRegistral: z
    .string()
    .min(1, { message: "Partida registral requerida." }),
  idCargo: z
    .string({
      message: "Por favor seleccione un cargo.",
    })
    .min(1, "Por favor seleccione un cargo."),
  telefono: z.string().min(6, { message: "Teléfono inválido." }),
  emailPersonal: z.string().email({ message: "Correo electrónico inválido." }),
  ospe: z.string().min(1, { message: "El OSPE es requerido." }),
});

const defaultValues = {
  ruc: "",
  razonSocial: "",
  direccion: "",
  idTipoDocumento: "",
  numeroDocumento: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  nombres: "",
  direccionFiscal: "",
  partidaRegistral: "",
  idCargo: "",
  telefono: "",
  emailPersonal: "",
  ospe: "",
};

export const EmpresaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [tipos, setTipos] = useState<Detalle[]>([]);
  const [cargos, setCargos] = useState<Detalle[]>([]);
  const [idEmpresa, setIdEmpresa] = useState<string>("");
  const [idPersona, setIdPersona] = useState<string>("");

  const [isLoadingData, setIsLoadingData] = useState(false);

  const isEditMode = !!id;

  const inputErrorClass = (invalid: boolean) =>
    invalid ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500";

  const [camposHabilitadosEmpresa, setCamposHabilitadosEmpresa] =
    useState(false);

  const [camposHabilitadosPersona, setCamposHabilitadosPersona] =
    useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  console.log({ userProfile });

  const { id_usuario } = userProfile;
  console.log({ id_usuario });

  const handleGoBack = () => {
    navigate("/empresa");
  };

  const resetForm = () => {
    const dataForm = defaultValues;

    form.reset(dataForm);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);

      try {
        const [listTipoDocumentos, listCargos] = await Promise.all([
          getTipoDocumentos(),
          getCargos(),
        ]);

        setTipos(listTipoDocumentos);
        setCargos(listCargos);

        if (isEditMode && id) {
          const responseEmpresa = await getEmpresaById(id);
          console.log({ responseEmpresa });
          const { result, data } = responseEmpresa;

          if (result && data) {
            const empresa = data as Empresa;

            console.log({ empresa });

            const {
              id: idEmpresa,
              numero,
              nombre_o_razon_social,
              direccion,
            } = empresa;

            setIdEmpresa(idEmpresa);

            let dataForm = {
              ruc: numero || "",
              razonSocial: nombre_o_razon_social || "",
              direccion: direccion || "",
              idTipoDocumento: "",
              numeroDocumento: "",
              apellidoPaterno: "",
              apellidoMaterno: "",
              nombres: "",
              direccionFiscal: "",
              partidaRegistral: "",
              idCargo: null,
              telefono: "",
              emailPersonal: "",
              ospe: "",
            };

            const nombreGrupo = `GRUPO REPRESENTANTE LEGAL`;

            const responsePersona = await getPersonaByEmpresaWithGrupo(
              idEmpresa,
              nombreGrupo,
            );

            console.log({ responsePersona });

            const { result: resultPersona, data: dataPersona } =
              responsePersona;

            if (
              resultPersona &&
              Array.isArray(dataPersona) &&
              dataPersona.length > 0
            ) {
              const listRepresentantes = dataPersona as Persona[];
              console.log({ listRepresentantes });

              const uniqueRepresentante = listRepresentantes[0];

              setCamposHabilitadosPersona(isEditMode);

              if (uniqueRepresentante) {
                const {
                  id: idRepresentante,
                  id_tipodocumento,
                  id_cargo,
                  numero_documento,
                  nombres,
                  apellido_paterno,
                  apellido_materno,
                  direccion_fiscal,
                  partida_registral,
                  telefono,
                  email_personal,
                  ospe,
                } = uniqueRepresentante;

                dataForm.idTipoDocumento = id_tipodocumento;
                dataForm.numeroDocumento = numero_documento || "";
                dataForm.apellidoPaterno = apellido_paterno || "";
                dataForm.apellidoMaterno = apellido_materno || "";
                dataForm.nombres = nombres || "";
                dataForm.direccionFiscal = direccion_fiscal || "";
                dataForm.partidaRegistral = partida_registral || "";
                dataForm.idCargo = id_cargo;
                dataForm.telefono = telefono;
                dataForm.emailPersonal = email_personal || "";
                dataForm.ospe = ospe || "";

                setIdPersona(idRepresentante);
              }
            } else {
              setCamposHabilitadosPersona(false);
            }

            console.log({ dataForm });

            form.reset(dataForm);

            form.setValue("idTipoDocumento", dataForm.idTipoDocumento);
            form.setValue("ruc", dataForm.ruc);
            form.setValue("numeroDocumento", dataForm.numeroDocumento);
            form.setValue("idCargo", dataForm.idCargo);
          }
        }
      } catch (error) {
        console.error("Error fetching empresa:", error);
        showToast("error", "Error al cargar los datos de la empresa.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({ values });
    let messageError: string = "";
    let response: PersonaResponse;

    const {
      idTipoDocumento,
      idCargo,
      numeroDocumento,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      direccionFiscal,
      partidaRegistral,
      telefono,
      emailPersonal,
      ospe,
    } = values;

    const payload: Persona = {
      id_tipodocumento: idTipoDocumento,
      id_empresa: idEmpresa,
      id_cargo: idCargo,
      numero_documento: numeroDocumento,
      nombres,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      direccion_fiscal: direccionFiscal,
      partida_registral: partidaRegistral,
      telefono,
      email_personal: emailPersonal,
      ospe,
      nombre_grupo: "GRUPO REPRESENTANTE LEGAL",
    };

    console.log("---- payload persona ----");
    console.log({ payload });

    try {
      if (!isEditMode && idPersona) {
        console.log("create persona");
        payload.user_actualiza = id_usuario;
        response = await updatePersona(idPersona, payload);
      } else if (isEditMode && idPersona) {
        console.log("update persona");
        payload.user_actualiza = id_usuario;
        response = await updatePersona(idPersona, payload);
      } else {
        console.log("ccc");
        payload.user_crea = id_usuario;
        response = await createPersona(payload);
      }

      console.log("---- response createPersona or updatePersona ----");
      console.log(response);

      const { result, message, error } = response as PersonaResponse;

      if (result) {
        showToast("success", message);
        navigate("/empresa");
      } else {
        showToast("error", error || messageError);
        return;
      }
    } catch (error) {
      console.error("Error al registrar empresa", error);
      showToast("error", error);
    }
  };

  return (
    <>
      <Card className="shadow-xl border-none bg-white">
        <CardHeader className="border-b border-gray-100 p-6 flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {isEditMode ? `Editar empresa` : `Nuevo Registro de empresa`}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {isEditMode
                ? `Actualización de información de empresa`
                : `Complete la información para registrar una empresa`}
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                    01
                  </span>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Información de registro
                  </h3>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                <FormField
                  control={form.control}
                  name="ruc"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>RUC</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="20103269319"
                          autoComplete="off"
                          maxLength={13}
                          {...field}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              try {
                                showToast("success", "Buscando empresa...");

                                const response = await getEmpresaByApi(
                                  field.value,
                                );

                                const { result, data, message } = response;

                                if (result && data) {
                                  showToast("success", message);

                                  const {
                                    id,
                                    nombre_o_razon_social,
                                    direccion,
                                  } = data as Empresa;

                                  setIdEmpresa(id);

                                  form.setValue(
                                    "razonSocial",
                                    nombre_o_razon_social,
                                  );

                                  form.setValue("direccion", direccion);
                                  setCamposHabilitadosEmpresa(false);
                                } else {
                                  showToast(
                                    "warning",
                                    message ||
                                      "No se encontraron datos de empresa",
                                  );
                                  setCamposHabilitadosEmpresa(false);
                                }
                              } catch (error) {
                                setCamposHabilitadosEmpresa(true);
                                showToast(
                                  "error",
                                  `Error de información de empresa: ${error}`,
                                );
                              }
                            }
                          }}
                          disabled={isEditMode}
                          className={inputErrorClass(fieldState.invalid)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="razonSocial"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Razón social</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="SOPHIA HUMAN"
                          autoComplete="off"
                          maxLength={40}
                          {...field}
                          disabled={!camposHabilitadosEmpresa}
                          className={inputErrorClass(fieldState.invalid)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Dirección</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Av. Libertad 203"
                          autoComplete="off"
                          maxLength={60}
                          {...field}
                          disabled={!camposHabilitadosEmpresa}
                          className={inputErrorClass(fieldState.invalid)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                    02
                  </span>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Datos del representante legal
                  </h3>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                <FormField
                  control={form.control}
                  name="idTipoDocumento"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col">
                      <RequiredLabel>Tipo de Documento</RequiredLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                        disabled={camposHabilitadosPersona}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`${inputErrorClass(fieldState.invalid)} w-full w-full-important`}
                          >
                            <SelectValue placeholder="Seleccionar tipo de documento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          {tipos.map((tipo) => (
                            <SelectItem
                              value={tipo.id}
                              key={tipo.id}
                              className="cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                              {tipo.abreviatura}
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
                  name="numeroDocumento"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Número de Documento</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="44668800"
                          autoComplete="off"
                          maxLength={8}
                          {...field}
                          disabled={camposHabilitadosPersona}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              try {
                                showToast("success", "Buscando persona...");

                                const idTipoDocumento =
                                  form.getValues("idTipoDocumento");

                                const responsePersona = await getPersonaByApi(
                                  idTipoDocumento,
                                  field.value,
                                );

                                console.log({ responsePersona });

                                const { result, data, message } =
                                  responsePersona;

                                if (result && data) {
                                  const persona = data as Persona;

                                  const {
                                    id,
                                    nombres,
                                    apellido_paterno,
                                    apellido_materno,
                                  } = persona;

                                  form.setValue("nombres", nombres);

                                  form.setValue(
                                    "apellidoPaterno",
                                    apellido_paterno,
                                  );

                                  form.setValue(
                                    "apellidoMaterno",
                                    apellido_materno,
                                  );

                                  setIdPersona(id);
                                  setCamposHabilitadosPersona(true);
                                  showToast("success", message);
                                } else {
                                  setCamposHabilitadosPersona(false);
                                  showToast(
                                    "warning",
                                    "No se encontraron datos de persona",
                                  );
                                }
                              } catch (error) {
                                setCamposHabilitadosPersona(false);
                                showToast(
                                  "error",
                                  "Error al buscar una persona",
                                );
                              }
                            }
                          }}
                          className={inputErrorClass(fieldState.invalid)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apellidoPaterno"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Apellido paterno</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Pérez"
                          autoComplete="off"
                          maxLength={30}
                          {...field}
                          disabled={camposHabilitadosPersona}
                          className={inputErrorClass(fieldState.invalid)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apellidoMaterno"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Apellido materno</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Pérez"
                          autoComplete="off"
                          maxLength={30}
                          {...field}
                          disabled={camposHabilitadosPersona}
                          className={inputErrorClass(fieldState.invalid)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nombres"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Nombres</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Luz Angélica"
                          autoComplete="off"
                          maxLength={40}
                          {...field}
                          disabled={camposHabilitadosPersona}
                          className={inputErrorClass(fieldState.invalid)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="direccionFiscal"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Dirección Fiscal</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Av. Peruanidad 412"
                          autoComplete="off"
                          maxLength={60}
                          {...field}
                          className={inputErrorClass(fieldState.invalid)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="partidaRegistral"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Partida Registral</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="0014-2020-02"
                          autoComplete="off"
                          maxLength={10}
                          {...field}
                          className={inputErrorClass(fieldState.invalid)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idCargo"
                  render={({ field, fieldState }) => {
                    return (
                      <FormItem className="flex flex-col">
                        <RequiredLabel>Cargo</RequiredLabel>
                        <SearchableCombobox<Detalle>
                          placeholder="Buscar un cargo"
                          options={cargos}
                          value={field.value}
                          onChange={field.onChange}
                          displayKey="nombre"
                          valueKey="id"
                          searchKeys={["nombre"]}
                          isInvalid={fieldState.invalid}
                        />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Teléfono</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="987654321"
                          autoComplete="off"
                          maxLength={9}
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

                <FormField
                  control={form.control}
                  name="emailPersonal"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>Email Personal</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="luz.perez@gmail.com"
                          type="email"
                          autoComplete="off"
                          maxLength={50}
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

                <FormField
                  control={form.control}
                  name="ospe"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel>OSPE</RequiredLabel>
                      <FormControl>
                        <Input
                          placeholder="Av. Libertad 203"
                          autoComplete="off"
                          maxLength={30}
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
