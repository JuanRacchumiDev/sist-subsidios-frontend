import { useEffect, useMemo, useState } from "react";
import { ReembolsoRow } from "./ReelmbosoRow";
import { getAuthData } from "@/utils/authMemo";
import {
  Reembolso,
  ReembolsoPaginateResponse,
  Pagination as PaginationType,
} from "../../interfaces/IReembolso";
import {
  getReembolsos,
  getReembolsosWithPaginate,
} from "@/services/reembolsoService";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export const ReembolsoTable = () => {
  const [reembolsos, setReembolsos] = useState<Reembolso[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
    nextPage: null,
    previousPage: null,
  });

  const userProfile = useMemo(() => getAuthData()?.usuario, []);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { currentPage, limit } = pagination;
        const response = await getReembolsosWithPaginate(currentPage, limit);
        console.log("response reembolsos", response);

        const { result, data, pagination: detailtPagination } = response;

        if (result && data && detailtPagination) {
          setReembolsos(data as Reembolso[]);
          setPagination(detailtPagination);
        } else {
          setReembolsos([]);
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
        console.error("Error al obtener reembolsos", error);
      }
    };

    fetchData();
  }, [pagination.currentPage, pagination.limit]);

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
        <Input
          type="text"
          placeholder="Buscar por razón social o RUC"
          className="w-72 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
        />
      </div>
      <div className="rounded-md border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-gray-600 font-medium">
                Colaborador
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Fecha Reembolso
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Código
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Número de expediente
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
            {reembolsos.length > 0 ? (
              reembolsos.map((reembolso) => (
                <ReembolsoRow key={reembolso.id} reembolso={reembolso} />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-6"
                >
                  No se encontraron reembolsos registrados
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
    </div>
  );
};
