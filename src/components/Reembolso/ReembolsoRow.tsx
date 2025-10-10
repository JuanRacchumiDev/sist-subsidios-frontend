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
import { Reembolso } from "@/interfaces/IReembolso";
import { Canje } from "@/interfaces/ICanje";
import { DescansoMedico } from "@/interfaces/IDescansoMedico";
import BadgeEstado from "../Common/BadgeEstado";
import { EReembolso } from "@/enums/EReembolso";

interface Props {
  reembolso: Reembolso;
}

export const ReembolsoRow: React.FC<Props> = ({ reembolso }) => {
  const navigate = useNavigate();

  const { canje } = reembolso;

  const dataCanje = canje as Canje;

  const { descansoMedico } = dataCanje;

  const dataDescansoMedico = descansoMedico as DescansoMedico;

  const { colaborador_dm: colaborador } = dataDescansoMedico;

  const { nombre_completo: nombreColaborador } = colaborador;

  const handleShowDetail = () => {
    navigate(`/reembolso/editar/${reembolso.id}`);
  };

  return (
    <TableRow
      key={reembolso.id}
      className="hover:bg-blue-100 hover:cursor-pointer transition-colors duration-200"
    >
      <TableCell className="py-3">{nombreColaborador}</TableCell>
      <TableCell className="py-3">
        {reembolso.fecha_reembolso
          ? HDate.formatDateTimezone(reembolso.fecha_reembolso, "dd/MM/yyyy")
          : ""}
      </TableCell>
      <TableCell className="py-3">
        {HDate.formatDateTimezone(
          reembolso.fecha_maxima_reembolso,
          "dd/MM/yyyy"
        )}
      </TableCell>
      <TableCell className="py-3">{reembolso.codigo}</TableCell>
      <TableCell className="py-3">{reembolso.numero_expediente}</TableCell>
      <TableCell className="py-3">
        <BadgeEstado estado={reembolso.estado_registro as EReembolso} />
      </TableCell>
      <TableCell className="py-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            // className="bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-300 cursor-pointer"
            className={`focus:outline-none focus:ring-2 z-40 focus:ring-gray-400 focus:border-transparent transition duration-300 cursor-pointer`}
          >
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú de acciones</span>
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="bg-white border shadow-lg"
          >
            <DropdownMenuLabel className="font-semibold text-gray-700">
              Acciones
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleShowDetail}
              className="cursor-pointer hover:bg-gray-100 transition-colors flex items-center space-x-2 text-blue-600"
              // className="cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Ver/Editar Detalle</span>
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 transition-colors">
              Eliminar
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
