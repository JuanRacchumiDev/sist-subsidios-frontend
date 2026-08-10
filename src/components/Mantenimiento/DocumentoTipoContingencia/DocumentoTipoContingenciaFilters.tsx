import React, { useEffect, useState } from "react";
import { RotateCcw, Filter } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Detalle } from "../../../interfaces/IDetalleParametro";
import { getDetalles } from "../../../services/detalleParametroService";
import { ParametroClase } from "../../../constants/parametroClase";
import { useToast } from "../../../context/ToastContext";

interface DocumentoTCFilterProps {
  onSearch: (filters: DocumentoTCFiltersData) => void;
}

const loadTipoContingencias = async (): Promise<Detalle[]> => {
  let tipoContingencias: Detalle[] = [];
  const estado: boolean = true;

  try {
    const response = await getDetalles(
      ParametroClase.TIPO_CONTINGENCIA,
      estado,
    );

    console.log("response loadTipoContingencias");
    console.log({ response });

    const { result, data } = response;

    if (result && data) {
      tipoContingencias = data as Detalle[];
    }

    console.log({ tipoContingencias });

    return tipoContingencias;
  } catch (error) {
    console.error("Error al obtener tipo de contingencias", error);
    return [];
  }
};

export interface DocumentoTCFiltersData {
  id_tipocontingencia: string;
  search: string;
}

export const DocumentoTCFilters: React.FC<DocumentoTCFilterProps> = ({
  onSearch,
}) => {
  const { showToast } = useToast();
  const [tipoContingencias, setTipoContingencias] = useState<Detalle[]>([]);
  const [filters, setFilters] = useState<DocumentoTCFiltersData>({
    id_tipocontingencia: "all",
    search: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFilters((prev) => ({ ...prev, id_tipocontingencia: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const filterToSubmit = {
      ...filters,
      id_tipocontingencia:
        filters.id_tipocontingencia === "all"
          ? ""
          : filters.id_tipocontingencia,
    };

    onSearch(filterToSubmit);
  };

  const handleReset = () => {
    const resetValues = {
      id_tipocontingencia: "all",
      search: "",
    };
    setFilters(resetValues);

    const cleanResetValues = {
      id_tipocontingencia: "",
      search: "",
    };
    onSearch(cleanResetValues);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listTipoContingencias = await loadTipoContingencias();
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
      className="p-4 bg-slate-50/50 border-b border-slate-200 w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Select: Tipo contingencia */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 tracking-wider flex items-center gap-1">
            Tipo contingencia
          </label>
          <Select
            value={filters.id_tipocontingencia}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className="bg-white border-slate-200 w-full focus:ring-1 focus:ring-slate-400">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-lg z-50 max-h-60 overflow-y-auto rounded-md">
              <SelectItem
                value="all"
                className="cursor-pointer hover:bg-slate-100"
              >
                Todos los tipos de contingencia
              </SelectItem>
              {tipoContingencias.map((tipo) => (
                <SelectItem
                  key={tipo.id}
                  value={tipo.id || ""}
                  className="cursor-pointer hover:bg-slate-100"
                >
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Input: Búsqueda */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 tracking-wider flex items-center gap-1">
            Nombre
          </label>
          <Input
            type="text"
            id="search"
            name="search"
            autoComplete="off"
            value={filters.search || ""}
            onChange={handleInputChange}
            placeholder="RECETA MÉDICA"
            className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Botones de Acción */}
        <div className="md:col-span-2 flex gap-2">
          <Button
            type="submit"
            className="bg-slate-800 hover:bg-slate-900 text-white gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtrar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="border-slate-200 text-slate-600 hover:bg-slate-100"
            title="Resetear filtros"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};
