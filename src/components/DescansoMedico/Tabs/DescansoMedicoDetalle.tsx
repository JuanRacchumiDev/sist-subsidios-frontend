import { useEffect, useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RequiredLabel } from "@/components/Common/RequiredLabel";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { useToast } from "../../../context/ToastContext";
import { Empresa } from "@/interfaces/IEmpresa";
import { getEmpresas } from "@/services/empresaService";
import SearchableCombobox from "@/components/Common/SearchableCombobox";
import { Colaborador, ColaboradorResponse } from "@/interfaces/IColaborador";
import {
  getColaboradores,
  getColaboradoresByIdEmpresa,
} from "@/services/colaboradorService";
import { TipoDescansoMedico } from "@/interfaces/ITipoDescansoMedico";
import { getTipoDescansosMedicos } from "@/services/tipoDescansoMedicoService";
import { TipoContingencia } from "@/interfaces/ITipoContingencia";
import { DocumentoContingencia } from "@/interfaces/IDocumentoContingencia";
import {
  getTipoContingencias,
  getTipoContingenciaById,
} from "@/services/tipoContingenciaService";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "../DescansoMedicoForm";
import Documentos from "@/components/TipoContingencia/Documentos";

interface DescansoMedicoDetalleProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
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

const dataTipoContingencias = async () => {
  let tipoContingencias: TipoContingencia[] = [];
  const response = await getTipoContingencias();
  const { result, data } = response;
  if (result && data) {
    tipoContingencias = data as TipoContingencia[];
  }
  return tipoContingencias;
};

export const DescansoMedicoDetalle = ({ form }: DescansoMedicoDetalleProps) => {
  const { showToast } = useToast();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [tipoDescansos, setTipoDescansos] = useState<TipoDescansoMedico[]>([]);
  const [tipoContingencias, setTipoContingencias] = useState<
    TipoContingencia[]
  >([]);
  const [documentosTipoContingencia, setDocumentosTipoContingencia] = useState<
    DocumentoContingencia[]
  >([]);

  const [totalDias, setTotalDias] = useState<number | null>(null);

  // Id de la empresa seleccionada
  const selectedEmpresaId = form.watch("idEmpresa");

  // Id del colaborador seleccionado
  const selectedColaboradorId = form.watch("idColaborador");

  // Id del tipo de contingencia seleccionado
  const selectedTipoContingenciaId = form.watch("idTipoContingencia");

  // Calcular el total de días cuando la fecha de inicio y final cambian
  const fechaInicio = form.watch("fechaInicio");
  const fechaFinal = form.watch("fechaFinal");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          empresasRes,
          colaboradoresRes,
          tipoDescansosRes,
          tipoContingenciasRes,
        ] = await Promise.all([
          dataEmpresas(),
          dataColaboradores(),
          dataTipoDescansosMedicos(),
          dataTipoContingencias(),
        ]);

        setEmpresas(empresasRes);
        setColaboradores(colaboradoresRes);
        setTipoDescansos(tipoDescansosRes);
        setTipoContingencias(tipoContingenciasRes);
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, [showToast]);

  useEffect(() => {
    if (selectedEmpresaId) {
      const fetchColaboradores = async () => {
        try {
          const colaboradoresRes = await dataColaboradores(selectedEmpresaId);
          setColaboradores(colaboradoresRes);
          form.setValue("idColaborador", "");
        } catch (error) {
          console.error("Error al obtener colaboradores", error);
          showToast("error", "Error al cargar los colaboradores.");
        }
      };

      fetchColaboradores();
    }
  }, [selectedEmpresaId, form, showToast]);

  useEffect(() => {
    const fetchDocumentos = async () => {
      let listDocumentos: DocumentoContingencia[] = [];

      if (selectedTipoContingenciaId) {
        try {
          const response = await getTipoContingenciaById(
            selectedTipoContingenciaId
          );

          const { result, data } = response;

          if (result && data) {
            const tipoContingencia = data as TipoContingencia;
            const { documentos } = tipoContingencia;
            listDocumentos = documentos as DocumentoContingencia[];
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
  }, [selectedTipoContingenciaId, showToast]);

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
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="idEmpresa"
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Empresa</RequiredLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger>
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
        name="idColaborador"
        render={({ field }) => {
          const selectedColaborador = colaboradores.find(
            (c) => c.id === field.value
          );

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
              />
              {selectedColaborador && (
                <FormDescription>
                  Colaborador seleccionado:{" "}
                  <b>{selectedColaborador.nombre_completo}</b>
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="idTipoDescansoMedico"
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Tipo de descanso médico</RequiredLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de descanso médico" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tipoDescansos.map((td) => (
                  <SelectItem key={td.id} value={td.id}>
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
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Tipo de Contingencia</RequiredLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de contingencia" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tipoContingencias.map((tc) => (
                  <SelectItem key={tc.id} value={tc.id}>
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
        <Documentos documentos={documentosTipoContingencia} form={form} />
      )}

      <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6">
        <FormField
          control={form.control}
          name="fechaOtorgamiento"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Fecha de Otorgamiento</RequiredLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseISO(e.target.value) : null
                    )
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
          name="fechaInicio"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Fecha de Inicio</RequiredLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseISO(e.target.value) : null
                    )
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
          name="fechaFinal"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Fecha final</RequiredLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseISO(e.target.value) : null
                    )
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
          name="totalDias"
          render={() => (
            <FormItem>
              <RequiredLabel>Número de Días</RequiredLabel>
              <FormControl>
                <Input
                  readOnly
                  value={totalDias !== null ? totalDias.toString() : ""}
                  className="bg-gray-100"
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
