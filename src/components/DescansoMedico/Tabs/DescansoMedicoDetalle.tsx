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
// import {
//   Colaborador,
//   ColaboradorResponse,
// } from "../../../interfaces/IColaborador";
import { Persona, PersonaResponse } from "../../../interfaces/IPersona";
// import {
//   getColaboradores,
//   getColaboradoresByIdEmpresa,
// } from "../../../services/colaboradorService";
import {
  getPersonas,
  getPersonasByEmpresaWithGrupo,
  // getPersonasByEmpresa,
} from "../../../services/personaService";
import { Detalle } from "../../../interfaces/IDetalleParametro";
import {
  getDetalleById,
  getDetalles,
} from "../../../services/detalleParametroService";
// import { TipoDescansoMedico } from "../../../interfaces/ITipoDescansoMedico";
// import { getTipoDescansosMedicos } from "../../../services/tipoDescansoMedicoService";
// import { TipoContingencia } from "../../../interfaces/ITipoContingencia";
import { DocumentoTipoContingencia } from "../../../interfaces/IDocumentoTipoContingencia";
// import {
//   getTipoContingencias,
//   getTipoContingenciaById,
// } from "../../../services/tipoContingenciaService";
import { Input } from "../../../components/ui/input";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";
import { useParams } from "react-router-dom";
import { formSchema } from "../DescansoMedicoForm";
import Documentos from "../../../components/TipoContingencia/Documentos";
import { getAuthData } from "../../../utils/authMemo";
import { Adjunto } from "../../../interfaces/IAdjunto";
import { DescansoMedico } from "../../../interfaces/IDescansoMedico";
import { getDescansoById } from "@/services/descansoMedicoService";

interface DescansoMedicoDetalleProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  isModeLetter?: boolean;
}

const dataEmpresas = async () => {
  let empresas: Empresa[] = [];
  const response = await getEmpresas();
  const { result, data } = response;
  if (result && data) {
    empresas = data as Empresa[];
  }
  return empresas;
};

