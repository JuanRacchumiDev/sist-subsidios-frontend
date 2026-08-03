import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Filter, RotateCcw } from "lucide-react";

const defaultValues = {
  search: "",
};

interface ReembolsoFilterProps {
  onSearch: (filters: ReembolsoFiltersData) => void;
}

export interface ReembolsoFiltersData {
  search: string;
}

export const ReembolsoFilters: React.FC<ReembolsoFilterProps> = ({
  onSearch,
}) => {
  const [filters, setFilters] = useState<ReembolsoFiltersData>(defaultValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanFilters = {
      ...filters,
    };
    onSearch(cleanFilters);
  };

  const handleReset = () => {
    setFilters(defaultValues);
    onSearch(defaultValues);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="p-4 bg-slate-50/50 border-b border-slate-200 w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 tracking-wider flex items-center gap-1">
            Colaborador
          </label>
          <Input
            id="search"
            name="search"
            autoComplete="off"
            value={filters.search || ""}
            onChange={handleInputChange}
            placeholder="Escribe el nombre completo"
            className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

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
