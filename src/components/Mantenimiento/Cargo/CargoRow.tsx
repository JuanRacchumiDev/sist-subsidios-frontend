import { Cargo } from "@/interfaces/ICargo";
import React from "react";
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
  cargo: Cargo;
}

export const CargoRow: React.FC<Props> = ({ cargo }) => {
  const navigate = useNavigate();

  const handleShowDetail = () => {
    navigate(`/mantenimiento/cargo/editar/${cargo.id}`);
  };

  return (
    <TableRow key={cargo.id} className="hover:bg-gray-50">
      <TableCell className="font-medium">{cargo.id}</TableCell>
      <TableCell>{cargo.nombre}</TableCell>
      <TableCell>
        {cargo.estado ? (
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
