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
import { Canje } from "@/interfaces/ICanje";
import BadgeEstado from "../Common/BadgeEstado";
import { ECanje } from "@/enums/ECanje";

interface Props {
  canje: Canje;
}

export const CanjeRow: React.FC<Props> = ({ canje }) => {
  const navigate = useNavigate();
  const colaborador = `${canje.descansoMedico.colaborador_dm.apellido_paterno} ${canje.descansoMedico.colaborador_dm.apellido_materno} ${canje.descansoMedico.colaborador_dm.nombres}`;

  const handleShowDetail = () => {
    navigate(`/canje/editar/${canje.id}`);
  };

  // Clases condicionales para el estado "deshabilitado"
  const rowDisabledClasses = canje.is_reembolsable
    ? "hover:bg-blue-100 hover:cursor-pointer transition-colors duration-200"
    : "bg-gray-100 text-gray-500 cursor-not-allowed";
  const textDisabledClasses = canje.is_reembolsable
    ? "text-gray-900"
    : "text-gray-500";
  const highlightClasses = "text-center";

  return (
    <TableRow key={canje.id} className={rowDisabledClasses}>
      <TableCell className={`py-3 ${textDisabledClasses}`}>
        {colaborador}
      </TableCell>

      <TableCell
        className={`py-3 ${highlightClasses} text-gray-700 bg-gray-50 border-r border-gray-200`}
      >
        {HDate.formatDateTimezone(canje.fecha_otorgamiento, "dd/MM/yyyy")}
      </TableCell>

      <TableCell
        className={`py-3 ${highlightClasses} text-gray-700 bg-gray-50 border-r border-gray-200`}
      >
        {HDate.formatDateTimezone(canje.fecha_inicio_subsidio, "dd/MM/yyyy")}
      </TableCell>

      <TableCell
        className={`py-3 ${highlightClasses} text-indigo-600 bg-indigo-50 border-r border-indigo-200`}
      >
        {HDate.formatDateTimezone(canje.fecha_final_subsidio, "dd/MM/yyyy")}
      </TableCell>

      <TableCell
        className={`py-3 ${highlightClasses} text-xl text-blue-600 bg-blue-50 border-r border-blue-200`}
      >
        {canje.total_dias}
      </TableCell>

      <TableCell
        className={`py-3 ${highlightClasses} text-orange-600 bg-orange-50 border-r border-orange-200`}
      >
        {HDate.formatDateTimezone(canje.fecha_maxima_canje, "dd/MM/yyyy")}
      </TableCell>

      <TableCell className={`py-3 ${highlightClasses} text-gray-700`}>
        {canje.nombre_tipodescansomedico}
      </TableCell>

      <TableCell className={`py-3 ${highlightClasses} text-gray-700`}>
        {canje.nombre_tipocontingencia}
      </TableCell>

      <TableCell className={`py-3 ${highlightClasses} text-gray-700`}>
        {canje.mes_devengado}
      </TableCell>

      <TableCell className="py-3">
        <BadgeEstado estado={canje.estado_registro as ECanje} />
      </TableCell>

      <TableCell
        className={`py-3 font-semibold ${
          canje.is_reembolsable ? "text-green-600" : "text-red-600"
        }`}
      >
        {canje.is_reembolsable ? <span>SI</span> : <span>NO</span>}
      </TableCell>

      <TableCell className="py-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            // Deshabilitar el botón si no es reembolsable
            disabled={!canje.is_reembolsable}
            className={`focus:outline-none focus:ring-2 z-40 focus:ring-gray-400 focus:border-transparent transition duration-300 cursor-pointer ${
              !canje.is_reembolsable && "opacity-50 cursor-not-allowed"
            }`}
            // className={`bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-300 ${
            //   !canje.is_reembolsable && "opacity-50 cursor-not-allowed"
            // }`}
            // className="bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-300 cursor-pointer"
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
