import React from "react";
import { TableCell, TableRow } from "../ui/table";
import { Edit, MoreHorizontal } from "lucide-react";
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
import { Cobro } from "../../interfaces/ICobro";
import BadgeEstado from "../Common/BadgeEstado";
import { ECobro } from "../../enums/ECobro";

interface Props {
  cobro: Cobro;
}

export const CobroRow: React.FC<Props> = ({ cobro }) => {
  console.log({ cobro });

  const navigate = useNavigate();

  const handleShowDetail = () => {
    navigate(`/cobro/editar/${cobro.id}`);
  };

  return (
    <TableRow
      key={cobro.id}
      className="hover:bg-slate-50/80 hover:cursor-pointer transition-colors duration-150 border-b border-slate-100"
    >
      <TableCell className="py-2 px-3 text-xs text-slate-500">
        {cobro?.reembolso?.nombre_colaborador}
      </TableCell>

      <TableCell className="py-2 px-3 text-xs text-slate-500">
        {cobro.fecha_maxima_cobro
          ? HDate.formatDateTimezone(cobro.fecha_maxima_cobro, "dd/MM/yyyy")
          : "--/--/--"}
      </TableCell>

      <TableCell className="py-2 px-3 text-xs text-slate-500">
        {cobro.fecha_cobro
          ? HDate.formatDateTimezone(cobro.fecha_cobro, "dd/MM/yyyy")
          : "--/--/--"}
      </TableCell>

      <TableCell className="py-2 px-3 text-xs text-slate-500">
        {cobro.codigo_voucher && cobro.codigo_voucher.trim() !== ""
          ? cobro.codigo_voucher
          : "--"}
      </TableCell>

      <TableCell className="py-2 px-3 text-xs text-slate-500">
        <BadgeEstado estado={cobro.estado_registro as ECobro} />
      </TableCell>

      <TableCell className="py-2 px-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-7 w-7 p-0 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:ring-offset-0"
            >
              <span className="sr-only">Abrir menú de acciones</span>
              <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="bg-white border border-slate-200 shadow-md min-w-[140px] text-xs p-1 rounded-md"
          >
            <DropdownMenuLabel className="font-medium text-slate-400 px-2 py-1 text-[10px] uppercase tracking-wider">
              Acciones
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />

            <DropdownMenuItem
              onClick={handleShowDetail}
              className="cursor-pointer hover:bg-slate-50 rounded-sm py-1 px-2 flex items-center gap-2 text-slate-700"
            >
              <Edit className="h-3.5 w-3.5 text-slate-400" />
              <span>Ver/Editar detalle</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
