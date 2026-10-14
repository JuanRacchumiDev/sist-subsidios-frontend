import { useEffect, useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Spinner } from "../Common/Spinner";
import { useToast } from "../../context/ToastContext";

import { EmpresaSeccion } from "./EmpresaSeccion";
import { RepresentanteSeccion } from "./RepresentanteSeccion";
import {
  empresaFormSchema,
  EmpresaFormValues,
  defaultValues,
} from "./empresaSchema";

import { getEmpresaByApi } from "../../services/apiEmpresaService";
import { getPersonaByApi } from "../../services/apiPersonaService";
import {
  createEmpresa,
  updateEmpresa,
  getEmpresaById,
  getEmpresaByRazonSocial,
} from "../../services/empresaService";
import {
  createPersona,
  updatePersona,
  getPersonaByEmpresaWithGrupo,
} from "../../services/personaService";
import { getDetalles } from "../../services/detalleParametroService";

import { Empresa, EmpresaResponse } from "../../interfaces/IEmpresa";
import { Persona, PersonaResponse } from "../../interfaces/IPersona";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { ParametroClase } from "../../constants/parametroClase";
import { getAuthData } from "../../utils/authMemo";
import { EOrigen } from "@/enums/EOrigen";

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

export const EmpresaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [tipos, setTipos] = useState<Detalle[]>([]);
  const [cargos, setCargos] = useState<Detalle[]>([]);
  const [idEmpresa, setIdEmpresa] = useState<string>("");
  const [idPersona, setIdPersona] = useState<string>("");

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSearchingRuc, setIsSearchingRuc] = useState(false);
  const [isSearchingPersona, setIsSearchingPersona] = useState(false);

  const isEditMode = !!id;

  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaFormSchema),
    defaultValues,
  });

  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  const id_usuario = userProfile?.id_usuario;

  const handleGoBack = () => navigate("/empresa");

  // Carga inicial de datos de combos y edición
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
          const { result, data } = responseEmpresa;

          if (result && data) {
            const empresa = data as Empresa;

            const {
              id: idEmpresa,
              numero,
              nombre_o_razon_social,
              direccion,
            } = empresa;

            setIdEmpresa(idEmpresa);

            const formData: EmpresaFormValues = {
              ...defaultValues,
              ruc: numero || "",
              razonSocial: nombre_o_razon_social || "",
              direccion: direccion || "",
            };

            const nombreGrupo = `GRUPO REPRESENTANTE LEGAL`;

            const responsePersona = await getPersonaByEmpresaWithGrupo(
              idEmpresa,
              nombreGrupo,
            );

            const { result: resultPersona, data: dataPersona } =
              responsePersona;

            if (
              resultPersona &&
              Array.isArray(dataPersona) &&
              dataPersona.length > 0
            ) {
              const representante = dataPersona[0] as Persona;
              setIdPersona(representante.id);

              formData.idTipoDocumento = representante.id_tipodocumento || "";
              formData.numeroDocumento = representante.numero_documento || "";
              formData.nombres = representante.nombres || "";
              formData.sexo = representante.sexo || "";
              formData.apellidoPaterno = representante.apellido_paterno || "";
              formData.apellidoMaterno = representante.apellido_materno || "";
              formData.direccionFiscal = representante.direccion_fiscal || "";
              formData.partidaRegistral = representante.partida_registral || "";
              formData.idCargo = representante.id_cargo || "";
              formData.telefono = representante.telefono || "";
              formData.emailPersonal = representante.email_personal || "";
              formData.ospe = representante.ospe || "";
            }

            form.reset(formData);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        showToast("error", "Error al cargar información inicial.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  // Handler para la búsqueda por RUC
  const handleSearchRuc = async (ruc: string) => {
    try {
      setIsSearchingRuc(true);
      showToast("info", "Consultando RUC...");
      const response = await getEmpresaByApi(ruc);
      const { result, data, message } = response;

      if (result && data) {
        const empresa = data as Empresa;
        if (empresa.id) setIdEmpresa(empresa.id);
        if (empresa.nombre_o_razon_social) {
          form.setValue("razonSocial", empresa.nombre_o_razon_social);
        }
        if (empresa.direccion) {
          form.setValue("direccion", empresa.direccion);
        }
        showToast("success", message || "Datos de empresa encontrados.");
      } else {
        showToast(
          "warning",
          message || "No se encontraron datos. Puede completarlos manualmente.",
        );
      }
    } catch (error) {
      showToast(
        "warning",
        "Ocurrió un inconveniente al consultar API externa. Ingrese los datos manualmente.",
      );
    } finally {
      setIsSearchingRuc(false);
    }
  };

  // Handler para la búsqueda por Documento de Persona
  const handleSearchPersona = async (tipoDoc: string, numDoc: string) => {
    try {
      setIsSearchingPersona(true);
      showToast("info", "Consultando documento...");
      const response = await getPersonaByApi(tipoDoc, numDoc);
      const { result, data, message } = response;

      if (result && data) {
        const persona = data as Persona;
        if (persona.id) setIdPersona(persona.id);
        if (persona.nombres) form.setValue("nombres", persona.nombres);
        if (persona.apellido_paterno)
          form.setValue("apellidoPaterno", persona.apellido_paterno);
        if (persona.apellido_materno)
          form.setValue("apellidoMaterno", persona.apellido_materno);

        showToast("success", message || "Datos de persona encontrados.");
      } else {
        showToast(
          "warning",
          message ||
            "No se encontraron datos. Complete la información manualmente.",
        );
      }
    } catch (error) {
      showToast(
        "warning",
        "Ocurrió un problema al consultar el documento. Puede ingresarlo manualmente.",
      );
    } finally {
      setIsSearchingPersona(false);
    }
  };

  const onSubmit = async (values: EmpresaFormValues) => {
    const {
      ruc,
      razonSocial,
      direccion,
      idTipoDocumento,
      numeroDocumento,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      sexo,
      direccionFiscal,
      partidaRegistral,
      idCargo,
      telefono,
      emailPersonal,
      ospe,
    } = values;

    // Validando si existe empresa registrada
    const existeEmpresa = await getEmpresaByRazonSocial(razonSocial);

    const payloadPersona: Persona = {
      id_tipodocumento: idTipoDocumento,
      id_cargo: idCargo,
      numero_documento: numeroDocumento,
      nombres: nombres,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      sexo,
      direccion_fiscal: direccionFiscal,
      partida_registral: partidaRegistral,
      telefono,
      email_personal: emailPersonal,
      ospe,
      nombre_grupo: "GRUPO REPRESENTANTE LEGAL",
      origen: EOrigen.WEB,
    };

    // Obteniendo el id de empresa
    if (idEmpresa) {
      const payloadEmpresa: Empresa = {
        numero: ruc,
        nombre_o_razon_social: razonSocial,
        direccion,
        user_actualiza: id_usuario,
      };

      const responseUpdateEmpresa = await updateEmpresa(
        idEmpresa,
        payloadEmpresa,
      );

      console.log("---- responseUpdateEmpresa ----");
      console.log({ responseUpdateEmpresa });

      payloadPersona.id_empresa = idEmpresa;
    } else {
      // Validando si existe empresa registrada
      const existeEmpresa = await getEmpresaByRazonSocial(razonSocial);

      const { result, data } = existeEmpresa;
      if (result && data) {
        console.log("Obteniendo empresa por razón social");
        const { id } = data as Empresa;
        payloadPersona.id_empresa = id;
      } else {
        console.log("registro nueva empresa");
        const payloadEmpresa: Empresa = {
          numero: ruc,
          nombre_o_razon_social: razonSocial,
          direccion,
          user_crea: id_usuario,
        };

        console.log({ payloadEmpresa });

        const responseNuevaEmpresa = await createEmpresa(payloadEmpresa);

        console.log({ responseNuevaEmpresa });

        const { data: dataEmpresa } = responseNuevaEmpresa;

        const { data, result } = dataEmpresa as EmpresaResponse;

        if (result && data) {
          const { id } = data as Empresa;
          payloadPersona.id_empresa = id;
        }
      }
    }

    console.log("---- payload persona ----");
    console.log({ payloadPersona });

    try {
      let response: PersonaResponse;
      if (idPersona) {
        console.log("---- actualiza persona ----");
        payloadPersona.user_actualiza = id_usuario;
        response = await updatePersona(idPersona, payloadPersona);
      } else {
        console.log("---- crea persona ----");
        payloadPersona.user_crea = id_usuario;
        response = await createPersona(payloadPersona);
      }

      console.log("---- response persona ----");
      console.log({ response });

      const { result, message, error } = response;

      if (result) {
        showToast("success", message || "Guardado exitosamente.");
        navigate("/empresa");
      } else {
        showToast("error", error || message || "Error al guardar el registro.");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      showToast(
        "error",
        "Ocurrió un error inesperado al procesar la solicitud.",
      );
    }
  };

  return (
    <Card className="shadow-xl border-none bg-white">
      <CardHeader className="border-b border-gray-100 p-6 flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {isEditMode ? "Editar empresa" : "Nuevo Registro de empresa"}
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            {isEditMode
              ? "Actualización de información de empresa"
              : "Complete la información para registrar una empresa"}
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

      <CardContent className="px-6 sm:px-8 pt-3 pb-6 relative">
        {isLoadingData && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
            <Spinner className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <EmpresaSeccion
              form={form}
              isEditMode={isEditMode}
              isSearchingRuc={isSearchingRuc}
              onSearchRuc={handleSearchRuc}
            />

            <RepresentanteSeccion
              form={form}
              tiposDocumento={tipos}
              cargos={cargos}
              isSearchingPersona={isSearchingPersona}
              onSearchPersona={handleSearchPersona}
            />

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoBack}
                disabled={form.formState.isSubmitting}
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white transition-all min-w-[140px]"
              >
                {form.formState.isSubmitting ? (
                  <Spinner className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditMode ? "Actualizar" : "Guardar"}
                {/* {isSubmitting ? (
                  <Spinner className="h-4 w-4 mr-2 border-2 border-white/20 border-t-white" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditMode ? "Guardar Cambios" : "Registrar"} */}
              </Button>
            </div>

            {/* <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoBack}
                disabled={form.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
              >
                {form.formState.isSubmitting ? (
                  <Spinner className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditMode ? "Actualizar" : "Guardar"}
              </Button>
            </div> */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
