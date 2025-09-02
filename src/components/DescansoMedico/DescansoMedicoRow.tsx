import React from "react";
import { DescansoMedico } from "@/interfaces/IDescansoMedico";
import { TableCell, TableRow } from "../ui/table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface Props {
  desc: DescansoMedico;
}

export const DescansoMedicoRow: React.FC<Props> = ({ desc }) => {
  const navigate = useNavigate();
  const colaborador = `${desc.colaborador.apellido_paterno} ${desc.colaborador.apellido_materno} ${desc.colaborador.nombres}`;

  const handleShowDetail = () => {
    navigate(`/descanso-medico/editar/${desc.id}`);
  };

  return (
    <TableRow key={desc.id} className="hover:bg-gray-50">
      <TableCell>{desc.codigo}</TableCell>
      <TableCell>{colaborador}</TableCell>
      <TableCell>{desc.fecha_inicio}</TableCell>
      <TableCell>{desc.fecha_final}</TableCell>
      <TableCell>{desc.total_dias}</TableCell>
      <TableCell>{desc.estado_registro}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleShowDetail}>
              Ver detalle
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
