import React, { useEffect, useState } from "react";
import { getDocumentosTipoContWithPaginate } from "../../../services/documentoTipoContService";
import { Input } from "../../ui/input";
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
import {
  DocumentoTipoContingencia,
  Pagination as PaginationType,
} from "../../../interfaces/IDocumentoTipoContingencia";

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

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { currentPage, limit } = pagination;

        const response = await getDocumentosTipoContWithPaginate(
          currentPage,
          limit
        );

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
          error
        );
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

    for (let i = 1; i < pagination.totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === pagination.currentPage}
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
    <div className="w-full space-y-4">
      <div className="pb-4 pt-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Listado de documentos</h2>
        <Input
          type="text"
          placeholder="Buscar por nombre o documento..."
          className="w-72"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo Contingencia</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentos.length > 0 ? (
              documentos.map((documento) => (
                <DocumentoTipoContingenciaRow
                  key={documento.id}
                  documento={documento}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 py-6"
                >
                  No se encontraron documentos registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Anterior
              </PaginationPrevious>
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pagination.currentPage + 1)}
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
