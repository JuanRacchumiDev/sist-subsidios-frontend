import { useCallback, useEffect, useState } from "react";
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
  Usuario,
  Pagination as PaginationType,
  UsuarioFilter,
} from "../../interfaces/IUsuario";
import { UsuarioRow } from "./UsuarioRow";
import { getUsuariosWithPaginate } from "../../services/usuarioService";
import { Button } from "../ui/button";
import { FilterIcon } from "lucide-react";
import { UsuarioFilterModal } from "./UsuarioFilterModal";
import { TableSpinner } from "../Common/TableSpinner";

const initialFilters: UsuarioFilter = {
  id_perfil: undefined,
  nombre_persona: undefined,
  username: undefined,
  email: undefined,
};

export const UsuarioTable = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
    nextPage: null,
    previousPage: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<UsuarioFilter>(initialFilters);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(0);

  const handleUsuarioStatusChange = () => {
    setRefreshToggle((prev) => prev + 1);
  };

  const handleApplyFilters = (newFilters: UsuarioFilter) => {
    const cleanedFilters: UsuarioFilter = Object.fromEntries(
      Object.entries(newFilters).map(([key, value]) => [
        key,
        value === "" || value === null ? undefined : value,
      ]),
    ) as UsuarioFilter;

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
      ) as UsuarioFilter;

      console.log({ cleanFilters });

      const response = await getUsuariosWithPaginate(
        currentPage,
        limit,
        cleanFilters,
      );

      console.log({ response });

      const { result, data, pagination: detailPagination } = response;

      if (result && data && detailPagination) {
        setUsuarios(data);
        setPagination(detailPagination);
      } else {
        setUsuarios([]);
      }
    } catch (error) {
      console.error("Error al obtener usuarios", error);
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
                Nombre de Usuario
              </TableHead>
              <TableHead className="text-gray-600 font-medium">Email</TableHead>
              <TableHead className="text-gray-600 font-medium">
                Perfil
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Estado
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSpinner colSpan={5} />
            ) : usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <UsuarioRow
                  key={usuario.id}
                  usuario={usuario}
                  onStatusChange={handleUsuarioStatusChange}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-6"
                >
                  No se encontraron usuarios registrados
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

      <UsuarioFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
