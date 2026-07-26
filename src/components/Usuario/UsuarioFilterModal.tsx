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
import { UsuarioFilter } from "../../interfaces/IUsuario";
import { getDetalles } from "../../services/detalleParametroService";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { ParametroClase } from "../../constants/parametroClase";

interface UsuarioFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: UsuarioFilter;
  onApplyFilters: (filters: UsuarioFilter) => void;
}

const getPerfiles = async (): Promise<Detalle[]> => {
  let perfiles: Detalle[] = [];

  try {
    const estado: boolean = true;
    // const enPersona: boolean = false;

    const response = await getDetalles(
      ParametroClase.PERFIL,
      estado,
      // enPersona,
    );

    console.log("response getPerfiles");
    console.log({ response });

    const { result, data } = response;

    if (result && data) {
      perfiles = data as Detalle[];
    }

    return perfiles;
  } catch (error) {
    console.error("Error al obtener tipo de descansos médicos", error);
    return [];
  }
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

  const [perfiles, setPerfiles] = useState<Detalle[]>([]);

  useEffect(() => {
    setLocalFilters({
      id_perfil: currentFilters.id_perfil || undefined,
      nombre_persona: currentFilters.nombre_persona || undefined,
      username: currentFilters.username || "",
      email: currentFilters.email || "",
    });
  }, [currentFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perfiles] = await Promise.all([getPerfiles()]);

        setPerfiles(perfiles);
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

  const handleSelectChange = (name: keyof UsuarioFilter, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === "null-filter" ? undefined : value,
    }));
  };

  const handleApply = () => {
    const filtersToApply: UsuarioFilter = Object.fromEntries(
      Object.entries(localFilters).map(([key, value]) => {
        if (key === "id_perfil") {
          return [key, value];
        }
        return [key, value === "" || value === null ? undefined : value];
      }),
    ) as UsuarioFilter;

    onApplyFilters(filtersToApply);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: UsuarioFilter = {
      id_perfil: undefined,
      nombre_persona: "",
      username: "",
      email: "",
    };
    setLocalFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  const getSelectValue = (key: keyof UsuarioFilter) => {
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
              Nombre de persona
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
              htmlFor="username"
              className="md:text-right font-medium text-gray-700"
            >
              Nombre de usuario
            </Label>
            <Input
              id="username"
              name="username"
              value={localFilters.username || ""}
              onChange={handleInputChange}
              placeholder="Escribe el nombre de usuario"
              className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="email"
              className="md:text-right font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={localFilters.email || ""}
              onChange={handleInputChange}
              placeholder="Escribe el email del usuario"
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
