import { useEffect, useMemo, useState } from "react";
import {
  FormControl,
  FormDescription,
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
import {
  Colaborador,
  ColaboradorResponse,
} from "../../../interfaces/IColaborador";
import {
  getColaboradores,
  getColaboradoresByIdEmpresa,
} from "../../../services/colaboradorService";
import { TipoDescansoMedico } from "../../../interfaces/ITipoDescansoMedico";
import { getTipoDescansosMedicos } from "../../../services/tipoDescansoMedicoService";
import { TipoContingencia } from "../../../interfaces/ITipoContingencia";
import { DocumentoTipoContingencia } from "../../../interfaces/IDocumentoTipoContingencia";
import {
  getTipoContingencias,
  getTipoContingenciaById,
} from "../../../services/tipoContingenciaService";
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
  let colaboradores: Colaborador[] = [];
  let response: ColaboradorResponse;
  if (idEmpresa) {
    response = await getColaboradoresByIdEmpresa(idEmpresa);
  } else {
    response = await getColaboradores();
  }
  const { result, data } = response;
  if (result && data) {
    colaboradores = data as Colaborador[];
  }
  return colaboradores;
};

const dataTipoDescansosMedicos = async () => {
  let tipoDescansos: TipoDescansoMedico[] = [];
  const response = await getTipoDescansosMedicos();
  const { result, data } = response;
  if (result && data) {
    tipoDescansos = data as TipoDescansoMedico[];
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
  let tipoContingencias: TipoContingencia[] = [];
  const response = await getTipoContingencias();
  const { result, data } = response;
  if (result && data) {
    tipoContingencias = data as TipoContingencia[];
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
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [tipoDescansos, setTipoDescansos] = useState<TipoDescansoMedico[]>([]);
  const [tipoContingencias, setTipoContingencias] = useState<
    TipoContingencia[]
  >([]);
  const [documentosTipoContingencia, setDocumentosTipoContingencia] = useState<
    DocumentoTipoContingencia[]
  >([]);
  const [adjuntos, setAdjuntos] = useState<Adjunto[]>([]);

  const [totalDias, setTotalDias] = useState<number | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  // Id de la empresa seleccionada
  const selectedEmpresaId = form.watch("idEmpresa");

  // Id del colaborador seleccionado
  // const selectedColaboradorId = form.watch("idColaborador");

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

        // Lógica para preseleccionar la empresa y el colaborador
        // if (userProfile?.id_empresa && userProfile?.id_colaborador) {
        //   console.log("existe id_empresa, id_colaborador");
        //   form.setValue("idEmpresa", userProfile.id_empresa);
        //   // Actualiza el listado de colaboradores para la empresa seleccionada
        //   const colaboradoresEmpresa = await dataColaboradores(
        //     userProfile.id_empresa
        //   );
        //   setColaboradores(colaboradoresEmpresa);
        //   form.setValue("idColaborador", userProfile.id_colaborador);
        //   setIsDisabled(true);
        // } else {
        //   console.log("no existe id_empresa, id_colaborador");
        //   setIsDisabled(false);
        // }

        // console.log("userprofile in descansomedicodetalle", userProfile);

        // const { id_empresa, id_colaborador } = userProfile;

        // if (id_empresa && id_colaborador) {
        //   form.setValue("idEmpresa", id_empresa);
        //   form.setValue("idColaborador", id_colaborador);
        //   setIsDisabled(true);
        // }

        // if (userProfile?.id_empresa && userProfile?.id_colaborador) {
        //   form.setValue("idEmpresa", userProfile.id_empresa);
        //   form.setValue("idColaborador", userProfile.id_colaborador);
        //   setIsDisabled(true); // Deshabilita los campos si hay datos de perfil
        // }
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, [form, id, userProfile]);
  // [form, showToast, userProfile]

  useEffect(() => {
    if (selectedEmpresaId) {
      const fetchColaboradores = async () => {
        try {
          const colaboradoresRes = await dataColaboradores(selectedEmpresaId);
          setColaboradores(colaboradoresRes);
          // form.setValue("idColaborador", "");

          // Solo si no estamos en un perfil de usuario, reseteamos el valor
          // if (!userProfile?.id_empresa) {
          //   form.setValue("idColaborador", "");
          // }
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
        try {
          const response = await getTipoContingenciaById(
            selectedTipoContingenciaId
          );

          const { result, data } = response;

          if (result && data) {
            const tipoContingencia = data as TipoContingencia;
            const { documentoTipoCont } = tipoContingencia;
            listDocumentos = documentoTipoCont as DocumentoTipoContingencia[];
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
          // const selectedColaborador = colaboradores.find(
          //   (c) => c.id === field.value
          // );

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
                // disabled={isModeLetter}
              />
              {/* {selectedColaborador && (
                <FormDescription>
                  Colaborador seleccionado:{" "}
                  <b>{selectedColaborador.nombre_completo}</b>
                </FormDescription>
              )} */}
              <FormMessage />
            </FormItem>
          );
        }}
      />

      {/* <FormField
        control={form.control}
        name="idEmpresa"
        render={({ field, fieldState }) => (
          <FormItem>
            <RequiredLabel>Empresa</RequiredLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""}
              // disabled={isModeLetter}
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
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-gray-400">
                {empresas.map((empresa) => (
                  <SelectItem
                    value={empresa.id}
                    key={empresa.id}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {empresa.nombre_o_razon_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      /> */}

      <FormField
        control={form.control}
        name="idColaborador"
        render={({ field, fieldState }) => {
          // const selectedColaborador = colaboradores.find(
          //   (c) => c.id === field.value
          // );

          return (
            <FormItem className="flex flex-col">
              <RequiredLabel>Colaborador</RequiredLabel>
              <SearchableCombobox<Colaborador>
                placeholder="Buscar un colaborador"
                options={colaboradores}
                value={field.value}
                onChange={field.onChange}
                displayKey="nombre_completo"
                valueKey="id"
                searchKeys={["nombre_completo"]}
                // disabled={isModeLetter}
              />
              {/* {selectedColaborador && (
                <FormDescription>
                  Colaborador seleccionado:{" "}
                  <b>{selectedColaborador.nombre_completo}</b>
                </FormDescription>
              )} */}
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

      <FormField
        control={form.control}
        name="idTipoContingencia"
        render={({ field, fieldState }) => (
          <FormItem>
            <RequiredLabel>Tipo de Contingencia</RequiredLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""}
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
                      e.target.value ? parseISO(e.target.value) : null
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
              {/* <FormDescription>
                {field.value
                  ? format(field.value, "PPP")
                  : "Seleccione una fecha"}
              </FormDescription> */}
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
                      e.target.value ? parseISO(e.target.value) : null
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
              {/* <FormDescription>
                {field.value
                  ? format(field.value, "PPP")
                  : "Seleccione una fecha"}
              </FormDescription> */}
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
                      e.target.value ? parseISO(e.target.value) : null
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
              {/* <FormDescription>
                {field.value
                  ? format(field.value, "PPP")
                  : "Seleccione una fecha"}
              </FormDescription> */}
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
