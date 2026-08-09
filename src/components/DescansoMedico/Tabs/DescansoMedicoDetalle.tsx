import { useEffect, useMemo, useState } from "react";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { RequiredLabel } from "../../../components/Common/RequiredLabel";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { useToast } from "../../../context/ToastContext";

import { Empresa } from "../../../interfaces/IEmpresa";
import { Persona, PersonaResponse } from "../../../interfaces/IPersona";
import { Detalle } from "../../../interfaces/IDetalleParametro";
import { DocumentoTipoContingencia } from "../../../interfaces/IDocumentoTipoContingencia";
import { Adjunto } from "../../../interfaces/IAdjunto";
import { DescansoMedico } from "../../../interfaces/IDescansoMedico";

import { getEmpresas } from "../../../services/empresaService";
import {
  getPersonas,
  getPersonasByEmpresaWithGrupo,
} from "../../../services/personaService";
import {
  getDetalleById,
  getDetalles,
} from "../../../services/detalleParametroService";
import { getDescansoById } from "../../../services/descansoMedicoService";

import SearchableCombobox from "../../../components/Common/SearchableCombobox";
import { formSchema } from "../DescansoMedicoForm";
import Documentos from "../../../components/TipoContingencia/Documentos";
import { getAuthData } from "../../../utils/authMemo";

import { ParametroClase } from "../../../constants/parametroClase";
import { EPerfil } from "../../../enums/EPerfil";

// Constantes de validación para adjuntos
export const MAX_FILE_SIZE_MB = 2;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ["application/pdf"];

interface DescansoMedicoDetalleProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  isModoLectura?: boolean;
}

const loadEmpresas = async (): Promise<Empresa[]> => {
  let empresas: Empresa[] = [];

  try {
    const response = await getEmpresas();
    console.log("response getEmpresas");
    console.log({ response });

    const { result, data } = response;

    if (result && data) {
      empresas = data as Empresa[];
    }
    return empresas;
  } catch (error) {
    console.error("Error al obtener empresas", error);
    return [];
  }
};

const loadColaboradores = async (
  idEmpresa: string | null = null,
): Promise<Persona[]> => {
  let colaboradores: Persona[] = [];
  let response: PersonaResponse;
  const nombreGrupo: string = "GRUPO COLABORADOR";

  try {
    if (idEmpresa) {
      response = await getPersonasByEmpresaWithGrupo(idEmpresa, nombreGrupo);
    } else {
      response = await getPersonas();
    }

    console.log("---- response dataColaboradores ----");
    console.log({ response });

    const { result, data } = response;

    if (result && data) {
      colaboradores = data as Persona[];
    }

    return colaboradores;
  } catch (error) {
    console.error("Error al obtener colaboradores", error);
    return [];
  }
};

const loadTipoDescansosMedicos = async (): Promise<Detalle[]> => {
  let tipoDescansos: Detalle[] = [];

  const estadoTDM: boolean = true;
  // const enPersona: boolean = false;

  try {
    const response = await getDetalles(
      ParametroClase.TIPO_DESCANSO_MEDICO,
      estadoTDM,
      // enPersona,
    );

    const { result, data } = response;

    if (result && data) {
      tipoDescansos = data as Detalle[];
    }

    return tipoDescansos;
  } catch (error) {
    console.error("Error al obtener data tipo descansos médicos", error);
    return [];
  }
};

const loadAdjuntos = async (idDescansoMedico: string): Promise<Adjunto[]> => {
  let adjuntos: Adjunto[] = [];

  try {
    if (idDescansoMedico) {
      const responseDescanso = await getDescansoById(idDescansoMedico);
      const { result, data } = responseDescanso;

      if (result && data) {
        const descanso = data as DescansoMedico;
        adjuntos = descanso.adjuntos as Adjunto[];
      }
    }
    return adjuntos;
  } catch (error) {
    console.error("Error al obtener data adjuntos", error);
    return [];
  }
};

