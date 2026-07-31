import { useEffect, useMemo, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
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
import { getEmpresas } from "../../../services/empresaService";
import SearchableCombobox from "../../../components/Common/SearchableCombobox";
import { Persona, PersonaResponse } from "../../../interfaces/IPersona";
import {
  getPersonas,
  getPersonasByEmpresaWithGrupo,
} from "../../../services/personaService";
import { Detalle } from "../../../interfaces/IDetalleParametro";
import {
  getDetalleById,
  getDetalles,
} from "../../../services/detalleParametroService";
import { DocumentoTipoContingencia } from "../../../interfaces/IDocumentoTipoContingencia";
import { Input } from "../../../components/ui/input";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";
import { useParams } from "react-router-dom";
import { formSchema } from "../DescansoMedicoForm";
import Documentos from "../../../components/TipoContingencia/Documentos";
import { getAuthData } from "../../../utils/authMemo";
import { Adjunto } from "../../../interfaces/IAdjunto";
import { DescansoMedico } from "../../../interfaces/IDescansoMedico";
import { getDescansoById } from "../../../services/descansoMedicoService";
import { ParametroClase } from "../../../constants/parametroClase";

interface DescansoMedicoDetalleProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  isModeLetter?: boolean;
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
  isModeLetter = false,
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
        console.log({ isModeLetter });
        console.log({ id });

        setEmpresas(listEmpresas);
        setColaboradores(listColaboradores);
        setTipoDescansos(listTipoDescansosMedicos);
        setTipoContingencias(listTipoContingencias);
        setAdjuntos(listAdjuntos);

        if (isModeLetter) {
          setIsEmpresaDisabled(true);
          setIsColaboradorDisabled(true);
        } else {
          const { nombre_perfil_url, id_persona } = userProfile;

          if (
            nombre_perfil_url === "especialista-empresa" ||
            nombre_perfil_url === "colaborador"
          ) {
            setIsEmpresaDisabled(true);
          } else {
            setIsEmpresaDisabled(false);
          }

          if (nombre_perfil_url === "colaborador" && id_persona) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="idEmpresa"
        render={({ field, fieldState }) => {
          return (
            <FormItem className="flex flex-col">
              <RequiredLabel>Empresa</RequiredLabel>
              <SearchableCombobox<Empresa>
                placeholder="Buscar una empresa"
                options={empresas}
                value={field.value}
                onChange={field.onChange}
                displayKey="nombre_o_razon_social"
                valueKey="id"
                searchKeys={["nombre_o_razon_social"]}
                disabled={isEmpresaDisabled}
                isInvalid={fieldState.invalid}
              />
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="idColaborador"
        render={({ field, fieldState }) => {
          return (
            <FormItem className="flex flex-col">
              <RequiredLabel>Colaborador</RequiredLabel>
              <SearchableCombobox<Persona>
                placeholder="Buscar un colaborador"
                options={colaboradores}
                value={field.value}
                onChange={field.onChange}
                displayKey="nombre_completo"
                valueKey="id"
                searchKeys={["nombre_completo"]}
                disabled={isColaboradorDisabled}
                isInvalid={fieldState.invalid}
              />
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="idTipoDescansoMedico"
        render={({ field, fieldState }) => (
          <FormItem className="w-full">
            <RequiredLabel>Tipo de descanso médico</RequiredLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""}
              disabled={isModeLetter}
            >
              <FormControl>
                <SelectTrigger
                  className={`w-full ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } focus:ring-2 focus:ring-offset-2 transition-all duration-300 cursor-pointer `}
                >
                  <SelectValue placeholder="Seleccionar tipo de descanso médico" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {tipoDescansos.map((td) => (
                  <SelectItem
                    key={td.id}
                    value={td.id}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {td.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {isCitt && (
        <FormField
          control={form.control}
          name="codigoCitt"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel>Código CITT</RequiredLabel>
              <FormControl>
                <Input
                  placeholder="0253523"
                  maxLength={30}
                  autoComplete="off"
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
      )}

      <FormField
        control={form.control}
        name="idTipoContingencia"
        render={({ field, fieldState }) => (
          <FormItem className="w-full">
            <RequiredLabel>Tipo de Contingencia</RequiredLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""}
              disabled={isModeLetter}
            >
              <FormControl>
                <SelectTrigger
                  className={`w-full ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } focus:ring-2 focus:ring-offset-2 transition-all duration-300 cursor-pointer `}
                >
                  <SelectValue placeholder="Seleccionar tipo de contingencia" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {tipoContingencias.map((tc) => (
                  <SelectItem
                    key={tc.id}
                    value={tc.id}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {tc.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {documentosTipoContingencia.length > 0 && (
        <Documentos
          documentos={documentosTipoContingencia}
          form={form}
          adjuntosExistentes={adjuntos}
          isModeLetter={isModeLetter}
          idDescanso={id}
        />
      )}

      <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6">
        <FormField
          control={form.control}
          name="fechaOtorgamiento"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel>Fecha de Otorgamiento</RequiredLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                  disabled={isModeLetter}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseISO(e.target.value) : null,
                    )
                  }
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
          name="fechaInicio"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel>Fecha de Inicio</RequiredLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                  disabled={isModeLetter}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseISO(e.target.value) : null,
                    )
                  }
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
          name="fechaFinal"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel>Fecha final</RequiredLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                  disabled={isModeLetter}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseISO(e.target.value) : null,
                    )
                  }
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
          name="totalDias"
          render={({ fieldState }) => (
            <FormItem>
              <RequiredLabel>Número de Días</RequiredLabel>
              <FormControl>
                <Input
                  readOnly
                  value={totalDias !== null ? totalDias.toString() : ""}
                  disabled={isModeLetter}
                  className={`
                    ${
                      fieldState.invalid
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500"
                    }
                      transition-all duration-300
                  `}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
