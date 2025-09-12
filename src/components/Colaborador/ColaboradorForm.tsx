import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, parseISO } from "date-fns";
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
  FormDescription,
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

import { getEmpresas } from "@/services/empresaService";
import { getTipoDocumentos } from "@/services/tipoDocumentoService";
import { getCargos } from "@/services/cargoService";
import { getPersonaByIdTipoDocAndNumDoc } from "@/services/personaService";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RequiredLabel } from "../Common/RequiredLabel";
import { Colaborador, ColaboradorResponse } from "@/interfaces/IColaborador";
import {
  createColaborador,
  getColaboradorById,
} from "@/services/colaboradorService";

const formSchema = z.object({
  idTipoDocumento: z
    .string({
      message: "Por favor seleccione un tipo de documento.",
    })
    .min(1, "Por favor seleccione un tipo de documento."),
  numeroDocumento: z.string().min(8, {
    message: "El número de documento debe tener al menos 8 caracteres.",
  }),
  nombres: z.string().min(2, {
    message: "Los nombres son requeridos.",
  }),
  apellidoPaterno: z.string().min(2, {
    message: "El apellido paterno es requerido.",
  }),
  apellidoMaterno: z.string().min(2, {
    message: "El apellido materno es requerido.",
  }),
  // fechaNacimiento: z.string().optional(),
  fechaNacimiento: z
    .date({
      message: "La fecha de nacimiento es requerida",
    })
    .refine((val) => val !== null, {
      message: "La fecha de nacimiento es requerida",
    }),
  idEmpresa: z
    .string({
      message: "Por favor seleccione una empresa.",
    })
    .min(1, "Por favor seleccione una empresa"),
  idCargo: z
    .string({
      message: "Por favor seleccione un cargo.",
    })
    .min(1, "Por favor seleccione un cargo"),
  nombreArea: z.string().min(2, {
    message: "El área es requerida.",
  }),
  nombreSede: z.string().min(2, {
    message: "La sede es requerida.",
  }),
  emailInstitucional: z.string().email({
    message: "Por favor ingrese un correo institucional válido.",
  }),
  emailPersonal: z.string().email({
    message: "Por favor ingrese un correo personal válido.",
  }),
  numeroCelular: z.string().min(9, {
    message: "El número de celular debe tener al menos 9 dígitos.",
  }),
  fechaIngreso: z.date().optional(),
  // fechaIngreso: z.string().optional(),
  esAsociadoSindicato: z.boolean().optional(),
  esPresentaInconvenientes: z.boolean().optional(),
});

type Empresa = {
  id: string;
  nombre_o_razon_social: string;
};

type TipoDocumento = {
  id: string;
  abreviatura: string;
};

type Cargo = {
  id: string;
  nombre: string;
};

type Persona = {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: string;
};

