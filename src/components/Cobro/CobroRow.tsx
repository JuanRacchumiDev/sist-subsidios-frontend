import React from "react";
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
import { Cobro } from "@/interfaces/ICobro";
import BadgeEstado from "../Common/BadgeEstado";
import { ECobro } from "@/enums/ECobro";

interface Props {
  cobro: Cobro;
}

export const CobroRow: React.FC<Props> = ({ cobro }) => {
  const navigate = useNavigate();
  const colaborador = `
    ${cobro.reembolso.canje.descansoMedico.colaborador_dm.apellido_paterno}
    ${cobro.reembolso.canje.descansoMedico.colaborador_dm.apellido_materno}
    ${cobro.reembolso.canje.descansoMedico.colaborador_dm.nombres}`;

  const handleShowDetail = () => {
    navigate(`/cobro/editar/${cobro.id}`);
  };

  return (
    <TableRow
      key={cobro.id}
      className="hover:bg-blue-100 hover:cursor-pointer transition-colors duration-200"
    >
      <TableCell className="py-3">{colaborador}</TableCell>
      <TableCell className="py-3">{cobro.codigo_cheque}</TableCell>
      <TableCell className="py-3">{cobro.codigo_voucher}</TableCell>
      <TableCell className="py-3">{cobro.fecha_cobro}</TableCell>
      <TableCell className="py-3">
        <BadgeEstado estado={cobro.estado_registro as ECobro} />
      </TableCell>
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
