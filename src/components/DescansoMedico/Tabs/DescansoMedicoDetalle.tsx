import { useEffect, useMemo, useState } from "react";
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
import { DocumentoTipoContingencia } from "@/interfaces/IDocumentoTipoContingencia";
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

interface UserData {
  id_colaborador: string;
  id_empresa: string;
  nombre_completo: string;
  nombre_perfil: string;
  slug_perfil: string;
}

interface AuthData {
  usuario: UserData;
}

export const DescansoMedicoDetalle = ({ form }: DescansoMedicoDetalleProps) => {
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

  const [totalDias, setTotalDias] = useState<number | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  // Id de la empresa seleccionada
  const selectedEmpresaId = form.watch("idEmpresa");

  // Id del colaborador seleccionado
  const selectedColaboradorId = form.watch("idColaborador");

  // Id del tipo de contingencia seleccionado
  const selectedTipoContingenciaId = form.watch("idTipoContingencia");

  // Calcular el total de días cuando la fecha de inicio y final cambian
  const fechaInicio = form.watch("fechaInicio");
  const fechaFinal = form.watch("fechaFinal");

  const authData = useMemo(() => {
    try {
      const auth = localStorage.getItem("auth");
      return auth ? (JSON.parse(auth) as AuthData) : null;
    } catch (e) {
      console.error("Failed to parse auth data from localStorage", e);
      return null;
    }
  }, []);

  const userProfile = authData?.usuario;

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

        if (userProfile?.id_empresa && userProfile?.id_colaborador) {
          form.setValue("idEmpresa", userProfile.id_empresa);
          form.setValue("idColaborador", userProfile.id_colaborador);
          setIsDisabled(true); // Deshabilita los campos si hay datos de perfil
        }
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, [form, showToast, userProfile]);

  useEffect(() => {
    if (selectedEmpresaId) {
      const fetchColaboradores = async () => {
        try {
          const colaboradoresRes = await dataColaboradores(selectedEmpresaId);
          setColaboradores(colaboradoresRes);
          // form.setValue("idColaborador", "");
          // Solo si no estamos en un perfil de usuario, reseteamos el valor
          if (!userProfile?.id_empresa) {
            form.setValue("idColaborador", "");
          }
        } catch (error) {
          console.error("Error al obtener colaboradores", error);
          showToast("error", "Error al cargar los colaboradores.");
        }
      };

      fetchColaboradores();
    }
  }, [selectedEmpresaId, form, showToast, userProfile]);

  useEffect(() => {
    const fetchDocumentos = async () => {
      let listDocumentos: DocumentoTipoContingencia[] = [];

      if (selectedTipoContingenciaId) {
        try {
          const response = await getTipoContingenciaById(
            selectedTipoContingenciaId
          );

          console.log("response documentos", response);

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
        render={({ field, fieldState }) => (
          <FormItem>
            <RequiredLabel>Empresa</RequiredLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""}
              // disabled={isDisabled}
            >
              <FormControl>
                <SelectTrigger
                  className={fieldState.invalid ? "border-red-500" : ""}
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
        name="idColaborador"
        render={({ field, fieldState }) => {
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
                // disabled={isDisabled}
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
        render={({ field, fieldState }) => (
          <FormItem>
            <RequiredLabel>Tipo de descanso médico</RequiredLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger
                  className={fieldState.invalid ? "border-red-500" : ""}
                >
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
        render={({ field, fieldState }) => (
          <FormItem>
            <RequiredLabel>Tipo de Contingencia</RequiredLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger
                  className={fieldState.invalid ? "border-red-500" : ""}
                >
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
          render={({ field, fieldState }) => (
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
                  className={fieldState.invalid ? "border-red-500" : ""}
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
          render={({ field, fieldState }) => (
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
                  className={fieldState.invalid ? "border-red-500" : ""}
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
          render={({ field, fieldState }) => (
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
                  className={fieldState.invalid ? "border-red-500" : ""}
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
          render={({ fieldState }) => (
            <FormItem>
              <RequiredLabel>Número de Días</RequiredLabel>
              <FormControl>
                <Input
                  readOnly
                  value={totalDias !== null ? totalDias.toString() : ""}
                  className={`bg-gray-100 ${
                    fieldState.invalid ? "border-red-500" : ""
                  }`}
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
