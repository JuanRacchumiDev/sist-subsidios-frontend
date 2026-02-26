import { useEffect, useState } from "react";
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
import { ArrowLeft } from "lucide-react";
import { Detalle } from "../../interfaces/IDetalleParametro";

const getTipoDocumentos = async (): Promise<Detalle[]> => {
  let tipos: Detalle[] = [];

  try {
    const clase: number = 1000;
    const estado: boolean = true;

    const response = await getDetalles(clase, estado);
    console.log("response getTipoDocumentos");
    console.log({ response });

    if (response.result && response.data) {
      tipos = response.data as Detalle[];
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
    const clase: number = 1008;
    const estado: boolean = true;

    const response = await getDetalles(clase, estado);
    console.log("response getCargos");
    console.log({ response });

    if (response.result && response.data) {
      cargos = response.data as Detalle[];
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

type TEmpresa = {
  ruc?: string;
  razonSocial?: string;
  direccion?: string;
  idTipoDocumento?: string;
  numeroDocumento?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nombres?: string;
  direccionFiscal?: string;
  partidaRegistral?: string;
  idCargo?: string;
  telefono?: string;
  emailPersonal?: string;
  ospe?: string;
};

export const EmpresaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  console.log("---- idEmpresa ----");
  console.log({ id });

  const [tipos, setTipos] = useState<Detalle[]>([]);
  const [cargos, setCargos] = useState<Detalle[]>([]);
  const [idEmpresa, setIdEmpresa] = useState<string>("");
  const [idPersona, setIdPersona] = useState<string>("");

  const [camposHabilitadosEmpresa, setCamposHabilitadosEmpresa] =
    useState(false);

  const [camposHabilitadosPersona, setCamposHabilitadosPersona] =
    useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });

  const { isSubmitting } = form.formState;
  const isEditMode = !!id;

  const handleGoBack = () => {
    navigate("/empresa");
  };

  const resetForm = () => {
    const dataForm: TEmpresa = {
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

    form.reset(dataForm);
  };

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
        response = await updatePersona(idPersona, payload);
      } else if (isEditMode && idPersona) {
        console.log("update persona");
        response = await updatePersona(idPersona, payload);
      } else {
        console.log("ccc");
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        let listTipoDocumentos: Detalle[] = [];
        let listCargos: Detalle[] = [];

        const [responseTipoDocumentos, responseCargos] = await Promise.all([
          getTipoDocumentos(),
          getCargos(),
        ]);

        listTipoDocumentos = responseTipoDocumentos as Detalle[];

        listCargos = responseCargos as Detalle[];

        setTipos(listTipoDocumentos);
        setCargos(listCargos);

        console.log({ isEditMode });
        console.log({ id });

        if (isEditMode && id) {
          const responseEmpresa = await getEmpresaById(id);
          console.log({ responseEmpresa });
          const { result, data } = responseEmpresa;

          if (result && data) {
            let dataForm: TEmpresa = {};

            const empresa = data as Empresa;

            const {
              id: idEmpresa,
              numero,
              nombre_o_razon_social,
              direccion,
            } = empresa;

            dataForm.ruc = numero || "";
            dataForm.razonSocial = nombre_o_razon_social || "";
            dataForm.direccion = direccion || "";

            setIdEmpresa(idEmpresa);

            const nombreGrupo = `GRUPO REPRESENTANTE LEGAL`;

            const responsePersona = await getPersonaByEmpresaWithGrupo(
              idEmpresa,
              nombreGrupo,
            );

            console.log({ responsePersona });

            const { result: resultPersona, data: dataPersona } =
              responsePersona;

            if (resultPersona && dataPersona) {
              const representante = dataPersona as Persona;
              console.log({ representante });

              if (!isEditMode) {
                setCamposHabilitadosPersona(false);
              } else {
                setCamposHabilitadosPersona(true);
              }

              if (representante) {
                const uniqueRepresentante = representante[0];

                console.log({ uniqueRepresentante });

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

            form.reset(dataForm);

            form.setValue("idTipoDocumento", dataForm.idTipoDocumento);
            form.setValue("ruc", dataForm.ruc);
            form.setValue("numeroDocumento", dataForm.numeroDocumento);
            form.setValue("idCargo", dataForm.idCargo);
          }
        }
      } catch (error) {
        showToast("error", "Error al cargar los datos de la empresa.");
        console.error("Error fetching empresa:", error);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  return (
    <>
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="border-b border-gray-200 p-4 sm:p-6 flex flex-row items-center justify-between">
          <div className="flex-shrink min-w-0">
            <CardTitle className="text-xl font-bold text-gray-800 truncate">
              {isEditMode ? "Actualización de empresa" : "Registro de empresa"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {isEditMode
                ? "Formulario de actualización de empresa"
                : "Complete el formulario para registrar nueva empresa"}
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
              <fieldset className="border border-gray-300 p-4 rounded-md">
                <legend className="text-base font-semibold text-gray-800 px-2">
                  Datos de empresa
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    setCamposHabilitadosEmpresa(true);
                                    showToast(
                                      "warning",
                                      "No se encontraron datos de empresa",
                                    );
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
              </fieldset>
              <fieldset className="border border-gray-300 p-4 rounded-md">
                <legend className="text-base font-semibold text-gray-800 px-2">
                  Datos del representante legal
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <FormField
                    control={form.control}
                    name="idTipoDocumento"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Tipo de Documento</RequiredLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                          disabled={camposHabilitadosPersona}
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
                              <SelectValue placeholder="Seleccionar tipo de documento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-400">
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
              </fieldset>

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
