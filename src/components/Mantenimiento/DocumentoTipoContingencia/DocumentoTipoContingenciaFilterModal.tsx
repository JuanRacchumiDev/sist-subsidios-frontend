import React, { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { DocumentoTipoContingenciaFilter } from "@/interfaces/IDocumentoTipoContingencia";
import { TipoContingencia } from "@/interfaces/ITipoContingencia";
import { getTipoContingencias } from "@/services/tipoContingenciaService";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DocumentoTipoContingenciaFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: DocumentoTipoContingenciaFilter;
  onApplyFilters: (filters: DocumentoTipoContingenciaFilter) => void;
}

const dataTipoContingencias = async () => {
  let tipoContingencias: TipoContingencia[] = [];
  const response = await getTipoContingencias();
  const { result, data } = response;
  if (result && data) {
    tipoContingencias = data as TipoContingencia[];
  }
  return tipoContingencias;
};

export const DocumentoTipoContingenciaFilterModal: React.FC<
  DocumentoTipoContingenciaFilterModalProps
> = ({ isOpen, onClose, currentFilters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] =
    useState<DocumentoTipoContingenciaFilter>(currentFilters);

  const { showToast } = useToast();

  const [tipoContingencias, setTipoContingencias] = useState<
    TipoContingencia[]
  >([]);

  useEffect(() => {
    setLocalFilters({
      id_tipocontingencia: currentFilters.id_tipocontingencia || undefined,
      nombre: currentFilters.nombre || undefined,
    });
  }, [currentFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipoContingencias] = await Promise.all([
          dataTipoContingencias(),
        ]);

        setTipoContingencias(tipoContingencias);
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    name: keyof DocumentoTipoContingenciaFilter,
    value: string,
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === "null-filter" ? undefined : value,
    }));
  };

  const handleApply = () => {
    const filtersToApply: DocumentoTipoContingenciaFilter = Object.fromEntries(
      Object.entries(localFilters).map(([key, value]) => {
        if (key === "id_tipocontingencia") {
          return [key, value];
        }
        return [key, value === "" || value === null ? undefined : value];
      }),
    ) as DocumentoTipoContingenciaFilter;

    onApplyFilters(filtersToApply);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: DocumentoTipoContingenciaFilter = {
      id_tipocontingencia: undefined,
      nombre: "",
    };
    setLocalFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  const getSelectValue = (key: keyof DocumentoTipoContingenciaFilter) => {
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
              htmlFor="id_tipodocumento"
              className="md:text-right font-medium text-gray-700"
            >
              Tipo de contingencia
            </Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("id_tipocontingencia", value)
              }
              value={getSelectValue("id_tipocontingencia")}
            >
              <SelectTrigger className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Seleccione tipo de documento" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg z-[9999]">
                <SelectItem
                  value="null-filter"
                  className="text-gray-500 italic hover:bg-gray-50"
                >
                  Todos los tipos de contingencias
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

          <div className="grid grid-co0ls-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="nombre"
              className="md:text-right font-medium text-gray-700"
            >
              Nombre del documento
            </Label>
            <Input
              id="nombre"
              name="nombre"
              value={localFilters.nombre || ""}
              onChange={handleInputChange}
              placeholder="Escribe el nombre del documento de tipo de contingencia"
              className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <Button
            variant="ghost"
            onClick={handleClear}
            type="button"
            className="text-red-600 hover:bg-red-50 cursor-pointer"
          >
            Limpiar filtros
          </Button>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              className="border-gray-300 hover:bg-gray-100 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApply}
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
            >
              Aplicar filtros
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
