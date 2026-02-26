import {
  Cargo,
  Pagination as PaginationType,
} from "../../../interfaces/ICargo";
import { getDetallesWithPaginate } from "../../../services/detalleParametroService";
import React, { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { CargoRow } from "./CargoRow";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { TableSpinner } from "../../../components/Common/TableSpinner";
import { ParametroClase } from "../../../constants/parametroClase";

export const CargoTable: React.FC = () => {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
    nextPage: null,
    previousPage: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [refreshToggle, setRefreshToggle] = useState(0);

  const handleCargoStatusChange = () => {
    setRefreshToggle((prev) => prev + 1);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  const applySearch = () => {
    setFilterQuery(searchTerm);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      applySearch();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { currentPage, limit } = pagination;

        console.log({ pagination });
        console.log(ParametroClase.CARGO);
        console.log({ filterQuery });

        const response = await getDetallesWithPaginate(
          ParametroClase.CARGO,
          currentPage,
          limit,
          filterQuery,
        );

        console.log("---- response listCargos ----");
        console.log({ response });

        if (response.result && response.data && response.pagination) {
          setCargos(response.data);
          setPagination(response.pagination);
        } else {
          setCargos([]);
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
        console.error("Error al obtener cargos", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pagination.currentPage, pagination.limit, filterQuery, refreshToggle]);

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
        <Input
          type="text"
          placeholder="Buscar por nombre"
          className="w-72 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          onClick={applySearch}
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md flex items-center space-x-2"
        >
          <Search className="h-4 w-4" />
          <span>Buscar</span>
        </Button>
      </div>
      <div className="rounded-md border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-gray-600 font-medium">
                Nombre
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
              <TableSpinner colSpan={3} />
            ) : cargos.length > 0 ? (
              cargos.map((cargo) => (
                <CargoRow
                  key={cargo.id}
                  cargo={cargo}
                  onStatusChange={handleCargoStatusChange}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-gray-500 py-6"
                >
                  No se encontraron cargos registrados
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
    </div>
  );
};
