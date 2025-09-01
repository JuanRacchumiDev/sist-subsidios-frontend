import { Empresa } from "@/interfaces/IEmpresa";
import React from "react";
import { TableCell, TableRow } from "../ui/table";

interface Props {
  emp: Empresa;
}

export const EmpresaRow: React.FC<Props> = ({ emp }) => (
  <TableRow key={emp.id} className="hover:bg-gray-50 hover:cursor-pointer">
    <TableCell>{emp.nombre_o_razon_social}</TableCell>
    <TableCell>{emp.numero}</TableCell>
    <TableCell>{emp.direccion}</TableCell>
    <TableCell>{emp.estado}</TableCell>
    <TableCell>Opciones</TableCell>
  </TableRow>
);
