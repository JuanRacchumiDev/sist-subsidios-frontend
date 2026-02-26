import React from "react";
import { DescansoMedico } from "../../interfaces/IDescansoMedico";
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
import BadgeEstado from "../Common/BadgeEstado";
import { EDescansoMedico } from "../../enums/EDescansoMedico";

interface Props {
  desc: DescansoMedico;
}

export const DescansoMedicoRow: React.FC<Props> = ({ desc }) => {
  const navigate = useNavigate();
  const colaborador = `${desc.apellido_paterno_colaborador} ${desc.apellido_materno_colaborador} ${desc.nombres_colaborador}`;

  const handleShowDetail = () => {
    navigate(`/descanso-medico/editar/${desc.id}`);
  };

  return (
    <TableRow
      key={desc.id}
      className="hover:bg-blue-100 hover:cursor-pointer transition-colors duration-200"
    >
      <TableCell className="py-3">
        {desc.nombres_colaborador} {desc.apellido_paterno_colaborador}{" "}
        {desc.apellido_materno_colaborador}
      </TableCell>
      <TableCell className="py-3">
        {HDate.formatDateTimezone(desc.fecha_otorgamiento, "dd/MM/yyyy")}
      </TableCell>
      <TableCell className="py-3 font-semibold text-sm text-gray-700 bg-purple-100 border-r border-purple-200">
        {HDate.formatDateTimezone(desc.fecha_inicio, "dd/MM/yyyy")}
      </TableCell>
      <TableCell className="py-3 font-semibold text-sm text-gray-700 bg-purple-100 border-r border-purple-200">
        {HDate.formatDateTimezone(desc.fecha_final, "dd/MM/yyyy")}
      </TableCell>
      <TableCell className="py-3 font-bold text-center text-lg text-blue-600 bg-blue-50 border-r border-blue-200">
        {desc.total_dias}
      </TableCell>
      <TableCell className="py-3">{desc.nombre_tipodescansomedico}</TableCell>
      <TableCell className="py-3">{desc.nombre_tipocontingencia}</TableCell>
      <TableCell className="py-3">{desc.mes_devengado}</TableCell>
      <TableCell className="py-3">{desc.anio_fecha_inicio}</TableCell>
      <TableCell className="py-3">
        <BadgeEstado estado={desc.estado_registro as EDescansoMedico} />
      </TableCell>
      <TableCell className="py-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="focus:outline-none focus:ring-2 z-40 focus:ring-gray-400 focus:border-transparent transition duration-300 cursor-pointer"
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
            >
              <Edit className="h-4 w-4" />
              <span>Ver/Editar Detalle</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
