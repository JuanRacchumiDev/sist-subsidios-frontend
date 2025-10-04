import { useEffect, useMemo, useState, useCallback } from "react";
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
import {
  getDescansosWithPaginate,
  getDescansosByColaboradorWithPaginate,
} from "../../services/descansoMedicoService";
import {
  DescansoMedico,
  DescansoMedicoPaginateResponse,
  Pagination as PaginationType,
  DescansoMedicoFilter,
} from "../../interfaces/IDescansoMedico";
import { DescansoMedicoRow } from "./DescansoMedicoRow";
import { getAuthData } from "../../utils/authMemo";
import { FilterIcon } from "lucide-react";
import { DescansoMedicoFilterModal } from "./DescansoMedicoFilterModal";
import { Button } from "../ui/button";

// Definimos el estado inicial de los filtros
const initialFilters: DescansoMedicoFilter = {
  id_tipodescansomedico: undefined,
  id_tipocontingencia: undefined,
  nombre_colaborador: undefined,
  fecha_inicio: undefined,
  fecha_final: undefined,
};

export const DescansoMedicoTable = () => {
  const [descansos, setDescansos] = useState<DescansoMedico[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
    nextPage: null,
    previousPage: null,
  });

  const [filters, setFilters] = useState<DescansoMedicoFilter>(initialFilters);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const userProfile = useMemo(() => getAuthData()?.usuario, []);

  const handleApplyFilters = (newFilters: DescansoMedicoFilter) => {
    // Asegurar que las cadenas vacías de los Inputs se conviertan a `undefined` al aplicar
    const cleanedFilters: DescansoMedicoFilter = Object.fromEntries(
      Object.entries(newFilters).map(([key, value]) => [
        key,
        value === "" || value === null ? undefined : value,
      ])
    ) as DescansoMedicoFilter;

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
    try {
      let response: DescansoMedicoPaginateResponse = null;

      const { slug_perfil, id_colaborador } = userProfile;

      const { currentPage, limit } = pagination;

      // Limpia los filtros (elimina `undefined` para no enviar el query param)
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
      );

      if (slug_perfil && id_colaborador) {
        response = await getDescansosByColaboradorWithPaginate(
          id_colaborador,
          currentPage,
          limit,
          cleanFilters
        );
      } else {
        response = await getDescansosWithPaginate(
          currentPage,
          limit,
          cleanFilters
        );
      }

      console.log({ response });

      const { result, data, pagination: detailPagination } = response;

      if (result && data && detailPagination) {
        setDescansos(data);
        setPagination(detailPagination);
      } else {
        setDescansos([]);
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
      console.error("Error al obtener colaboradores", error);
    }
  }, [pagination.currentPage, pagination.limit, userProfile, filters]);

  //   fetchData();
  // }, [pagination.currentPage, pagination.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    for (let i = startPage; i < endPage; i++) {
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
      </div>
      <div className="rounded-md border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              {/* <TableHead className="text-gray-600 font-medium">
                Código
              </TableHead> */}
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
                Tipo Descanso
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Tipo Contingencia
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Mes devengado
              </TableHead>
              <TableHead className="text-gray-600 font-medium">Año</TableHead>
              <TableHead className="text-gray-600 font-medium">
                Estado
              </TableHead>
              {/* <TableHead className="text-gray-600 font-medium">
                Subsidiado
              </TableHead> */}
              <TableHead className="text-gray-600 font-medium">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {descansos.length > 0 ? (
              descansos.map((descanso) => (
                <DescansoMedicoRow key={descanso.id} desc={descanso} />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center text-gray-500 py-6"
                >
                  No se encontraron descansos médicos registrados
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

      <DescansoMedicoFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
