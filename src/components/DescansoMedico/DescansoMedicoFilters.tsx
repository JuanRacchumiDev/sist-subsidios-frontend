import React, { useEffect, useState } from "react";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { getDetalles } from "../../services/detalleParametroService";
import { ParametroClase } from "../../constants/parametroClase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../../context/ToastContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Filter, RotateCcw } from "lucide-react";

interface DescansoMedicoFilterProps {
  onSearch: (filters: DescansoMedicoFiltersData) => void;
}

const loadTiposDescansoMedico = async (): Promise<Detalle[]> => {
  let tiposDescansoMedico: Detalle[] = [];

  try {
    const estado: boolean = true;
    const response = await getDetalles(
      ParametroClase.TIPO_DESCANSO_MEDICO,
      estado,
    );

    const { result, data } = response;
    if (result && data) {
      tiposDescansoMedico = data as Detalle[];
    }

    return tiposDescansoMedico;
  } catch (error) {
    console.error("Error al obtener descansos médicos", error);
    return [];
  }
};

const loadTiposContingencia = async (): Promise<Detalle[]> => {
  let tiposContingencia: Detalle[] = [];

  try {
    const estado: boolean = true;
    const response = await getDetalles(
      ParametroClase.TIPO_CONTINGENCIA,
      estado,
    );

    const { result, data } = response;
    if (result && data) {
      tiposContingencia = data as Detalle[];
    }

    return tiposContingencia;
  } catch (error) {
    console.error("Error al obtener tipos de contingencia", error);
    return [];
  }
};

export interface DescansoMedicoFiltersData {
  id_tipodescansomedico: string;
  id_tipocontingencia: string;
  search: string;
  fecha_inicio: string;
  fecha_final: string;
}

export const DescansoMedicoFilters: React.FC<DescansoMedicoFilterProps> = ({
  onSearch,
}) => {
  const { showToast } = useToast();

  const [tipoDescansosMedicos, setTipoDescansosMedicos] = useState<Detalle[]>(
    [],
  );
  const [tipoContingencias, setTipoContingencias] = useState<Detalle[]>([]);

  const [filters, setFilters] = useState<DescansoMedicoFiltersData>({
    id_tipodescansomedico: "all",
    id_tipocontingencia: "all",
    search: "",
    fecha_inicio: "",
    fecha_final: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    key: keyof DescansoMedicoFiltersData,
    value: string,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanFilters = {
      ...filters,
      id_tipodescansomedico:
        filters.id_tipodescansomedico === "all"
          ? ""
          : filters.id_tipodescansomedico,
      id_tipocontingencia:
        filters.id_tipocontingencia === "all"
          ? ""
          : filters.id_tipocontingencia,
    };
    onSearch(cleanFilters);
  };

  const handleReset = () => {
    const resetValues = {
      id_tipodescansomedico: "all",
      id_tipocontingencia: "all",
      search: "",
      fecha_inicio: "",
      fecha_final: "",
    };
    setFilters(resetValues);

    const cleanResetValues = {
      id_tipodescansomedico: "",
      id_tipocontingencia: "",
      search: "",
      fecha_inicio: "",
      fecha_final: "",
    };
    onSearch(cleanResetValues);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listDescansosMedicos, listTipoContingencias] = await Promise.all(
          [loadTiposDescansoMedico(), loadTiposContingencia()],
        );

        setTipoDescansosMedicos(listDescansosMedicos);
        setTipoContingencias(listTipoContingencias);
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, []);

  return (
    <form
      onSubmit={handleSearch}
      className="p-4 bg-slate-50 border-b border-slate-200 w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Select: Tipo contingencia (2 cols) */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 tracking-wider flex items-center gap-1">
            Tipo contingencia
          </label>
          <Select
            value={filters.id_tipocontingencia}
            onValueChange={(val) =>
              handleSelectChange("id_tipocontingencia", val)
            }
          >
            <SelectTrigger className="bg-white border-slate-200 w-full focus:ring-1 focus:ring-slate-400">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-lg z-50 max-h-60 overflow-y-auto rounded-md">
              <SelectItem
                value="all"
                className="cursor-pointer hover:bg-slate-100"
              >
                Todos los tipos
              </SelectItem>
              {tipoContingencias.map((tipoContingencia) => (
                <SelectItem
                  key={tipoContingencia.id}
                  value={tipoContingencia.id || ""}
                  className="cursor-pointer hover:bg-slate-100"
                >
                  {tipoContingencia.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select: Tipo descanso médico (2 cols) */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 tracking-wider flex items-center gap-1">
            Tipo descanso médico
          </label>
          <Select
            value={filters.id_tipodescansomedico}
            onValueChange={(val) =>
              handleSelectChange("id_tipodescansomedico", val)
            }
          >
            <SelectTrigger className="bg-white border-slate-200 w-full focus:ring-1 focus:ring-slate-400">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-lg z-50 max-h-60 overflow-y-auto rounded-md">
              <SelectItem
                value="all"
                className="cursor-pointer hover:bg-slate-100"
              >
                Todos los tipos
              </SelectItem>
              {tipoDescansosMedicos.map((tipoDescanso) => (
                <SelectItem
                  key={tipoDescanso.id}
                  value={tipoDescanso.id || ""}
                  className="cursor-pointer hover:bg-slate-100"
                >
                  {tipoDescanso.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Input: Fecha de inicio (2 cols) */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 tracking-wider flex items-center gap-1">
            Fecha de Inicio
          </label>
          <Input
            id="fecha_inicio"
            name="fecha_inicio"
            type="date"
            autoComplete="off"
            value={filters.fecha_inicio || ""}
            onChange={handleInputChange}
            className="bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400"
          />
        </div>

        {/* Input: Fecha final (2 cols) */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 tracking-wider flex items-center gap-1">
            Fecha final
          </label>
          <Input
            id="fecha_final"
            name="fecha_final"
            type="date"
            autoComplete="off"
            value={filters.fecha_final || ""}
            onChange={handleInputChange}
            className="bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400"
          />
        </div>

        {/* Input: Colaborador ampliado (3 cols) */}
        <div className="md:col-span-2 space-y-1.5 mr-1">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 tracking-wider flex items-center gap-1">
            Colaborador
          </label>
          <Input
            type="text"
            id="search"
            name="search"
            autoComplete="off"
            value={filters.search || ""}
            onChange={handleInputChange}
            placeholder="Escribe el nombre completo"
            className="bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400 text-sm"
          />
        </div>

        {/* Botones de Acción reducidos (1 col) */}
        <div className="md:col-span-2 flex gap-1.5 justify-end">
          <Button
            type="submit"
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white gap-1 px-2.5 text-xs h-10 font-medium"
            title="Filtrar"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Filtrar</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="border-slate-200 text-slate-600 hover:bg-slate-100 px-2.5 h-10 shrink-0"
            title="Resetear filtros"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </form>
  );
};
