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
    <TableRow key={documento.id} className="hover:bg-gray-50">
      <TableCell>{documento.tipoContingencia.nombre}</TableCell>
      <TableCell>{documento.nombre}</TableCell>
      <TableCell>
        {documento.estado ? (
          <CircleCheck className="text-green-500" />
        ) : (
          <CircleX className="text-red-500" />
        )}
      </TableCell>
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
