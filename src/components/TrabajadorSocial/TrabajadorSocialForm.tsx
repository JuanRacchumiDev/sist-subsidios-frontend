import { useEffect, useState, useMemo, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { parseISO } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Spinner } from "../Common/Spinner";

import { useToast } from "../../context/ToastContext";
import { getEmpresas } from "../../services/empresaService";
import { getDetalles } from "../../services/detalleParametroService";
import {
  getPersonaByIdTipoDocAndNumDoc,
  getPersonaById,
  createPersona,
  updatePersona,
} from "../../services/personaService";

import { Persona, PersonaResponse } from "../../interfaces/IPersona";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { Empresa } from "../../interfaces/IEmpresa";
import { ParametroClase } from "../../constants/parametroClase";
import { getAuthData } from "../../utils/authMemo";

import {
  trabajadorSocialSchema,
  TrabajadorSocialFormValues,
  defaultValues,
} from "./schemas/trabajadorSocialSchema";
import { InformacionPersonalFields } from "./InformacionPersonal";
import { InformacionLaboralFields } from "./InformacionLaboral";
import { EOrigen } from "@/enums/EOrigen";

const loadEmpresas = async (): Promise<Empresa[]> => {
  try {
    const response = await getEmpresas();
    const { result, data } = response;
    return result && data ? (data as Empresa[]) : [];
  } catch (error) {
    console.error("Error al obtener empresas", error);
    return [];
  }
};

const loadTipoDocumentos = async (): Promise<Detalle[]> => {
  try {
    const response = await getDetalles(ParametroClase.TIPO_DOCUMENTO, true);
    const { result, data } = response;
    return result && data ? (data as Detalle[]) : [];
  } catch (error) {
    console.error("Error al obtener tipo de documentos", error);
    return [];
  }
};

const loadCargos = async (): Promise<Detalle[]> => {
  try {
    const response = await getDetalles(ParametroClase.CARGO, true);
    const { result, data } = response;
    return result && data ? (data as Detalle[]) : [];
  } catch (error) {
    console.error("Error al obtener cargos", error);
    return [];
  }
};

