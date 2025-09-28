import React, { useEffect, useState } from "react";
import { DescansoMedicoFilter } from "../../interfaces/IDescansoMedico";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../../context/ToastContext";
import { getTipoDescansosMedicos } from "../../services/tipoDescansoMedicoService";
import { getTipoContingencias } from "../../services/tipoContingenciaService";
import { TipoDescansoMedico } from "../../interfaces/ITipoDescansoMedico";
import { TipoContingencia } from "../../interfaces/ITipoContingencia";

interface DescansoMedicoFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: DescansoMedicoFilter;
  onApplyFilters: (filters: DescansoMedicoFilter) => void;
}

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

export const DescansoMedicoFilterModal: React.FC<
  DescansoMedicoFilterModalProps
> = ({ isOpen, onClose, currentFilters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] =
    useState<DescansoMedicoFilter>(currentFilters);

  const { showToast } = useToast();

  const [tipoDescansos, setTipoDescansos] = useState<TipoDescansoMedico[]>([]);
  const [tipoContingencias, setTipoContingencias] = useState<
    TipoContingencia[]
  >([]);

  // Sincronizar filtros al abrir el modal
  useEffect(() => {
    // setLocalFilters(currentFilters);
    setLocalFilters({
      id_tipodescansomedico: currentFilters.id_tipodescansomedico || undefined,
      id_tipocontingencia: currentFilters.id_tipocontingencia || undefined,
      nombre_colaborador: currentFilters.nombre_colaborador || "",
      fecha_inicio: currentFilters.fecha_inicio || "",
      fecha_final: currentFilters.fecha_final || "",
    });
  }, [currentFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipoDescansosRes, tipoContingenciasRes] = await Promise.all([
          dataTipoDescansosMedicos(),
          dataTipoContingencias(),
        ]);

        setTipoDescansos(tipoDescansosRes);
        setTipoContingencias(tipoContingenciasRes);
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, []);

  // Manejador genérico para <input> (texto y fecha)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Guardamos la cadena vacía, y al aplicar, la transformamos a undefined
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador específico para <Select>
  const handleSelectChange = (
    name: keyof DescansoMedicoFilter,
    value: string
  ) => {
    // Si el valor es "null-filter" (nuestra convención para limpiar), guardamos undefined.
    // Si es un ID válido, lo guardamos.
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === "null-filter" ? undefined : value,
    }));
  };

  const handleApply = () => {
    // 1. Limpiar los valores (cadenas vacías o `null-filter`) a `undefined` para el servicio
    const filtersToApply: DescansoMedicoFilter = Object.fromEntries(
      Object.entries(localFilters).map(([key, value]) => {
        // Los select están en `undefined` si están limpios.
        if (key === "id_tipodescansomedico" || key === "id_tipocontingencia") {
          return [key, value];
        }
        // Los inputs de texto/fecha están en `""` si están vacíos.
        return [key, value === "" || value === null ? undefined : value];
      })
    ) as DescansoMedicoFilter;

    onApplyFilters(filtersToApply);
    onClose(); // Cerrar el modal después de aplicar
  };

  const handleClear = () => {
    const emptyFilters: DescansoMedicoFilter = {
      // Usamos `undefined` para filtros de ID (selects)
      id_tipodescansomedico: undefined,
      id_tipocontingencia: undefined,
      // Usamos `""` para los inputs (texto/fecha) para limpiar visualmente
      nombre_colaborador: "",
      fecha_inicio: "",
      fecha_final: "",
    };
    setLocalFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  // Función auxiliar para obtener el valor del select
  const getSelectValue = (key: keyof DescansoMedicoFilter) => {
    // El valor en el Select debe ser una cadena. Si es undefined, usamos nuestra convención "null-filter".
    return localFilters[key] || "null-filter";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 bg-white rounded-xl shadow-2xl transition-all">
        <DialogHeader className="p-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Filtros
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="nombre_colaborador"
              className="md:text-right font-medium text-gray-700"
            >
              Colaborador
            </Label>
            <Input
              id="nombre_colaborador"
              name="nombre_colaborador"
              value={localFilters.nombre_colaborador || ""}
              onChange={handleInputChange}
              placeholder="Escribe el nombre completo"
              className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="id_tipodescansomedico"
              className="md:text-right font-medium text-gray-700"
            >
              Tipo descanso
            </Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("id_tipodescansomedico", value)
              }
              value={getSelectValue("id_tipodescansomedico")}
            >
              <SelectTrigger className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Seleccione tipo de descanso médico" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg z-[9999]">
                <SelectItem
                  value="null-filter"
                  className="text-gray-500 italic hover:bg-gray-50"
                >
                  Todos los tipos de descanso
                </SelectItem>
                {tipoDescansos.map((td) => (
                  <SelectItem
                    key={td.id}
                    value={td.id}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    {td.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="id_tipocontingencia"
              className="md:text-right font-medium text-gray-700"
            >
              Contingencia
            </Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("id_tipocontingencia", value)
              }
              value={getSelectValue("id_tipocontingencia")}
            >
              <SelectTrigger className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Seleccione tipo de contingencia" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg z-[9999]">
                <SelectItem
                  value="null-filter"
                  className="text-gray-500 italic hover:bg-gray-50"
                >
                  Todos los tipos de contingencia
                </SelectItem>
                {tipoContingencias.map((tc) => (
                  <SelectItem
                    key={tc.id}
                    value={tc.id}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    {tc.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="fecha_inicio"
              className="md:text-right font-medium text-gray-700"
            >
              Fecha Inicio (Desde)
            </Label>
            <Input
              id="fecha_inicio"
              name="fecha_inicio"
              type="date"
              value={localFilters.fecha_inicio || ""}
              onChange={handleInputChange}
              className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="fecha_final"
              className="md:text-right font-medium text-gray-700"
            >
              Fecha Final (Hasta)
            </Label>
            <Input
              id="fecha_final"
              name="fecha_final"
              type="date"
              value={localFilters.fecha_final || ""}
              onChange={handleInputChange}
              className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <Button
            variant="ghost"
            onClick={handleClear}
            type="button"
            className="text-red-600 hover:bg-red-50"
          >
            Limpiar filtros
          </Button>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              className="border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApply}
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              Aplicar filtros
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
