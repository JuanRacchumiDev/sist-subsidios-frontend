import React, { useEffect, useState } from "react";
import { getDocumentosTipoContWithPaginate } from "../../../services/documentoTipoContService";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { DocumentoTipoContingenciaRow } from "./DocumentoTipoContingenciaRow";
import { useCallback } from "react";
import {
  DocumentoTipoContingencia,
  DocumentoTipoContingenciaFilter,
  Pagination as PaginationType,
} from "../../../interfaces/IDocumentoTipoContingencia";
import {} from "../../../interfaces/IDetalleParametro";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentoTipoContingenciaFilterModal } from "./DocumentoTipoContingenciaFilterModal";
import { TableSpinner } from "../../../components/Common/TableSpinner";

const initialFilters: DocumentoTipoContingenciaFilter = {
  id_tipocontingencia: undefined,
  nombre: undefined,
};

export const DocumentoTipoContingenciaTable: React.FC = () => {
  const [documentos, setDocumentos] = useState<DocumentoTipoContingencia[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
    nextPage: null,
    previousPage: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] =
    useState<DocumentoTipoContingenciaFilter>(initialFilters);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(0);

  const handleDocumentoStatusChange = () => {
    setRefreshToggle((prev) => prev + 1);
  };

  const handleApplyFilters = (newFilters: DocumentoTipoContingenciaFilter) => {
    const cleanedFilters: DocumentoTipoContingenciaFilter = Object.fromEntries(
      Object.entries(newFilters).map(([key, value]) => [
        key,
        value === "" || value === null ? undefined : value,
      ]),
    ) as DocumentoTipoContingenciaFilter;

    setFilters(cleanedFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setIsFilterModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { currentPage, limit } = pagination;

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== undefined && value !== null && value !== "",
        ),
      );

      console.log({ cleanFilters });

      const filterString = cleanFilters.nombre
        ? String(cleanFilters.nombre)
        : "";

      console.log({ filterString });

      const response = await getDocumentosTipoContWithPaginate(
        currentPage,
        limit,
        cleanFilters,
      );

      console.log("response documentos", response);

      if (response.result && response.data && response.pagination) {
        setDocumentos(response.data);
        setPagination(response.pagination);
      } else {
        setDocumentos([]);
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
      console.error(
        "Error al obtener documentos por tipo de contingencia",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, filters, refreshToggle]);

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
        </PaginationItem>,
      );
    }

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
        </PaginationItem>,
      );
    }

    if (endPage < pagination.totalPages) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>,
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
          <span>
            Filtros (
            {
              Object.values(filters).filter(
                (v) => v !== undefined && v !== null && v !== "",
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
              <TableHead className="text-gray-600 font-medium">
                Tipo Contingencia
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Nombre
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Estado
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Opciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSpinner colSpan={4} />
            ) : documentos.length > 0 ? (
              documentos.map((documento) => (
                <DocumentoTipoContingenciaRow
                  key={documento.id}
                  documento={documento}
                  onStatusChange={handleDocumentoStatusChange}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 py-6"
                >
                  No se encontraron documentos registrados
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
                className="hover:bg-gray-200 transition-colors hover:cursor-pointer"
              >
                Anterior
              </PaginationPrevious>
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className="hover:bg-gray-200 hover:cursor-pointer transition-colors"
              >
                Siguiente
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <DocumentoTipoContingenciaFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