const loadTipoContingencias = async (): Promise<Detalle[]> => {
  let tipoContingencias: Detalle[] = [];

  const estadoTC: boolean = true;
  // const enPersona: boolean = false;

  try {
    const response = await getDetalles(
      ParametroClase.TIPO_CONTINGENCIA,
      estadoTC,
      // enPersona,
    );

    const { result, data } = response;

    if (result && data) {
      tipoContingencias = data as Detalle[];
    }

    return tipoContingencias;
  } catch (error) {
    console.error("Error al obtener data tipo contingencias", error);
    return [];
  }
};

export const DescansoMedicoDetalle = ({
  form,
  isModoLectura = false,
}: DescansoMedicoDetalleProps) => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [colaboradores, setColaboradores] = useState<Persona[]>([]);
  const [tipoDescansos, setTipoDescansos] = useState<Detalle[]>([]);
  const [tipoContingencias, setTipoContingencias] = useState<Detalle[]>([]);
  const [documentosTipoContingencia, setDocumentosTipoContingencia] = useState<
    DocumentoTipoContingencia[]
  >([]);
  const [adjuntos, setAdjuntos] = useState<Adjunto[]>([]);

  const [totalDias, setTotalDias] = useState<number | null>(null);
  const [isEmpresaDisabled, setIsEmpresaDisabled] = useState<boolean>(false);
  const [isColaboradorDisabled, setIsColaboradorDisabled] =
    useState<boolean>(false);
  const [isCitt, setIsCitt] = useState<boolean | null>(false);

  const selectedEmpresaId = form.watch("idEmpresa");
  const selectedTipoDescansoId = form.watch("idTipoDescansoMedico");
  const selectedTipoContingenciaId = form.watch("idTipoContingencia");
  const fechaInicio = form.watch("fechaInicio");
  const fechaFinal = form.watch("fechaFinal");

  const userProfile = useMemo(() => getAuthData()?.usuario, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          listEmpresas,
          listColaboradores,
          listTipoDescansosMedicos,
          listTipoContingencias,
          listAdjuntos,
        ] = await Promise.all([
          loadEmpresas(),
          loadColaboradores(),
          loadTipoDescansosMedicos(),
          loadTipoContingencias(),
          loadAdjuntos(id),
        ]);

        console.log("---- DescansoMedicoDetalle ----");
        console.log({ isModoLectura });
        console.log({ id });

        setEmpresas(listEmpresas);
        setColaboradores(listColaboradores);
        setTipoDescansos(listTipoDescansosMedicos);
        setTipoContingencias(listTipoContingencias);
        setAdjuntos(listAdjuntos);

        if (isModoLectura) {
          setIsEmpresaDisabled(true);
          setIsColaboradorDisabled(true);
        } else {
          const { nombre_perfil_url, id_persona } = userProfile;

          if (
            nombre_perfil_url === EPerfil.ESPECIALISTA_EMPRESA ||
            nombre_perfil_url === EPerfil.COLABORADOR
          ) {
            setIsEmpresaDisabled(true);
          } else {
            setIsEmpresaDisabled(false);
          }

          if (nombre_perfil_url === EPerfil.COLABORADOR && id_persona) {
            setIsColaboradorDisabled(true);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, [form, id, userProfile]);

  useEffect(() => {
    if (selectedTipoDescansoId) {
      let isTipoDescansoCitt = false;

      const tipoSeleccionado = tipoDescansos.find(
        (tipodescanso) => tipodescanso.id === selectedTipoDescansoId,
      );

      if (tipoSeleccionado) {
        const { nombre } = tipoSeleccionado;
        isTipoDescansoCitt = nombre === "CITT" ? true : false;
        setIsCitt(isTipoDescansoCitt);
      }
    }
  });

  useEffect(() => {
    if (selectedEmpresaId) {
      const fetchColaboradores = async () => {
        try {
          const colaboradoresRes = await loadColaboradores(selectedEmpresaId);
          setColaboradores(colaboradoresRes);
        } catch (error) {
          console.error("Error al obtener colaboradores", error);
          showToast("error", "Error al cargar los colaboradores.");
        }
      };

      fetchColaboradores();
    }
  }, [selectedEmpresaId]);

  useEffect(() => {
    const fetchDocumentos = async () => {
      let listDocumentos: DocumentoTipoContingencia[] = [];

      if (selectedTipoContingenciaId) {
        console.log({ selectedTipoContingenciaId });

        try {
          const response = await getDetalleById(selectedTipoContingenciaId);
          console.log("---- response fetchDocumentos ----");
          console.log({ response });

          const { result, data } = response;

          if (result && data) {
            const tipoContingencia = data as Detalle;
            console.log({ tipoContingencia });

            const { documentoTipoCont } = tipoContingencia;

            listDocumentos = documentoTipoCont as DocumentoTipoContingencia[];

            if (isCitt) {
              listDocumentos = listDocumentos.filter(
                (doc) => doc.nombre_url! === "descanso-medico",
              );
            }
          }

          setDocumentosTipoContingencia(listDocumentos);
        } catch (error) {
          console.error("Error al obtener documentos requeridos");
          showToast("error", "Error al cargar documentos requeridos");
          setDocumentosTipoContingencia([]);
        }
      } else {
        setDocumentosTipoContingencia([]);
      }
    };
    fetchDocumentos();
  }, [selectedTipoContingenciaId]);

  useEffect(() => {
    if (fechaInicio && fechaFinal) {
      const dias = differenceInCalendarDays(fechaFinal, fechaInicio) + 1;
      if (dias >= 0) {
        setTotalDias(dias);
        form.setValue("totalDias", dias.toString());
      } else {
        setTotalDias(null);
        form.setValue("totalDias", "");
      }
    }
  }, [fechaInicio, fechaFinal, form]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1 text-xs">
      {/* Empresa */}
      <FormField
        control={form.control}
        name="idEmpresa"
        render={({ field, fieldState }) => (
          <FormItem className="flex flex-col space-y-1">
            {/* <RequiredLabel className="text-xs font-semibold text-gray-700">
              Empresa
            </RequiredLabel> */}
            <SearchableCombobox<Empresa>
              label="Empresa"
              placeholder="Buscar una empresa"
              options={empresas}
              value={field.value}
              onChange={field.onChange}
              displayKey="nombre_o_razon_social"
              valueKey="id"
              searchKeys={["nombre_o_razon_social"]}
              disabled={isEmpresaDisabled}
              isInvalid={fieldState.invalid}
              className="h-8 text-xs"
            />
            <FormMessage className="text-[10px]" />
          </FormItem>
        )}
      />

      {/* Colaborador */}
      <FormField
        control={form.control}
        name="idColaborador"
        render={({ field, fieldState }) => (
          <FormItem className="flex flex-col space-y-1">
            {/* <RequiredLabel className="text-xs font-semibold text-gray-700">
              Colaborador
            </RequiredLabel> */}
            <SearchableCombobox<Persona>
              label="Colaborador"
              placeholder="Buscar un colaborador"
              options={colaboradores}
              value={field.value}
              onChange={(value) => field.onChange(value || "")}
              displayKey="nombre_completo"
              valueKey="id"
              searchKeys={["nombre_completo"]}
              disabled={isColaboradorDisabled || isModoLectura}
              isInvalid={fieldState.invalid}
              // errorMessage={fieldState.error?.message}
              className="h-8 text-xs"
            />
            <FormMessage className="text-[10px]" />
          </FormItem>
        )}
      />

      {/* Tipo de descanso médico */}
      <FormField
        control={form.control}
        name="idTipoDescansoMedico"
        render={({ field, fieldState }) => (
          <FormItem className="w-full space-y-1">
            <RequiredLabel className="text-xs font-semibold text-gray-700">
              Tipo de descanso médico
            </RequiredLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""}
              disabled={isModoLectura}
            >
              <FormControl>
                <SelectTrigger
                  className={`w-full h-8 text-xs ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } focus:ring-1 transition-all duration-200 cursor-pointer`}
                >
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white text-xs">
                {tipoDescansos.map((td) => (
                  <SelectItem
                    key={td.id}
                    value={td.id}
                    className="cursor-pointer hover:bg-gray-100 py-1 text-xs"
                  >
                    {td.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )}
      />

      {/* Código CITT */}
      {isCitt && (
        <FormField
          control={form.control}
          name="codigoCitt"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-1">
              <RequiredLabel className="text-xs font-semibold text-gray-700">
                Código CITT
              </RequiredLabel>
              <FormControl>
                <Input
                  placeholder="0253523"
                  maxLength={30}
                  autoComplete="off"
                  {...field}
                  className={`h-8 text-xs ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } transition-all duration-200`}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
      )}

      {/* Tipo de Contingencia */}
      <FormField
        control={form.control}
        name="idTipoContingencia"
        render={({ field, fieldState }) => (
          <FormItem className="w-full space-y-1">
            <RequiredLabel className="text-xs font-semibold text-gray-700">
              Tipo de Contingencia
            </RequiredLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""}
              disabled={isModoLectura}
            >
              <FormControl>
                <SelectTrigger
                  className={`w-full h-8 text-xs ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } focus:ring-1 transition-all duration-200 cursor-pointer`}
                >
                  <SelectValue placeholder="Seleccionar contingencia" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white text-xs">
                {tipoContingencias.map((tc) => (
                  <SelectItem
                    key={tc.id}
                    value={tc.id}
                    className="cursor-pointer hover:bg-gray-100 py-1 text-xs"
                  >
                    {tc.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )}
      />

      {/* Componente de Documentos adjuntos con validaciones */}
      {documentosTipoContingencia.length > 0 && (
        <div className="col-span-1 md:col-span-2">
          <Documentos
            documentos={documentosTipoContingencia}
            form={form}
            adjuntosExistentes={adjuntos}
            isModoLectura={isModoLectura}
            idDescanso={id}
            maxFileSizeMb={MAX_FILE_SIZE_MB}
          />
        </div>
      )}

      {/* Fechas y Cálculo de Días */}
      <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-3 pt-1 border-t border-gray-100">
        <FormField
          control={form.control}
          name="fechaOtorgamiento"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-1">
              <RequiredLabel className="text-xs font-semibold text-gray-700">
                F. Otorgamiento
              </RequiredLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                  disabled={isModoLectura}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseISO(e.target.value) : null,
                    )
                  }
                  className={`h-8 text-xs ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } transition-all duration-200`}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fechaInicio"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-1">
              <RequiredLabel className="text-xs font-semibold text-gray-700">
                Fecha Inicio
              </RequiredLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                  disabled={isModoLectura}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseISO(e.target.value) : null,
                    )
                  }
                  className={`h-8 text-xs ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } transition-all duration-200`}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fechaFinal"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-1">
              <RequiredLabel className="text-xs font-semibold text-gray-700">
                Fecha Final
              </RequiredLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                  disabled={isModoLectura}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseISO(e.target.value) : null,
                    )
                  }
                  className={`h-8 text-xs ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } transition-all duration-200`}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalDias"
          render={({ fieldState }) => (
            <FormItem className="space-y-1">
              <RequiredLabel className="text-xs font-semibold text-gray-700">
                Total Días
              </RequiredLabel>
              <FormControl>
                <Input
                  readOnly
                  value={totalDias !== null ? totalDias.toString() : ""}
                  disabled={isModoLectura}
                  className={`h-8 text-xs bg-gray-50 font-medium ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } transition-all duration-200`}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
