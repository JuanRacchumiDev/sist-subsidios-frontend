import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
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
} from "../../interfaces/IDescansoMedico";
import { DescansoMedicoRow } from "./DescansoMedicoRow";
import { getAuthData } from "../../utils/authMemo";

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

  const userProfile = useMemo(() => getAuthData()?.usuario, []);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response: DescansoMedicoPaginateResponse = null;

        const { slug_perfil, id_colaborador } = userProfile;

        const { currentPage, limit } = pagination;

        if (slug_perfil && id_colaborador) {
          response = await getDescansosByColaboradorWithPaginate(
            id_colaborador,
            currentPage,
            limit
          );
        } else {
          response = await getDescansosWithPaginate(currentPage, limit);
        }

        console.log("response list descansos médicos", response);

        // const response = await getDescansosWithPaginate(currentPage, limit);

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
        {/* <h2 className="text-xl font-semibold">Listado de descansos médicos</h2> */}
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
                Código
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Colaborador
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
                Estado
              </TableHead>
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
                  colSpan={7}
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
    </div>
  );
};
