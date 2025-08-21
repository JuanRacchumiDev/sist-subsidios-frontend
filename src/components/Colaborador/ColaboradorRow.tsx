import { getStatusBadge } from "../../utils/statusBadge";
import { Colaborador } from "../../interfaces/IColaborador";
import { TableCell, TableRow } from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface Props {
  col: Colaborador;
  onCrearUsuario: (col: Colaborador) => void;
}

export const ColaboradorRow: React.FC<Props> = ({ col, onCrearUsuario }) => (
  <TableRow key={col.id} className="hover:bg-gray-50">
    <TableCell>{col.tipoDocumento.abreviatura}</TableCell>
    <TableCell>{col.numero_documento}</TableCell>
    <TableCell>{col.nombre_completo}</TableCell>
    <TableCell>{col.empresa.nombre_o_razon_social}</TableCell>
    <TableCell>{col.numero_celular}</TableCell>
    <TableCell>{getStatusBadge(col.estado)}</TableCell>
    <TableCell>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-1">
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onCrearUsuario(col)}>
            Crear usuario
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
);
