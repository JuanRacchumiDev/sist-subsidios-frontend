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
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { getTipoDocumentos } from "@/services/tipoDocumentoService";
import { getCargos } from "@/services/cargoService";
import { RequiredLabel } from "../Common/RequiredLabel";
import { Input } from "../ui/input";
import { getEmpresaByApi } from "@/services/apiEmpresaService";
import { Empresa, EmpresaResponse } from "@/interfaces/IEmpresa";
import { getPersonaByApi } from "@/services/apiPersonaService";
import { getEmpresaById } from "@/services/empresaService";
import { Persona } from "@/interfaces/IPersona";
import { Button } from "../ui/button";
import {
  RepresentanteLegal,
  RepresentanteLegalResponse,
} from "@/interfaces/IRepresentanteLegal";
import {
  createRepresentante,
  updateRepresentante,
} from "@/services/representanteService";

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
  apellidoPateno: z
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
  correo: z.string().email({ message: "Correo electrónico inválido." }),
  ospe: z.string().min(1, { message: "El OSPE es requerido." }),
});

type TipoDocumento = {
  id: string;
  abreviatura: string;
};

type Cargo = {
  id: string;
  nombre: string;
};

export const EmpresaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [idEmpresa, setIdEmpresa] = useState<string>("");
  const [idRepresentante, setIdRepresentante] = useState<string>("");

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
      apellidoPateno: "",
      apellidoMaterno: "",
      nombres: "",
      direccionFiscal: "",
      partidaRegistral: "",
      idCargo: "",
      telefono: "",
      correo: "",
      ospe: "",
    },
  });

  const { isSubmitting } = form.formState;
  const isEditMode = !!id;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log({ values });
      console.log({ idRepresentante });

      let messageError: string = "";

      let response: RepresentanteLegalResponse;

      // Obteniendo valores del formulario
      const {
        idTipoDocumento,
        idCargo,
        numeroDocumento,
        nombres,
        apellidoPateno,
        apellidoMaterno,
        direccionFiscal,
        partidaRegistral,
        telefono,
        correo,
        ospe,
      } = values;

      const payload: RepresentanteLegal = {
        id_tipodocumento: idTipoDocumento,
        id_empresa: idEmpresa,
        id_cargo: idCargo,
        numero_documento: numeroDocumento,
        nombres,
        apellido_paterno: apellidoPateno,
        apellido_materno: apellidoMaterno,
        direccion_fiscal: direccionFiscal,
        partida_registral: partidaRegistral,
        telefono,
        correo,
        ospe,
      };

      if (isEditMode && idRepresentante) {
        messageError = "Error al actualizar el representante legal";
        response = await updateRepresentante(idRepresentante, payload);
      } else {
        messageError = "Error al registrar el representante legal";
        response = await await createRepresentante(payload);
      }

      const { result, message, error } = response as RepresentanteLegalResponse;

      if (result) {
        showToast("success", message);
        navigate("/empresa");
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
        let dataForm = {
          ruc: "",
          razonSocial: "",
          direccion: "",
          idTipoDocumento: "",
          numeroDocumento: "",
          apellidoPateno: "",
          apellidoMaterno: "",
          nombres: "",
          direccionFiscal: "",
          partidaRegistral: "",
          idCargo: "",
          telefono: "",
          correo: "",
          ospe: "",
        };

        let listTipoDocumentos: TipoDocumento[] = [];
        let listCargos: Cargo[] = [];

        const [responseTipoDocumentos, responseCargos] = await Promise.all([
          getTipoDocumentos(),
          getCargos(),
        ]);

        const { result: resultTipoDocs, data: dataTipoDocs } =
          responseTipoDocumentos;
        if (resultTipoDocs && dataTipoDocs) {
          listTipoDocumentos = dataTipoDocs as TipoDocumento[];
        }

        const { result: resultCargos, data: dataCargos } = responseCargos;
        if (resultCargos && dataCargos) {
          listCargos = dataCargos as Cargo[];
        }

        setTipos(listTipoDocumentos);
        setCargos(listCargos);

        if (isEditMode && id) {
          const responseEmpresa = await getEmpresaById(id);

          const { result, data } = responseEmpresa;

          if (result && data) {
            const empresa = data as Empresa;

            const {
              id: idEmpresa,
              numero,
              nombre_o_razon_social,
              direccion,
              representantes,
            } = empresa;

            dataForm.ruc = numero;
            dataForm.razonSocial = nombre_o_razon_social;
            dataForm.direccion = direccion;

            setIdEmpresa(idEmpresa);

            const listRepresentantes = representantes as RepresentanteLegal[];

            const totalRepresentantes = listRepresentantes.length;

            if (totalRepresentantes === 1) {
              const representante = listRepresentantes[0] as RepresentanteLegal;

              const {
                id_tipodocumento,
                id_cargo,
                numero_documento,
                nombres,
                apellido_paterno,
                apellido_materno,
                direccion_fiscal,
                partida_registral,
                telefono,
                correo,
                ospe,
              } = representante;

              setIdRepresentante(representante.id);

              dataForm = {
                ...dataForm,
                idTipoDocumento: id_tipodocumento,
                numeroDocumento: numero_documento,
                apellidoPateno: apellido_paterno,
                apellidoMaterno: apellido_materno,
                nombres,
                direccionFiscal: direccion_fiscal,
                partidaRegistral: partida_registral,
                idCargo: id_cargo,
                telefono,
                correo,
                ospe,
              };

              console.log({ dataForm });

              form.reset(dataForm);
            }

            // Deshabilita los siguientes campos
            form.setValue("idTipoDocumento", dataForm.idTipoDocumento);
            form.setValue("ruc", dataForm.ruc);
            form.setValue("numeroDocumento", dataForm.numeroDocumento);
            form.setValue("idCargo", dataForm.idCargo);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Información de empresa</CardTitle>
          <CardDescription>
            {isEditMode
              ? "Actualice los datos de la empresa"
              : "Ingrese los datos de la empresa"}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                                    field.value
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
                                      nombre_o_razon_social
                                    );

                                    form.setValue("direccion", direccion);
                                    setCamposHabilitadosEmpresa(false);
                                  } else {
                                    showToast(
                                      "error",
                                      "Error información de emoresa"
                                    );
                                    setCamposHabilitadosEmpresa(true);
                                  }
                                } catch (error) {
                                  setCamposHabilitadosEmpresa(true);
                                  showToast(
                                    "error",
                                    "No se encontró la empresa"
                                  );
                                }
                              }
                            }}
                            disabled={isEditMode}
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
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
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
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
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
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
                          disabled={isEditMode}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={
                                fieldState.invalid ? "border-red-500" : ""
                              }
                            >
                              <SelectValue placeholder="Seleccionar tipo de documento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tipos.map((tipo) => (
                              <SelectItem value={tipo.id} key={tipo.id}>
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
                            disabled={isEditMode}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                try {
                                  showToast("success", "Buscando persona...");

                                  const idTipoDocumento =
                                    form.getValues("idTipoDocumento");

                                  const responsePersona = await getPersonaByApi(
                                    idTipoDocumento,
                                    field.value
                                  );

                                  const { result, data } = responsePersona;

                                  if (result && data) {
                                    const persona = data as Persona;

                                    const {
                                      nombres,
                                      apellido_paterno,
                                      apellido_materno,
                                    } = persona;

                                    form.setValue("nombres", nombres);

                                    form.setValue(
                                      "apellidoPateno",
                                      apellido_paterno
                                    );

                                    form.setValue(
                                      "apellidoMaterno",
                                      apellido_materno
                                    );
                                    setCamposHabilitadosPersona(false);
                                  } else {
                                    setCamposHabilitadosPersona(true);
                                  }
                                } catch (error) {
                                  setCamposHabilitadosPersona(true);
                                  showToast(
                                    "error",
                                    "Error al buscar una persona"
                                  );
                                }
                              }
                            }}
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apellidoPateno"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Apellido paterno</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="Pérez"
                            autoComplete="off"
                            maxLength={30}
                            {...field}
                            disabled={!camposHabilitadosPersona}
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
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
                            disabled={!camposHabilitadosPersona}
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
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
                            disabled={!camposHabilitadosPersona}
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
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
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
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
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="idCargo"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Cargo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={
                                fieldState.invalid ? "border-red-500" : ""
                              }
                            >
                              <SelectValue placeholder="Seleccionar cargo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cargos.map((cargo) => (
                              <SelectItem key={cargo.id} value={cargo.id}>
                                {cargo.nombre}
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
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="correo"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Correo Electrónico</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="luz.perez@email.com"
                            type="email"
                            autoComplete="off"
                            maxLength={50}
                            {...field}
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
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
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

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
                  onClick={() => navigate("/empresa")}
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