const dataColaboradores = async (idEmpresa: string | null = null) => {
  let colaboradores: Persona[] = [];
  let response: PersonaResponse;
  const nombreGrupo: string = "GRUPO COLABORADOR";

  if (idEmpresa) {
    // response = await getPersonasByEmpresa(idEmpresa);
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
};

const dataTipoDescansosMedicos = async () => {
  let tipoDescansos: Detalle[] = [];
  const claseTDM: number = 1003;
  const estadoTDM: boolean = true;

  const response = await getDetalles(claseTDM, estadoTDM);

  const { result, data } = response;

  if (result && data) {
    tipoDescansos = data as Detalle[];
  }

  return tipoDescansos;
};

const dataAdjuntos = async (idDescansoMedico: string) => {
  let adjuntos: Adjunto[] = [];
  if (idDescansoMedico) {
    const responseDescanso = await getDescansoById(idDescansoMedico);
    const { result, data } = responseDescanso;

    if (result && data) {
      const descanso = data as DescansoMedico;
      adjuntos = descanso.adjuntos as Adjunto[];
    }
  }
  return adjuntos;
};

const dataTipoContingencias = async () => {
  let tipoContingencias: Detalle[] = [];

  const claseTC: number = 1004;
  const estadoTC: boolean = true;

  const response = await getDetalles(claseTC, estadoTC);

  const { result, data } = response;

  if (result && data) {
    tipoContingencias = data as Detalle[];
  }

  return tipoContingencias;
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
  // const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isCitt, setIsCitt] = useState<boolean | null>(false);

  // Id de la empresa seleccionada
  const selectedEmpresaId = form.watch("idEmpresa");

  // Lógica para determinar si los campos dependientes deben estar deshabilitados.
  // Serán deshabilitados si NO hay un idEmpresa seleccionado O si estamos en modo "carta" (isModeLetter)
  // const isDependentFieldsDisabled = isModeLetter || !selectedEmpresaId;

  // Id del tipo de descanso
  const selectedTipoDescansoId = form.watch("idTipoDescansoMedico");

  // Id del tipo de contingencia seleccionado
  const selectedTipoContingenciaId = form.watch("idTipoContingencia");

  // Calcular el total de días cuando la fecha de inicio y final cambian
  const fechaInicio = form.watch("fechaInicio");
  const fechaFinal = form.watch("fechaFinal");

  const userProfile = useMemo(() => getAuthData()?.usuario, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          empresasRes,
          colaboradoresRes,
          tipoDescansosRes,
          tipoContingenciasRes,
          adjuntosRes,
        ] = await Promise.all([
          dataEmpresas(),
          dataColaboradores(),
          dataTipoDescansosMedicos(),
          dataTipoContingencias(),
          dataAdjuntos(id),
        ]);

        setEmpresas(empresasRes);
        setColaboradores(colaboradoresRes);
        setTipoDescansos(tipoDescansosRes);
        setTipoContingencias(tipoContingenciasRes);
        setAdjuntos(adjuntosRes);

        if (userProfile.id_empresa && userProfile.id_colaborador) {
          // console.log("abcdef");
          // setIsFormDisabled(true);
          setIsDisabled(true);
        } else {
          // console.log("pqrstu");
          const isDisabledIdEmpresaIdColaborador = isModeLetter
            ? isModeLetter
            : false;
          setIsDisabled(isDisabledIdEmpresaIdColaborador);
          // setIsFormDisabled(isDisabledIdEmpresaIdColaborador);
        }
        // console.log({ isModeLetter });
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, [form, id, userProfile]);
  // [form, showToast, userProfile]

  useEffect(() => {
    // console.log({ selectedTipoDescansoId });

    if (selectedTipoDescansoId) {
      let isTipoDescansoCitt = false;

      const tipoSeleccionado = tipoDescansos.find(
        (tipodescanso) => tipodescanso.id === selectedTipoDescansoId,
      );

      // console.log({ tipoSeleccionado });

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
          const colaboradoresRes = await dataColaboradores(selectedEmpresaId);
          setColaboradores(colaboradoresRes);
        } catch (error) {
          console.error("Error al obtener colaboradores", error);
          showToast("error", "Error al cargar los colaboradores.");
        }
      };

      fetchColaboradores();
    }
  }, [selectedEmpresaId]);
  // [selectedEmpresaId, form, showToast, userProfile]

  useEffect(() => {
    const fetchDocumentos = async () => {
      let listDocumentos: DocumentoTipoContingencia[] = [];

      if (selectedTipoContingenciaId) {
        console.log({ selectedTipoContingenciaId });
        try {
          // const response = await getTipoContingenciaById(
          //   selectedTipoContingenciaId
          // );

          const response = await getDetalleById(selectedTipoContingenciaId);
          console.log("---- response fetchDocumentos ----");
          console.log({ response });

          const { result, data } = response;

          if (result && data) {
            // const tipoContingencia = data as TipoContingencia;
            const tipoContingencia = data as Detalle;
            console.log({ tipoContingencia });

            const { documentoTipoCont } = tipoContingencia;

            listDocumentos = documentoTipoCont as DocumentoTipoContingencia[];

            // console.log(listDocumentos);

            // console.log({ isCitt });

            // Filtrar los documentos para el caso tipoDescansoMedico igual a CITT
            if (isCitt) {
              // console.log("isCitt true");
              listDocumentos = listDocumentos.filter(
                (doc) => doc.nombre_url! === "descanso-medico",
              );
              // console.log("listDocumentos filtered");
              // console.log({ listDocumentos });
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
  // [selectedTipoContingenciaId, showToast]

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
    // <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                // disabled={isFormDisabled || isModeLetter}
                disabled={isDisabled}
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
                disabled={isDisabled}
                // disabled={isDependentFieldsDisabled}
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
          <FormItem>
            <RequiredLabel>Tipo de descanso médico</RequiredLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""}
              // disabled={isDependentFieldsDisabled}
              disabled={isModeLetter}
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
                  <SelectValue placeholder="Seleccionar tipo de descanso médico" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-gray-400">
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
          <FormItem>
            <RequiredLabel>Tipo de Contingencia</RequiredLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""}
              // disabled={isDependentFieldsDisabled}
              disabled={isModeLetter}
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
                  <SelectValue placeholder="Seleccionar tipo de contingencia" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-gray-400">
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