export const TrabajadorSocialForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [tipos, setTipos] = useState<Detalle[]>([]);
  const [cargos, setCargos] = useState<Detalle[]>([]);
  const [idPersona, setIdPersona] = useState<string>("");
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Por defecto permitimos ingresar datos directamente sin api obligatoria
  const [camposHabilitados, setCamposHabilitados] = useState(true);
  const [campoFecNacHabilitado, setCampoFecNacHabilitado] = useState(true);

  const isEditMode = !!id;
  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  const id_usuario = userProfile?.id_usuario;

  const handleGoBack = () => {
    navigate("/trabajador-social");
  };

  const form = useForm<z.infer<typeof trabajadorSocialSchema>>({
    resolver: zodResolver(trabajadorSocialSchema),
    defaultValues,
  });

  const { setValue, reset, formState } = form;
  const { isSubmitting } = formState;

  const resetForm = () => {
    reset(defaultValues);
    setCamposHabilitados(false);
    setCampoFecNacHabilitado(false);
    setIdPersona("");
  };

  // Carga de catálogos y datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);

      try {
        const [listEmpresas, listTipoDocumentos, listCargos] =
          await Promise.all([
            loadEmpresas(),
            loadTipoDocumentos(),
            loadCargos(),
          ]);

        setEmpresas(listEmpresas);
        setTipos(listTipoDocumentos);
        setCargos(listCargos);

        if (isEditMode && id) {
          const responseTrabajadorSocial = await getPersonaById(id);
          console.log({ responseTrabajadorSocial });

          const { result, data, message } = responseTrabajadorSocial;

          if (result && data) {
            const trabajadorSocial = data as Persona;
            console.log({ trabajadorSocial });

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
              email_institucional,
              email_personal,
              telefono,
              sexo,
            } = trabajadorSocial;

            setIdPersona(id);

            const dataForm = {
              idTipoDocumento: id_tipodocumento || "",
              numeroDocumento: numero_documento || "",
              nombres: nombres || "",
              apellidoPaterno: apellido_paterno || "",
              apellidoMaterno: apellido_materno || "",
              fechaNacimiento: fecha_nacimiento
                ? parseISO(fecha_nacimiento)
                : null,
              fechaIngreso: fecha_ingreso ? parseISO(fecha_ingreso) : null,
              idEmpresa: id_empresa || "",
              idCargo: id_cargo || "",
              nombreArea: nombre_area || "",
              nombreSede: nombre_sede || "",
              emailInstitucional: email_institucional || "",
              emailPersonal: email_personal || "",
              telefono: telefono || "",
              sexo: sexo || "",
            };

            reset(dataForm);
          } else {
            showToast("error", message || "Trabajador social no encontrado");
            navigate("/trabajador-social/nuevo");
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
  }, [id, isEditMode, navigate, reset, showToast]);

  // Búsqueda opcional por Documento
  const handleSearchPersonaByDocumento = useCallback(
    async (idTipoDocumento: string, numeroDocumento: string) => {
      try {
        showToast("info", "Buscando datos de la persona...");
        const responsePersona = await getPersonaByIdTipoDocAndNumDoc(
          idTipoDocumento,
          numeroDocumento,
        );

        const { result, data, message } = responsePersona;

        if (result && data) {
          const persona = data as Persona;
          setIdPersona(persona.id);

          setValue("nombres", persona.nombres || "", { shouldValidate: true });
          setValue("apellidoPaterno", persona.apellido_paterno || "", {
            shouldValidate: true,
          });
          setValue("apellidoMaterno", persona.apellido_materno || "", {
            shouldValidate: true,
          });

          if (persona.sexo) {
            setValue("sexo", persona.sexo, { shouldValidate: true });
          }

          if (persona.fecha_nacimiento) {
            setValue("fechaNacimiento", parseISO(persona.fecha_nacimiento), {
              shouldValidate: true,
            });
            setCampoFecNacHabilitado(false);
          } else {
            setValue("fechaNacimiento", null, { shouldValidate: true });
            setCampoFecNacHabilitado(true);
          }

          setCamposHabilitados(false);
          showToast("success", message as string);
        } else {
          setCamposHabilitados(true);
          setCampoFecNacHabilitado(true);
          showToast(
            "warning",
            "No se encontraron registros previos. Puede ingresar los datos manualmente.",
          );
        }
      } catch (error) {
        setCamposHabilitados(true);
        setCampoFecNacHabilitado(true);
        showToast("error", "Error al consultar el documento.");
      }
    },
    [setValue, showToast],
  );

  // Envío del formulario
  const onSubmit = async (values: TrabajadorSocialFormValues) => {
    const {
      idTipoDocumento,
      idCargo,
      idEmpresa,
      numeroDocumento,
      apellidoPaterno,
      apellidoMaterno,
      nombres,
      sexo,
      fechaNacimiento,
      fechaIngreso,
      nombreArea,
      nombreSede,
      emailInstitucional,
      emailPersonal,
      telefono,
    } = values;

    const nombreCompleto =
      `${nombres} ${apellidoPaterno} ${apellidoMaterno}`.trim();
    const fechaNacimientoStr = fechaNacimiento
      ? fechaNacimiento.toISOString().split("T")[0]
      : null;
    const fechaIngresoStr = fechaIngreso
      ? fechaIngreso.toISOString().split("T")[0]
      : null;

    const payload: Persona = {
      id_tipodocumento: idTipoDocumento,
      id_cargo: idCargo,
      id_empresa: idEmpresa,
      numero_documento: numeroDocumento,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      nombres,
      sexo,
      nombre_completo: nombreCompleto,
      fecha_nacimiento: fechaNacimientoStr,
      fecha_ingreso: fechaIngresoStr,
      nombre_area: nombreArea,
      nombre_sede: nombreSede,
      email_institucional: emailInstitucional.trim(),
      email_personal: emailPersonal.trim(),
      telefono,
      origen: EOrigen.WEB,
      nombre_grupo: "GRUPO TRABAJADOR SOCIAL",
    };

    try {
      let response: PersonaResponse;

      if (idPersona) {
        payload.user_actualiza = id_usuario;
        response = await updatePersona(idPersona, payload);
      } else {
        payload.user_crea = id_usuario;
        response = await createPersona(payload);
      }

      const { result, message, error } = response;

      if (result) {
        showToast("success", message || "Registro guardado exitosamente");
        navigate("/trabajador-social");
      } else {
        showToast("error", error || "Error al guardar el registro");
      }
    } catch (error: any) {
      console.error("Error al registrar trabajador social", error);
      showToast("error", error?.message || "Ocurrió un error inesperado.");
    }
  };

  return (
    <Card className="shadow-xl border-none bg-white">
      <CardHeader className="border-b border-gray-100 p-6 flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {isEditMode
              ? "Editar trabajador social"
              : "Nuevo registro de trabajador social"}
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            {isEditMode
              ? "Actualización de información de trabajador social"
              : "Complete la información para registrar un trabajador social"}
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

      <CardContent className="px-6 sm:px-8 py-6 relative">
        {isLoadingData && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
            <Spinner className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        )}

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <InformacionPersonalFields
              tiposDocumento={tipos}
              isEditMode={isEditMode}
              camposHabilitados={camposHabilitados}
              campoFecNacHabilitado={campoFecNacHabilitado}
              onSearchPersonaByDocumento={handleSearchPersonaByDocumento}
            />

            <InformacionLaboralFields empresas={empresas} cargos={cargos} />

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoBack}
                disabled={isSubmitting}
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white transition-all min-w-[140px]"
              >
                {isSubmitting ? (
                  <Spinner className="h-4 w-4 mr-2 border-2 border-white/20 border-t-white" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditMode ? "Guardar Cambios" : "Registrar"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
