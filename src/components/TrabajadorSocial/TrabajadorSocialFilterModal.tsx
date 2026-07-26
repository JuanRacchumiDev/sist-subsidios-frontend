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
import { Detalle } from "../../interfaces/IDetalleParametro";
import { PersonaFilter } from "../../interfaces/IPersona";
import { getDetalles } from "../../services/detalleParametroService";
import { Empresa, EmpresaResponse } from "../../interfaces/IEmpresa";
import { getEmpresas } from "../../services/empresaService";
import { ParametroClase } from "../../constants/parametroClase";

interface TrabajadorSocialFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: PersonaFilter;
  onApplyFilters: (filters: PersonaFilter) => void;
}

const getDataTipoDocumentos = async (): Promise<Detalle[]> => {
  let tipos: Detalle[] = [];

  try {
    const estado: boolean = true;
    // const enPersona: boolean = true;

    const response = await getDetalles(
      ParametroClase.TIPO_DOCUMENTO,
      estado,
      // enPersona,
    );

    console.log("response getTipoDocumentos");
    console.log({ response });

    if (response.result && response.data) {
      tipos = response.data as Detalle[];
    }

    return tipos;
  } catch (error) {
    console.error("Error al obtener tipo de documentos", error);
    return [];
  }
};

const getDataCargos = async (): Promise<Detalle[]> => {
  let cargos: Detalle[] = [];

  try {
    const estado: boolean = true;
    // const enPersona: boolean = false;

    const response = await getDetalles(
      ParametroClase.CARGO,
      estado,
      // enPersona
    );

    console.log("response getCargos");
    console.log({ response });

    if (response.result && response.data) {
      cargos = response.data as Detalle[];
    }

    return cargos;
  } catch (error) {
    console.error("Error al obtener cargos", error);
    return [];
  }
};

const getDataEmpresas = async (): Promise<Empresa[]> => {
  let empresas: Empresa[] = [];

  try {
    const response = await getEmpresas();

    const { result, data } = response as EmpresaResponse;

    if (result && data) {
      empresas = data as Empresa[];
    }

    return empresas;
  } catch (error) {
    console.error("Error al obtener empresas", error);
    return [];
  }
};

export const TrabajadorSocialFilterModal: React.FC<
  TrabajadorSocialFilterModalProps
> = ({ isOpen, onClose, currentFilters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] =
    useState<PersonaFilter>(currentFilters);

  const { showToast } = useToast();

  const [tipos, setTipos] = useState<Detalle[]>([]);
  const [cargos, setCargos] = useState<Detalle[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    setLocalFilters({
      id_tipodocumento: currentFilters.id_tipodocumento || undefined,
      id_empresa: currentFilters.id_empresa || undefined,
      numero_documento: currentFilters.numero_documento || "",
      nombre_completo: currentFilters.nombre_completo || "",
      nombreGrupo: currentFilters.nombreGrupo || "",
    });
  }, [currentFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipos, cargos, empresas] = await Promise.all([
          getDataTipoDocumentos(),
          getDataCargos(),
          getDataEmpresas(),
        ]);

        setTipos(tipos);
        setCargos(cargos);
        setEmpresas(empresas);
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

  const handleSelectChange = (name: keyof PersonaFilter, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === "null-filter" ? undefined : value,
    }));
  };

  const handleApply = () => {
    const filtersToApply: PersonaFilter = Object.fromEntries(
      Object.entries(localFilters).map(([key, value]) => {
        if (
          key === "id_tipodocumento" ||
          key === "id_empresa" ||
          key === "id_cargo" ||
          key === "nombreGrupo"
        ) {
          return [key, value];
        }
        return [key, value === "" || value === null ? undefined : value];
      }),
    ) as PersonaFilter;

    onApplyFilters(filtersToApply);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: PersonaFilter = {
      id_tipodocumento: undefined,
      id_empresa: undefined,
      numero_documento: "",
      nombre_completo: "",
      nombreGrupo: "",
    };
    setLocalFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  const getSelectValue = (key: keyof PersonaFilter) => {
    return localFilters[key] || "null-filter";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 bg-white rounded-xl shadow-2xl transition-all">
        <DialogHeader className="p-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Filtros de búsqueda
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
              Nombre del trabajador social
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
                {tipos.map((td) => (
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