export const ColaboradorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);

  const [camposHabilitadosPersona, setCamposHabilitadosPersona] =
    useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idTipoDocumento: "",
      numeroDocumento: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      fechaNacimiento: null,
      idEmpresa: "",
      idCargo: "",
      nombreArea: "",
      nombreSede: "",
      emailInstitucional: "",
      emailPersonal: "",
      numeroCelular: "",
      fechaIngreso: null,
      esAsociadoSindicato: false,
      esPresentaInconvenientes: false,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const {
        idTipoDocumento,
        idCargo,
        idEmpresa,
        numeroDocumento,
        apellidoPaterno,
        apellidoMaterno,
        nombres,
        fechaNacimiento,
        fechaIngreso,
        nombreArea,
        nombreSede,
        emailInstitucional,
        emailPersonal,
        numeroCelular,
        esAsociadoSindicato,
        esPresentaInconvenientes,
      } = values;

      const nombreCompleto: string = `${nombres} ${apellidoPaterno} ${apellidoMaterno}`;

      const fechaNacimientoToString: string | null = fechaNacimiento
        ? fechaNacimiento.toISOString()
        : null;
      const partsFechaNacimientoStr: string[] =
        fechaNacimientoToString.split("T");
      const fechaNacimientoStr: string = partsFechaNacimientoStr[0];

      let fechaIngresoStr: string | null = null;
      if (fechaIngreso) {
        const fechaIngresoToString: string | null = fechaIngreso.toISOString();
        const partsFechaIngreso: string[] = fechaIngresoToString.split("T");
        fechaIngresoStr = partsFechaIngreso[0];
      }

      const payload: Colaborador = {
        id_tipodocumento: idTipoDocumento,
        id_cargo: idCargo,
        id_empresa: idEmpresa,
        numero_documento: numeroDocumento,
        apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno,
        nombres,
        nombre_completo: nombreCompleto,
        fecha_nacimiento: fechaNacimientoStr,
        fecha_ingreso: fechaIngresoStr,
        nombre_area: nombreArea,
        nombre_sede: nombreSede,
        correo_institucional: emailInstitucional,
        correo_personal: emailPersonal,
        numero_celular: numeroCelular,
        is_asociado_sindicato: esAsociadoSindicato,
        is_presenta_inconvenientes: esPresentaInconvenientes,
      };

      const response = await createColaborador(payload);
      const { result, message } = response as ColaboradorResponse;

      if (result) {
        showToast("success", message);
        navigate("/colaborador");
      } else {
        showToast("error", message || "Error al registrar al colaborador");
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
        let listEmpresas: Empresa[] = [];
        let listTipoDocumentos: TipoDocumento[] = [];
        let listCargos: Cargo[] = [];

        const [responseEmpresas, responseTipoDocumentos, responseCargos] =
          await Promise.all([getEmpresas(), getTipoDocumentos(), getCargos()]);

        const { result: resultEmpresas, data: dataEmpresas } = responseEmpresas;
        if (resultEmpresas && dataEmpresas) {
          listEmpresas = dataEmpresas as Empresa[];
        }

        const { result: resultTipos, data: dataTipos } = responseTipoDocumentos;
        if (resultTipos && dataTipos) {
          listTipoDocumentos = dataTipos as TipoDocumento[];
        }

        const { result: resultCargos, data: dataCargos } = responseCargos;
        if (resultCargos && dataCargos) {
          listCargos = dataCargos as Cargo[];
        }

        setEmpresas(listEmpresas);
        setTipos(listTipoDocumentos);
        setCargos(listCargos);

        if (id) {
          const responseColaborador = await getColaboradorById(id);
          const { result, data, message } = responseColaborador;

          if (result && data) {
            const colaborador = data as Colaborador;
            const {
              id_tipodocumento,
              numero_documento,
              nombres,
              apellido_paterno,
              apellido_materno,
              fecha_nacimiento,
              fecha_ingreso,
              id_empresa,
              id_cargo,
              nombre_area,
              nombre_sede,
              correo_institucional,
              correo_personal,
              numero_celular,
              is_asociado_sindicato,
              is_presenta_inconvenientes,
            } = colaborador;

            form.reset({
              idTipoDocumento: id_tipodocumento ?? "",
              numeroDocumento: numero_documento ?? "",
              nombres: nombres ?? "",
              apellidoPaterno: apellido_paterno ?? "",
              apellidoMaterno: apellido_materno ?? "",
              fechaNacimiento: fecha_nacimiento
                ? parseISO(fecha_nacimiento)
                : null,
              fechaIngreso: fecha_ingreso ? parseISO(fecha_ingreso) : null,
              idEmpresa: id_empresa ?? "",
              idCargo: id_cargo ?? "",
              nombreArea: nombre_area ?? "",
              nombreSede: nombre_sede ?? "",
              emailInstitucional: correo_institucional ?? "",
              emailPersonal: correo_personal ?? "",
              numeroCelular: numero_celular ?? "",
              esAsociadoSindicato: is_asociado_sindicato ?? false,
              esPresentaInconvenientes: is_presenta_inconvenientes ?? false,
            });
          } else {
            showToast("error", message || "Colaborador no encontrado");
            navigate("/colaborador/nuevo");
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
      <Card>
        <CardHeader>
          <CardTitle>Información Personal y Laboral</CardTitle>
          <CardDescription>Ingrese los datos del colaborador</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <fieldset className="border border-gray-300 p-4 rounded-md">
                <legend className="text-base font-semibold text-gray-800 px-2">
                  Información personal
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="idTipoDocumento"
                    render={({ field, fieldState }) => (
                      <FormItem className="mb-4">
                        <RequiredLabel>Tipo de Documento</RequiredLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
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
                            placeholder="12345678"
                            autoComplete="off"
                            maxLength={8}
                            {...field}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                try {
                                  showToast("success", "Buscando persona...");

                                  const idTipoDocumento =
                                    form.getValues("idTipoDocumento");

                                  const responsePersona =
                                    await getPersonaByIdTipoDocAndNumDoc(
                                      idTipoDocumento,
                                      field.value
                                    );

                                  const { result, data, message } =
                                    responsePersona;

                                  if (result && data) {
                                    const persona = data as Persona;

                                    const {
                                      nombres,
                                      apellido_paterno,
                                      apellido_materno,
                                      fecha_nacimiento,
                                    } = persona;

                                    form.setValue("nombres", nombres);

                                    form.setValue(
                                      "apellidoPaterno",
                                      apellido_paterno
                                    );

                                    form.setValue(
                                      "apellidoMaterno",
                                      apellido_materno
                                    );

                                    if (fecha_nacimiento) {
                                      const fechaParsed =
                                        parseISO(fecha_nacimiento);
                                      form.setValue(
                                        "fechaNacimiento",
                                        fechaParsed
                                      );
                                    }

                                    showToast("success", message);

                                    setCamposHabilitadosPersona(false);
                                  } else {
                                    setCamposHabilitadosPersona(true);
                                  }
                                } catch (error) {
                                  setCamposHabilitadosPersona(true);
                                  // showErrorToast("Error al crear persona");
                                  showToast("error", "Error al crear persona");
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
                    name="nombres"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Nombres</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="María Angélica"
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
                    name="apellidoPaterno"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Apellido Paterno</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="Pérez"
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
                    name="apellidoMaterno"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Apellido Materno</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="Vallejos"
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
                    name="fechaNacimiento"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Fecha de Nacimiento</RequiredLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={
                              field.value
                                ? format(field.value, "yyyy-MM-dd")
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseISO(e.target.value) : null
                              )
                            }
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value
                            ? format(field.value, "PPP")
                            : "Seleccione una fecha"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="border border-gray-300 p-4 rounded-md">
                <legend className="text-base font-semibold text-gray-800 px-2">
                  Información laboral
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="idEmpresa"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Empresa</RequiredLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={
                                fieldState.invalid ? "border-red-500" : ""
                              }
                            >
                              <SelectValue placeholder="Seleccionar empresa" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {empresas.map((empresa) => (
                              <SelectItem value={empresa.id} key={empresa.id}>
                                {empresa.nombre_o_razon_social}
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
                    name="idCargo"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Cargo</RequiredLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
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
                              <SelectItem value={cargo.id} key={cargo.id}>
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
                    name="nombreArea"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Área</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="Recursos Humanos"
                            autoComplete="off"
                            maxLength={40}
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
                    name="nombreSede"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Sede</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="Lima"
                            autoComplete="off"
                            maxLength={40}
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
                    name="emailInstitucional"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Correo Institucional</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="maria.lopez@empresa.com"
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
                    name="emailPersonal"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Correo Personal</RequiredLabel>
                        <FormControl>
                          <Input
                            placeholder="maria.lopez@gmail.com"
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
                    name="numeroCelular"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Número de Celular</RequiredLabel>
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
                    name="fechaIngreso"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <RequiredLabel>Fecha de Ingreso</RequiredLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={
                              field.value
                                ? format(field.value, "yyyy-MM-dd")
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseISO(e.target.value) : null
                              )
                            }
                            className={
                              fieldState.invalid ? "border-red-500" : ""
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value
                            ? format(field.value, "PPP")
                            : "Seleccione una fecha"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="esAsociadoSindicato"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="checkbox"
                            id="acceptSindicato"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4"
                          />
                          <label htmlFor="acceptSindicato" className="text-sm">
                            Asociado a un sindicato
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="esPresentaInconvenientes"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="checkbox"
                            id="acceptInconvenientes"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4"
                          />
                          <label
                            htmlFor="acceptInconvenientes"
                            className="text-sm"
                          >
                            Presenta inconvenientes
                          </label>
                        </div>
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
                  onClick={() => navigate("/colaborador")}
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
