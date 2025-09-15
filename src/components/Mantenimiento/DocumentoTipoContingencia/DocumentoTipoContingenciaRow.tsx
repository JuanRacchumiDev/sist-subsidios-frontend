import { DocumentoTipoContingencia } from "../../../interfaces/IDocumentoTipoContingencia";
import { TableCell, TableRow } from "../../ui/table";
import { CircleCheck, CircleX, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";

interface Props {
  documento: DocumentoTipoContingencia;
}

export const DocumentoTipoContingenciaRow: React.FC<Props> = ({
  documento,
}) => {
  const navigate = useNavigate();

  const handleShowDetail = () => {
    navigate(
      `/mantenimiento/documento-tipo-contingencia/editar/${documento.id}`
    );
  };

  return (
    <TableRow
      key={documento.id}
      className="hover:bg-blue-100 hover:cursor-pointer transition-colors duration-200"
    >
      <TableCell className="py-3">
        {documento.tipoContingencia.nombre}
      </TableCell>
      <TableCell className="py-3">{documento.nombre}</TableCell>
      <TableCell className="py-3">
        {documento.estado ? (
          <CircleCheck className="text-green-500 w-5 h-5" />
        ) : (
          <CircleX className="text-red-500 w-5 h-5" />
        )}
      </TableCell>
      <TableCell className="py-3">
        {/* w-72 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 */}
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
