import { JSX, useCallback, useEffect, useState, useMemo } from "react";
import { getDescansosPaginate } from "../../services/descansoMedicoService";
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
import { DescansoMedicoRow } from "./DescansoMedicoRow";
import { TableSpinner } from "../../components/Common/TableSpinner";
import {
  DescansoMedico,
  Pagination as PaginationType,
} from "../../interfaces/IDescansoMedico";
import {
  DescansoMedicoFilters,
  DescansoMedicoFiltersData,
} from "./DescansoMedicoFilters";
import { getAuthData } from "../../utils/authMemo";

export const DescansoMedicoTable: React.FC = ({}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [descansos, setDescansos] = useState<DescansoMedico[]>([]);

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

  const [searchFilters, setSearchFilters] = useState<DescansoMedicoFiltersData>(
    {
      id_tipodescansomedico: "",
      id_tipocontingencia: "",
      search: "",
      fecha_inicio: "",
      fecha_final: "",
    },
  );

  const userProfile = useMemo(() => getAuthData()?.usuario, []);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
    }
  };

  const fetchData = useCallback(
    async (pageToFetch: number, filtersData: DescansoMedicoFiltersData) => {
      let filters = {
        id_empresa: "",
        id_tipodescansomedico: filtersData.id_tipodescansomedico,
        id_tipocontingencia: filtersData.id_tipocontingencia,
        search: filtersData.search,
        fecha_inicio: filtersData.fecha_inicio,
        fecha_final: filtersData.fecha_final,
        nombreGrupo: "COLABORADOR",
        user_crea: "",
      };

      const { nombre_perfil_url, id_empresa, id_usuario } = userProfile;

      if (nombre_perfil_url === "especialista-empresa") {
        filters["id_empresa"] = id_empresa;
      } else if (nombre_perfil_url === "colaborador") {
        filters["user_crea"] = id_usuario;
      }

      try {
        const response = await getDescansosPaginate(
          pageToFetch,
          limit,
          filters,
        );

        const { result, data, pagination: newPagination } = response;

        if (result && data) {
          setDescansos(data as DescansoMedico[]);

          if (newPagination) {
            setPaginationInfo({
              totalPages: newPagination.totalPages || 1,
              totalItems: newPagination.totalItems || 0,
              nextPage: newPagination.nextPage,
              previousPage: newPagination.previousPage,
            });
          }
        } else {
          setDescansos([]);
        }
      } catch (error) {
        console.error("Error al obtener descansos médicos", error);
      } finally {
        setIsLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    fetchData(currentPage, searchFilters);
  }, [currentPage, searchFilters, fetchData]);

  const handleSearchSubmit = (newFilters: DescansoMedicoFiltersData) => {
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
        <DescansoMedicoFilters onSearch={handleSearchSubmit} />

        <div className="overflow-x-auto border-t border-slate-100">
          <Table className="w-full text-left border-collapse">
            <TableHeader>
              <TableRow className="bg-slate-50/75 hover:bg-slate-50/75 border-b border-slate-200">
                <TableHead className="w-[15%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Colaborador
                </TableHead>
                <TableHead className="w-[15%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Fecha otorgamiento
                </TableHead>
                <TableHead className="w-[32%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Fecha Inicio
                </TableHead>
                <TableHead className="w-[15%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Fecha Final
                </TableHead>
                <TableHead className="w-[8%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Total días
                </TableHead>
                <TableHead className="w-[8%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Tipo descanso
                </TableHead>
                <TableHead className="w-[8%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Tipo contingencia
                </TableHead>
                <TableHead className="w-[8%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Mes devengado
                </TableHead>
                <TableHead className="w-[8%] py-2.5 px-3 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                  Año
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
                <TableSpinner colSpan={11} />
              ) : descansos.length > 0 ? (
                descansos.map((descanso) => (
                  <DescansoMedicoRow key={descanso.id} descanso={descanso} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
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

      {/* Sección inferior de paginación más integrada y limpia */}
      <div className="flex items-center justify-between px-3 pb-3">
        <div className="text-[11px] text-slate-500 font-medium">
          Mostrando{" "}
          <span className="text-slate-800 font-semibold">
            {descansos.length}
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
