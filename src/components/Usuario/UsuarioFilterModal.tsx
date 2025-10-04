import React, { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
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
import { UsuarioFilter } from "@/interfaces/IUsuario";
import { getPerfiles } from "@/services/perfilService";
import { Perfil } from "@/interfaces/IPerfil";

interface UsuarioFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: UsuarioFilter;
  onApplyFilters: (filters: UsuarioFilter) => void;
}

const dataPerfiles = async () => {
  let perfiles: Perfil[] = [];
  const response = await getPerfiles();
  const { result, data } = response;
  if (result && data) {
    perfiles = data as Perfil[];
  }
  return perfiles;
};

export const UsuarioFilterModal: React.FC<UsuarioFilterModalProps> = ({
  isOpen,
  onClose,
  currentFilters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] =
    useState<UsuarioFilter>(currentFilters);

  const { showToast } = useToast();

  const [perfiles, setPerfiles] = useState<Perfil[]>([]);

  useEffect(() => {
    setLocalFilters({
      nombre_persona: currentFilters.nombre_persona || undefined,
      id_perfil: currentFilters.id_perfil || undefined,
    });
  }, [currentFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perfiles] = await Promise.all([dataPerfiles()]);

        setPerfiles(perfiles);
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
  const handleSelectChange = (name: keyof UsuarioFilter, value: string) => {
    // Si el valor es "null-filter" (nuestra convención para limpiar), guardamos undefined.
    // Si es un ID válido, lo guardamos.
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === "null-filter" ? undefined : value,
    }));
  };

  const handleApply = () => {
    // 1. Limpiar los valores (cadenas vacías o `null-filter`) a `undefined` para el servicio
    const filtersToApply: UsuarioFilter = Object.fromEntries(
      Object.entries(localFilters).map(([key, value]) => {
        // Los select están en `undefined` si están limpios.
        if (key === "id_perfil") {
          return [key, value];
        }
        // Los inputs de texto/fecha están en `""` si están vacíos.
        return [key, value === "" || value === null ? undefined : value];
      })
    ) as UsuarioFilter;

    onApplyFilters(filtersToApply);
    onClose(); // Cerrar el modal después de aplicar
  };

  const handleClear = () => {
    const emptyFilters: UsuarioFilter = {
      // Usamos `undefined` para filtros de ID (selects)
      id_perfil: undefined,
      nombre_persona: "",
    };
    setLocalFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  // Función auxiliar para obtener el valor del select
  const getSelectValue = (key: keyof UsuarioFilter) => {
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
              htmlFor="nombre_persona"
              className="md:text-right font-medium text-gray-700"
            >
              Nombre
            </Label>
            <Input
              id="nombre_persona"
              name="nombre_persona"
              value={localFilters.nombre_persona || ""}
              onChange={handleInputChange}
              placeholder="Escribe el nombre completo del usuario"
              className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="id_perfil"
              className="md:text-right font-medium text-gray-700"
            >
              Perfil
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("id_perfil", value)}
              value={getSelectValue("id_perfil")}
            >
              <SelectTrigger className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Seleccione perfil" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg z-[9999]">
                <SelectItem
                  value="null-filter"
                  className="text-gray-500 italic hover:bg-gray-50"
                >
                  Todos los perfiles
                </SelectItem>
                {perfiles.map((perfil) => (
                  <SelectItem
                    key={perfil.id}
                    value={perfil.id}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    {perfil.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
