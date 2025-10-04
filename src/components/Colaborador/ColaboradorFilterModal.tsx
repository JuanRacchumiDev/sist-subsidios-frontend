import { useEffect, useState } from "react";
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
import { TipoDocumento } from "@/interfaces/ITipoDocumento";
import { ColaboradorFilter } from "../../interfaces/IColaborador";
import { getTipoDocumentos } from "@/services/tipoDocumentoService";
import { Cargo } from "@/interfaces/ICargo";
import { getCargos } from "@/services/cargoService";
import { Empresa } from "@/interfaces/IEmpresa";
import { getEmpresas } from "@/services/empresaService";

interface ColaboradorFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: ColaboradorFilter;
  onApplyFilters: (filters: ColaboradorFilter) => void;
}

const dataTipoDocumentos = async () => {
  let tipoDocumentos: TipoDocumento[] = [];
  const response = await getTipoDocumentos();
  const { result, data } = response;
  if (result && data) {
    tipoDocumentos = data as TipoDocumento[];
  }
  return tipoDocumentos;
};

const dataCargos = async () => {
  let cargos: Cargo[] = [];
  const response = await getCargos();
  const { result, data } = response;
  if (result && data) {
    cargos = data as Cargo[];
  }
  return cargos;
};

const dataEmpresas = async () => {
  let empresas: Empresa[] = [];
  const response = await getEmpresas();
  const { result, data } = response;
  if (result && data) {
    empresas = data as Empresa[];
  }
  return empresas;
};

export const ColaboradorFilterModal: React.FC<ColaboradorFilterModalProps> = ({
  isOpen,
  onClose,
  currentFilters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] =
    useState<ColaboradorFilter>(currentFilters);

  const { showToast } = useToast();

  const [tipoDocumentos, setTipoDocumentos] = useState<TipoDocumento[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    setLocalFilters({
      id_tipodocumento: currentFilters.id_tipodocumento || undefined,
      id_cargo: currentFilters.id_cargo || undefined,
      id_empresa: currentFilters.id_empresa || undefined,
      numero_documento: currentFilters.numero_documento || "",
      nombre_completo: currentFilters.nombre_completo || "",
    });
  }, [currentFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipoDocumentos, cargos, empresas] = await Promise.all([
          dataTipoDocumentos(),
          dataCargos(),
          dataEmpresas(),
        ]);

        setTipoDocumentos(tipoDocumentos);
        setCargos(cargos);
        setEmpresas(empresas);
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
  const handleSelectChange = (name: keyof ColaboradorFilter, value: string) => {
    // Si el valor es "null-filter" (nuestra convención para limpiar), guardamos undefined.
    // Si es un ID válido, lo guardamos.
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === "null-filter" ? undefined : value,
    }));
  };

  const handleApply = () => {
    // 1. Limpiar los valores (cadenas vacías o `null-filter`) a `undefined` para el servicio
    const filtersToApply: ColaboradorFilter = Object.fromEntries(
      Object.entries(localFilters).map(([key, value]) => {
        // Los select están en `undefined` si están limpios.
        if (
          key === "id_tipodocumento" ||
          key === "id_cargo" ||
          key === "id_empresa"
        ) {
          return [key, value];
        }
        // Los inputs de texto/fecha están en `""` si están vacíos.
        return [key, value === "" || value === null ? undefined : value];
      })
    ) as ColaboradorFilter;

    onApplyFilters(filtersToApply);
    onClose(); // Cerrar el modal después de aplicar
  };

  const handleClear = () => {
    const emptyFilters: ColaboradorFilter = {
      // Usamos `undefined` para filtros de ID (selects)
      id_tipodocumento: undefined,
      id_cargo: undefined,
      id_empresa: undefined,
      // Usamos `""` para los inputs (texto/fecha) para limpiar visualmente
      numero_documento: "",
      nombre_completo: "",
    };
    setLocalFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  // Función auxiliar para obtener el valor del select
  const getSelectValue = (key: keyof ColaboradorFilter) => {
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
              htmlFor="numero_documento"
              className="md:text-right font-medium text-gray-700"
            >
              Número de documento
            </Label>
            <Input
              id="numero_documento"
              name="numero_documento"
              value={localFilters.numero_documento || ""}
              onChange={handleInputChange}
              placeholder="Escribe el número de documento"
              className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-co0ls-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="nombre_completo"
              className="md:text-right font-medium text-gray-700"
            >
              Nombre del colaborador
            </Label>
            <Input
              id="nombre_completo"
              name="nombre_completo"
              value={localFilters.nombre_completo || ""}
              onChange={handleInputChange}
              placeholder="Escribe el nombre completo"
              className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="id_tipodocumento"
              className="md:text-right font-medium text-gray-700"
            >
              Tipo documento
            </Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("id_tipodocumento", value)
              }
              value={getSelectValue("id_tipodocumento")}
            >
              <SelectTrigger className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Seleccione tipo de documento" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg z-[9999]">
                <SelectItem
                  value="null-filter"
                  className="text-gray-500 italic hover:bg-gray-50"
                >
                  Todos los tipos de documentos
                </SelectItem>
                {tipoDocumentos.map((td) => (
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
              htmlFor="id_empresa"
              className="md:text-right font-medium text-gray-700"
            >
              Empresa
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("id_empresa", value)}
              value={getSelectValue("id_empresa")}
            >
              <SelectTrigger className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Seleccione empresa" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg z-[9999]">
                <SelectItem
                  value="null-filter"
                  className="text-gray-500 italic hover:bg-gray-50"
                >
                  Todas las empresas
                </SelectItem>
                {empresas.map((empresa) => (
                  <SelectItem
                    key={empresa.id}
                    value={empresa.id}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    {empresa.nombre_o_razon_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="id_cargo"
              className="md:text-right font-medium text-gray-700"
            >
              Cargo
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("id_cargo", value)}
              value={getSelectValue("id_cargo")}
            >
              <SelectTrigger className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Seleccione cargo" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg z-[9999]">
                <SelectItem
                  value="null-filter"
                  className="text-gray-500 italic hover:bg-gray-50"
                >
                  Todos los cargos
                </SelectItem>
                {cargos.map((cargo) => (
                  <SelectItem
                    key={cargo.id}
                    value={cargo.id}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    {cargo.nombre}
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
