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
import { Reembolso } from "../../interfaces/IReembolso";
import BadgeEstado from "../Common/BadgeEstado";
import { EReembolso } from "../../enums/EReembolso";

interface Props {
  reembolso: Reembolso;
}

export const ReembolsoRow: React.FC<Props> = ({ reembolso }) => {
  console.log({ reembolso });

  const navigate = useNavigate();

  const handleShowDetail = () => {
    navigate(`/reembolso/editar/${reembolso.id}`);
  };

  return (
    <TableRow
      key={reembolso.id}
      className="hover:bg-slate-50/80 hover:cursor-pointer transition-colors duration-150 border-b border-slate-100"
    >
      <TableCell className="py-2 px-3 text-xs text-slate-500">
        {reembolso.nombre_colaborador}
      </TableCell>

      <TableCell className="py-2 px-3 text-xs text-slate-500">
        {reembolso.canje.fecha_inicio_subsidio
          ? HDate.formatDateTimezone(
              reembolso.canje.fecha_inicio_subsidio,
              "dd/MM/yyyy",
            )
          : "--/--/--"}
      </TableCell>

      <TableCell className="py-2 px-3 text-xs text-slate-500">
        {reembolso.canje.fecha_final_subsidio
          ? HDate.formatDateTimezone(
              reembolso.canje.fecha_final_subsidio,
              "dd/MM/yyyy",
            )
          : "--/--/--"}
      </TableCell>

      <TableCell className="py-2 px-3 text-xs text-slate-500">
        {reembolso.canje.total_dias ? reembolso.canje.total_dias : 0}
      </TableCell>

      <TableCell className="py-2 px-3 text-xs text-slate-500">
        {reembolso.fecha_solicitud
          ? HDate.formatDateTimezone(reembolso.fecha_solicitud, "dd/MM/yyyy")
          : "--/--/--"}
      </TableCell>

      <TableCell className="py-2 px-3 text-xs text-slate-500">
        {reembolso.valor_dia ? reembolso.valor_dia : 0.0}
      </TableCell>

      <TableCell className="py-2 px-3 text-xs text-slate-500">
        {reembolso.fecha_maxima_reembolso
          ? HDate.formatDateTimezone(
              reembolso.fecha_maxima_reembolso,
              "dd/MM/yyyy",
            )
          : "--/--/--"}
      </TableCell>

      <TableCell className="py-2 px-3 text-xs text-slate-500">
        <BadgeEstado estado={reembolso.estado_registro as EReembolso} />
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
