import React, { useMemo, useCallback, useEffect, useState } from "react";
// import { getColaboradoresWithPaginate } from "../../services/colaboradorService";
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
// import { ColaboradorRow } from "./ColaboradorRow";
// import {
//   Colaborador,
//   ColaboradorFilter,
//   Pagination as PaginationType,
// } from "../../interfaces/IColaborador";
import {
  Persona,
  PersonaFilter,
  Pagination as PaginationType,
} from "../../interfaces/IPersona";
import { Button } from "../ui/button";
import { FilterIcon } from "lucide-react";
import { ColaboradorFilterModal } from "./ColaboradorFilterModal";
import { TableSpinner } from "../../components/Common/TableSpinner";
import { ColaboradorRow } from "./ColaboradorRow";
import { getPersonasWithPaginate } from "../../services/personaService";
import { getAuthData } from "../../utils/authMemo";

// Definimos el estado inicial de los filtros
// const initialFilters: ColaboradorFilter = {
//   id_tipodocumento: undefined,
//   id_cargo: undefined,
//   id_empresa: undefined,
//   numero_documento: undefined,
//   nombre_completo: undefined,
// };

const initialFilters: PersonaFilter = {
  id_tipodocumento: undefined,
  // id_cargo: undefined,
  // id_empresa: undefined,
  numero_documento: undefined,
  nombre_completo: undefined,
};

export const ColaboradorTable: React.FC = () => {
  // const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [colaboradores, setColaboradores] = useState<Persona[]>([]);

  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
    nextPage: null,
    previousPage: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  // const [filters, setFilters] = useState<ColaboradorFilter>(initialFilters);
  const [filters, setFilters] = useState<PersonaFilter>(initialFilters);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(0);

  const userProfile = useMemo(() => getAuthData()?.usuario, []);

  const { id_empresa, nombre_perfil_url } = userProfile;

  const handleColaboradorStatusChange = () => {
    // Incrementa el toggle. Esto NO cambia la tabla, pero fuerza el useEffect a ejecutarse.
    setRefreshToggle((prev) => prev + 1);
  };

  const handleApplyFilters = (newFilters: PersonaFilter) => {
    // Asegurar que las cadenas vacías de los Inputs se conviertan a `undefined` al aplicar
    const cleanedFilters: PersonaFilter = Object.fromEntries(
      Object.entries(newFilters).map(([key, value]) => [
        key,
        value === "" || value === null ? undefined : value,
      ]),
    ) as PersonaFilter;

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
          ([, value]) => value !== undefined && value !== null && value !== "",
        ),
      ) as PersonaFilter;

      cleanFilters["nombreGrupo"] = "GRUPO COLABORADOR";

      if (id_empresa && nombre_perfil_url === "especialista-empresa") {
        cleanFilters["id_empresa"] = id_empresa;
      }

      console.log({ cleanFilters });

      // const response = await getColaboradoresWithPaginate(
      //   currentPage,
      //   limit,
      //   cleanFilters
      // );

      const response = await getPersonasWithPaginate(
        currentPage,
        limit,
        cleanFilters,
      );

      console.log({ response });

      if (response.result && response.data && response.pagination) {
        setColaboradores(response.data);
        setPagination(response.pagination);
      } else {
        setColaboradores([]);
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
    } finally {
      setIsLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, filters, refreshToggle]);

  // fetchData();
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
        </PaginationItem>,
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
      {/* <div className="pb-4 pt-4 flex justify-between items-center"> */}
      <div className="flex justify-end items-center space-x-2 pb-4">
        {/* <h2 className="text-xl font-semibold">Listado de colaboradores</h2> */}
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
        {/* <Input
          type="text"
          placeholder="Buscar por nombre o documento..."
          className="w-72 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
        /> */}
      </div>
      <div className="rounded-md border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-gray-600 font-medium">
                Tipo Documento
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Número Documento
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Nombres y Apellidos
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Empresa
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Teléfono
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
              <TableSpinner colSpan={7} />
            ) : colaboradores.length > 0 ? (
              colaboradores.map((col) => (
                <ColaboradorRow
                  key={col.id}
                  col={col}
                  onStatusChange={handleColaboradorStatusChange}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 py-6"
                >
                  No se encontraron colaboradores registrados
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

      <ColaboradorFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
