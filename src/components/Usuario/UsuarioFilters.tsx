import React, { useEffect, useState } from "react";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { getDetalles } from "../../services/detalleParametroService";
import { ParametroClase } from "@/constants/parametroClase";
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

interface UsuarioFilterProps {
  onSearch: (filters: UsuarioFiltersData) => void;
}

const loadPerfiles = async (): Promise<Detalle[]> => {
  let perfiles: Detalle[] = [];

  try {
    const estado: boolean = true;

    const response = await getDetalles(ParametroClase.PERFIL, estado);

    console.log("response loadPerfiles");
    console.log({ response });

    const { result, data } = response;

    if (result && data) {
      perfiles = data as Detalle[];
    }

    console.log({ perfiles });

    return perfiles;
  } catch (error) {
    console.error("Error al obtener perfiles", error);
    return [];
  }
};

export interface UsuarioFiltersData {
  id_perfil: string;
  search: string;
}

export const UsuarioFilters: React.FC<UsuarioFilterProps> = ({ onSearch }) => {
  const { showToast } = useToast();

  const [perfiles, setPerfiles] = useState<Detalle[]>([]);

  const [filters, setFilters] = useState<UsuarioFiltersData>({
    id_perfil: "all",
    search: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (key: keyof UsuarioFiltersData, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanFilters = {
      ...filters,
      id_perfil: filters.id_perfil === "all" ? "" : filters.id_perfil,
    };
    onSearch(cleanFilters);
  };

  const handleReset = () => {
    const resetValues = {
      id_perfil: "all",
      search: "",
    };
    setFilters(resetValues);

    const cleanResetValues = {
      id_perfil: "",
      search: "",
    };
    onSearch(cleanResetValues);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listPerfiles] = await Promise.all([loadPerfiles()]);

        setPerfiles(listPerfiles);
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
        {/* Select: Perfil */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 tracking-wider flex items-center gap-1">
            Perfil
          </label>
          <Select
            value={filters.id_perfil}
            onValueChange={(val) => handleSelectChange("id_perfil", val)}
          >
            <SelectTrigger className="bg-white border-slate-200 w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los perfiles</SelectItem>
              {perfiles.map((perfil) => (
                <SelectItem key={perfil.id} value={perfil.id || ""}>
                  {perfil.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Input: Búsqueda */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 tracking-wider flex items-center gap-1">
            Búsqueda
          </label>
          <Input
            id="search"
            name="search"
            autoComplete="off"
            value={filters.search || ""}
            onChange={handleInputChange}
            placeholder="Escribe criterio de búsqueda"
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
