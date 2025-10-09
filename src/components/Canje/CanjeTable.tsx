import { useCallback, useEffect, useState } from "react";
import { CanjeRow } from "./CanjeRow";
import {
  Canje,
  CanjeFilter,
  Pagination as PaginationType,
} from "../../interfaces/ICanje";
import { getCanjesWithPaginate } from "@/services/canjeService";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { FilterIcon } from "lucide-react";
import { CanjeFilterModal } from "./CanjeFilterModal";
import { TableSpinner } from "../Common/TableSpinner";

// Definimos el estado inicial de los filtros
const initialFilters: CanjeFilter = {
  codigo_canje: undefined,
  codigo_citt: undefined,
  fecha_inicio_subsidio: undefined,
  fecha_final_subsidio: undefined,
};

export const CanjeTable = () => {
  const [canjes, setCanjes] = useState<Canje[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
    nextPage: null,
    previousPage: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<CanjeFilter>(initialFilters);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // const userProfile = useMemo(() => getAuthData()?.usuario, []);

  const handleApplyFilters = (newFilters: CanjeFilter) => {
    // Asegurar que las cadenas vacías de los Inputs se conviertan a `undefined` al aplicar
    const cleanedFilters: CanjeFilter = Object.fromEntries(
      Object.entries(newFilters).map(([key, value]) => [
        key,
        value === "" || value === null ? undefined : value,
      ])
    ) as CanjeFilter;

    setFilters(cleanedFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setIsFilterModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  // useEffect(() => {
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { currentPage, limit } = pagination;

      // Limpia los filtros (elimina `undefined` para no enviar el query param)
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
      );

      const response = await getCanjesWithPaginate(
        currentPage,
        limit,
        cleanFilters
      );

      console.log("response canjes", response);

      const { result, data, pagination: detailtPagination } = response;

      if (result && data && detailtPagination) {
        setCanjes(data as Canje[]);
        setPagination(detailtPagination);
      } else {
        setCanjes([]);
        setPagination({
          currentPage: 1,
          limit: 10,
          totalPages: 1,
          totalItems: 0,
          nextPage: null,
          previousPage: null,
        });
      }
    } catch (error) {
      console.error("Error al obtener canjes", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //   fetchData();
  // }, [pagination.currentPage, pagination.limit]);

  const renderPaginationItems = () => {
    const items = [];
    const startPage = Math.max(1, pagination.currentPage - 2);
    const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);

    if (startPage > 1) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // for (let i = 1; i < pagination.totalPages; i++) {
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === pagination.currentPage}
            className={`
              ${
                i === pagination.currentPage
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 transition-colors"
              }
            `}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < pagination.totalPages) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <div className="w-full space-y-4 pt-4">
      <div className="flex justify-end items-center space-x-2 pb-4">
        <Button
          variant="outline"
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center space-x-2 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:cursor-pointer transition"
        >
          <FilterIcon className="w-4 h-4" />
          {/* Contar los filtros aplicados (valores que no son undefined/null/vacío) */}
          <span>
            Filtros (
            {
              Object.values(filters).filter(
                (v) => v !== undefined && v !== null && v !== ""
              ).length
            }
            )
          </span>
        </Button>
        {/* <Input
          type="text"
          placeholder="Buscar por razón social o RUC"
          className="w-72 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
        /> */}
      </div>
      <div className="rounded-md border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-gray-600 font-medium">
                Colaborador
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Fecha Otorgamiento
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Fecha Inicio
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Fecha Final
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Total días
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Fecha Máxima Canje
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Tipo descanso
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Tipo contingencia
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Mes devengado
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Estado
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Subsidiado
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSpinner colSpan={12} />
            ) : canjes.length > 0 ? (
              canjes.map((canje) => <CanjeRow key={canje.id} canje={canje} />)
            ) : (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center text-gray-500 py-6"
                >
                  No se encontraron canjes registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className="hover:bg-gray-200 transition-colors"
              >
                Anterior
              </PaginationPrevious>
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className="hover:bg-gray-200 transition-colors"
              >
                Siguiente
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <CanjeFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
