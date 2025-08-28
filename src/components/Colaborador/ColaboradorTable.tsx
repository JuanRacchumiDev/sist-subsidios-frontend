import React, { useEffect, useState } from "react";
import { getColaboradores } from "../../services/colaboradorService";

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
import { ColaboradorRow } from "./ColaboradorRow";
import { Colaborador } from "../../interfaces/IColaborador";

export const ColaboradorTable: React.FC = () => {
  const [colaborador, setColaborador] = useState<Colaborador[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColaborador, setSelectedColaborador] =
    useState<Colaborador | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data: Colaborador[] = [];
        const responseColaborador = await getColaboradores();
        const { result: resultColaborador, data: dataColaborador } =
          responseColaborador;
        if (resultColaborador && dataColaborador) {
          data = dataColaborador as Colaborador[];
        }
        console.log("data colaboradores", data);
        setColaborador(data);
      } catch (error) {
        console.error("Error al obtener colaboradores", error);
      }
    };

    fetchData();
  }, []);

  const handleCrearUsuarioClick = (col: Colaborador) => {
    setSelectedColaborador(col);
    setModalOpen(true);
  };

  // const handleSubmitUsuario = (usuarioData) => {
  //   // console.log("Crear usuario con datos:", usuarioData);
  //   setModalOpen(false);
  // };

  return (
    <div className="w-full space-y-4">
      <div className="pb-4 pt-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Listado de colaboradores</h2>
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
              <TableHead>DNI/CE</TableHead>
              <TableHead>Número Documento</TableHead>
              <TableHead>Nombres y Apellidos</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colaborador.length > 0 ? (
              colaborador.map((col) => (
                <ColaboradorRow
                  key={col.id}
                  col={col}
                  onCrearUsuario={handleCrearUsuarioClick}
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
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
