import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { CanjeFilter } from "../../interfaces/ICanje";
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
import { getDetalles } from "../../services/detalleParametroService";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { ParametroClase } from "../../constants/parametroClase";

interface CanjeFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: CanjeFilter;
  onApplyFilters: (filters: CanjeFilter) => void;
}

const getTipoDescansosMedicos = async (): Promise<Detalle[]> => {
  let tipoDescansos: Detalle[] = [];

  try {
    const estado: boolean = true;

    const response = await getDetalles(
      ParametroClase.TIPO_DESCANSO_MEDICO,
      estado,
    );
    console.log("response getTipoDescansosMedicos");
    console.log({ response });

    const { result, data } = response;

    if (result && data) {
      tipoDescansos = data as Detalle[];
    }

    return tipoDescansos;
  } catch (error) {
    console.error("Error al obtener tipo de descansos médicos", error);
    return [];
  }
};

const getTipoContingencias = async (): Promise<Detalle[]> => {
  let tipoContingencias: Detalle[] = [];

  try {
    const estado: boolean = true;

    const response = await getDetalles(
      ParametroClase.TIPO_CONTINGENCIA,
      estado,
    );
    console.log("response getTipoContingencias");
    console.log({ response });

    const { result, data } = response;

    if (result && data) {
      tipoContingencias = data as Detalle[];
    }

    return tipoContingencias;
  } catch (error) {
    console.error("Error al obtener tipo de contingencias", error);
    return [];
  }
};

export const CanjeFilterModal: React.FC<CanjeFilterModalProps> = ({
  isOpen,
  onClose,
  currentFilters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<CanjeFilter>(currentFilters);

  const { showToast } = useToast();

  const [tipoDescansos, setTipoDescansos] = useState<Detalle[]>([]);
  const [tipoContingencias, setTipoContingencias] = useState<Detalle[]>([]);

  // Sincronizar filtros al abrir el modal
  useEffect(() => {
    setLocalFilters({
      id_tipodescansomedico: currentFilters.id_tipodescansomedico || undefined,
      id_tipocontingencia: currentFilters.id_tipocontingencia || undefined,
      nombre_colaborador: currentFilters.nombre_colaborador || "",
      codigo_canje: currentFilters.codigo_canje || "",
      codigo_citt: currentFilters.codigo_citt || "",
      fecha_inicio_subsidio: currentFilters.fecha_inicio_subsidio || "",
      fecha_final_subsidio: currentFilters.fecha_final_subsidio || "",
    });
  }, [currentFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipoDescansosRes, tipoContingenciasRes] = await Promise.all([
          getTipoDescansosMedicos(),
          getTipoContingencias(),
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
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador específico pata <Select>
  const handleSelectChange = (name: keyof CanjeFilter, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === "null-filter" ? undefined : value,
    }));
  };

  const handleApply = () => {
    const filtersToApply: CanjeFilter = Object.fromEntries(
      Object.entries(localFilters).map(([key, value]) => {
        if (key === "id_tipodescansomedico" || key === "id_tipocontingencia") {
          return [key, value];
        }

        return [key, value === "" || value === null ? undefined : value];
      }),
    ) as CanjeFilter;

    onApplyFilters(filtersToApply);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: CanjeFilter = {
      id_tipodescansomedico: undefined,
      id_tipocontingencia: undefined,
      nombre_colaborador: "",
      codigo_canje: "",
      codigo_citt: "",
      fecha_inicio_subsidio: "",
      fecha_final_subsidio: "",
    };
    setLocalFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  const getSelectValue = (key: keyof CanjeFilter) => {
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
              Tipo de Contingencia
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
              htmlFor="codigo_canje"
              className="md:text-right font-medium text-gray-700"
            >
              Código Canje
            </Label>
            <Input
              id="codigo_canje"
              name="codigo_canje"
              value={localFilters.codigo_canje || ""}
              onChange={handleInputChange}
              placeholder="Escribe el código de canje"
              className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="codigo_citt"
              className="md:text-right font-medium text-gray-700"
            >
              Código CITT
            </Label>
            <Input
              id="codigo_citt"
              name="codigo_citt"
              value={localFilters.codigo_citt || ""}
              onChange={handleInputChange}
              placeholder="Escribe el código de CIT"
              className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="fecha_inicio_subsidio"
              className="md:text-right font-medium text-gray-700"
            >
              Fecha Inicio Subsidio (Desde)
            </Label>
            <Input
              id="fecha_inicio_subsidio"
              name="fecha_inicio_subsidio"
              type="date"
              value={localFilters.fecha_inicio_subsidio || ""}
              onChange={handleInputChange}
              className="md:col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label
              htmlFor="fecha_final_subsidio"
              className="md:text-right font-medium text-gray-700"
            >
              Fecha Final Subsidio (Hasta)
            </Label>
            <Input
              id="fecha_final_subsidio"
              name="fecha_final_subsidio"
              type="date"
              value={localFilters.fecha_final_subsidio || ""}
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
