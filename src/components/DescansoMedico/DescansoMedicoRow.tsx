import React from "react";
import { DescansoMedico } from "../../interfaces/IDescansoMedico";
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
import HDate from "../../helpers/HDate";
// import { formatDate } from "date-fns";

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
    <TableRow
      key={desc.id}
      className="hover:bg-blue-100 hover:cursor-pointer transition-colors duration-200"
    >
      <TableCell className="py-3">{desc.codigo}</TableCell>
      <TableCell className="py-3">{colaborador}</TableCell>
      <TableCell className="py-3">
        {HDate.formatDateLocal(desc.fecha_inicio)}
      </TableCell>
      <TableCell className="py-3">
        {HDate.formatDateLocal(desc.fecha_final)}
      </TableCell>
      <TableCell className="py-3">{desc.total_dias}</TableCell>
      <TableCell className="py-3">{desc.estado_registro}</TableCell>
      <TableCell className="py-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-300 cursor-pointer"
          >
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-400">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={handleShowDetail}
              className="cursor-pointer hover:bg-gray-100 transition-colors"
            >
              Ver detalle
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 transition-colors">
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
