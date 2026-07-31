import { JSX, useCallback, useEffect, useState } from "react";
import { getPersonasPaginate } from "../../services/personaService";
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
import { TrabajadorSocialRow } from "./TrabajadorSocialRow";
import { TableSpinner } from "../../components/Common/TableSpinner";
import { Persona, Pagination as PaginationType } from "@/interfaces/IPersona";
import { ParametroClase } from "../../params/parametroClase";
import {
  TrabajadorSocialFilters,
  TrabajadorSocialFiltersData,
} from "./TrabajadorSocialFilters";

export const TrabajadorSocialTable: React.FC = ({}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trabajadoresSociales, setTrabajadoresSociales] = useState<Persona[]>(
    [],
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const [paginationInfo, setPaginationInfo] = useState<
    Omit<PaginationType, "currentPage" | "limit">
  >({
    totalPages: 1,
    totalItems: 0,
    nextPage: null,
    previousPage: null,
  });

  const [searchFilters, setSearchFilters] =
    useState<TrabajadorSocialFiltersData>({
      search: "",
      documento: "",
    });

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
    }
  };

  const fetchData = useCallback(
    async (pageToFetch: number, filtersData: TrabajadorSocialFiltersData) => {
      setIsLoading(true);

      const filters = {
        parametro_clase: ParametroClase.GRUPO,
        search: filtersData.search,
        numero_documento: filtersData.documento,
        nombreGrupo: "GRUPO TRABAJADOR SOCIAL",
      };

      try {
        const response = await getPersonasPaginate(pageToFetch, limit, filters);

        const { result, data, pagination: newPagination } = response;

        if (result && data) {
          setTrabajadoresSociales(data as Persona[]);

          if (newPagination) {
            setPaginationInfo({
              totalPages: newPagination.totalPages || 1,
              totalItems: newPagination.totalItems || 0,
              nextPage: newPagination.nextPage,
              previousPage: newPagination.previousPage,
            });
          }
        } else {
          setTrabajadoresSociales([]);
        }
      } catch (error) {
        console.error("Error al obtener trabajadores sociales", error);
      } finally {
        setIsLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    fetchData(currentPage, searchFilters);
  }, [currentPage, searchFilters, fetchData]);

  const handleSearchSubmit = (newFilters: TrabajadorSocialFiltersData) => {
    setSearchFilters(newFilters);
    setCurrentPage(1);
  };

  const renderPaginationItems = (): JSX.Element[] => {
    const items: JSX.Element[] = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(paginationInfo.totalPages, currentPage + 2);

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
            isActive={i === currentPage}
            className={`h-7 w-7 text-xs rounded-md font-medium cursor-pointer ${
              i === currentPage
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "hover:bg-slate-100 text-slate-600 transition-colors"
            }`}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < paginationInfo.totalPages) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }
    return items;
  };

  return (
    <div className="w-full space-y-3">
      <div className="bg-white overflow-hidden">
        <TrabajadorSocialFilters onSearch={handleSearchSubmit} />

        <div className="overflow-x-auto border-t border-slate-100">
          <Table className="w-full text-left border-collapse">
            <TableHeader>
              <TableRow className="bg-slate-50/75 hover:bg-slate-50/75 border-b border-slate-200">
                <TableHead className="w-[15%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Tipo Documento
                </TableHead>
                <TableHead className="w-[15%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Número documento
                </TableHead>
                <TableHead className="w-[32%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Nombres y apellidos
                </TableHead>
                <TableHead className="w-[15%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Empresa
                </TableHead>
                <TableHead className="w-[8%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Teléfono
                </TableHead>
                <TableHead className="w-[7%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider text-center">
                  Estado
                </TableHead>
                <TableHead className="w-[8%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableSpinner colSpan={7} />
              ) : trabajadoresSociales.length > 0 ? (
                trabajadoresSociales.map((trabajadorSocial) => (
                  <TrabajadorSocialRow
                    key={trabajadorSocial.id}
                    trabajadorSocial={trabajadorSocial}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-1">
                      <span className="text-xs font-medium text-slate-600">
                        No se encontraron registros
                      </span>
                      <p className="text-[11px]">
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 pb-3">
        <div className="text-[11px] text-slate-500 font-medium">
          Mostrando{" "}
          <span className="text-slate-800 font-semibold">
            {trabajadoresSociales.length}
          </span>{" "}
          registros de este grupo
        </div>

        <Pagination className="justify-end w-auto m-0">
          <PaginationContent className="gap-0.5">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={`h-7 px-2 text-xs rounded-md border border-slate-200 text-slate-600 cursor-pointer transition-colors hover:bg-slate-50 hover:text-slate-900 ${
                  currentPage === 1 ? "pointer-events-none opacity-30" : ""
                }`}
              />
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={`h-7 px-2 text-xs rounded-md border border-slate-200 text-slate-600 cursor-pointer transition-colors hover:bg-slate-50 hover:text-slate-900 ${
                  currentPage === paginationInfo.totalPages
                    ? "pointer-events-none opacity-30"
                    : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
