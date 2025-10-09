import { Empresa, EmpresaResponse } from "../../interfaces/IEmpresa";
import React, { useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import {
  CircleCheck,
  CircleX,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Edit,
  AlertTriangle,
} from "lucide-react";
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
import { updateEmpresaByEstado } from "../../services/empresaService";
import { useToast } from "../../context/ToastContext";
import { ConfirmDialog } from "../Common/ConfirmDialog";

interface Props {
  emp: Empresa;
  onStatusChange?: (empresaId: string) => void;
}

export const EmpresaRow: React.FC<Props> = ({ emp, onStatusChange }) => {
  const { showToast } = useToast();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // ⬅️ Estado para el modal
  const [isProcessing, setIsProcessing] = useState(false); // ⬅️ Estado para el loading

  const navigate = useNavigate();

  const nuevoEstado = !emp.estado;
  const action = nuevoEstado ? "activar" : "desactivar";
  const modalTitle = `${
    action.charAt(0).toUpperCase() + action.slice(1)
  } Empresa`;
  const modalMessage = `¿Deseas <strong>${action}</strong> la empresa: <strong>${emp.nombre_o_razon_social}</strong>?`;
  // const modalMessage = `Estás a punto de **${action}** la empresa: **${emp.nombre_o_razon_social}**. ¿Deseas continuar?`;

  const handleShowDetail = () => {
    navigate(`/empresa/editar/${emp.id}`);
  };

  // Abre el modal
  const handleOpenStatusModal = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  // Cierra el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmStatus = async () => {
    setIsProcessing(true);

    try {
      const payload: Empresa = {
        estado: nuevoEstado,
      };

      const response = await updateEmpresaByEstado(emp.id, payload);

      const { result, data, message, error } = response as EmpresaResponse;

      if (result && data) {
        showToast(
          "success",
          message || "Estado de la empresa actualizado con éxito."
        );

        // Si hay una función de callback, llamarla para actualizar la tabla padre
        if (onStatusChange) {
          onStatusChange(emp.id);
        }
      } else {
        showToast("error", error || "Error al actualizar la empresa.");
      }
    } catch (error) {
      console.error("Error en la actualización de estado:", error);
      showToast("error", "Error de conexión al intentar actualizar.");
    } finally {
      setIsProcessing(false); // Desactiva el loading
      handleCloseModal(); // Cierra el modal
    }
  };

  // Determinar texto y color de acción
  const actionText = emp.estado ? "Desactivar" : "Activar";
  const ActionIcon = emp.estado ? ToggleLeft : ToggleRight;
  const actionColor = emp.estado ? "text-red-600" : "text-green-600";
  const hoverBgColor = emp.estado ? "hover:bg-red-100" : "hover:bg-green-100";

  return (
    <>
      <TableRow
        key={emp.id}
        className="hover:bg-blue-100 hover:cursor-pointer transition-colors duration-200"
      >
        <TableCell className="py-3">{emp.nombre_o_razon_social}</TableCell>
        <TableCell className="py-3">{emp.numero}</TableCell>
        <TableCell className="py-3">{emp.direccion}</TableCell>
        <TableCell className="py-3 flex items-center justify-center h-full">
          {emp.estado ? (
            <CircleCheck className="text-green-500 w-5 h-5" />
          ) : (
            <CircleX className="text-red-500 w-5 h-5" />
          )}
        </TableCell>
        <TableCell className="py-3">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger
              asChild
              className="focus:outline-none focus:ring-2 z-40 focus:ring-gray-400 focus:border-transparent transition duration-300 cursor-pointer"
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
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleOpenStatusModal}
                className={`cursor-pointer ${hoverBgColor} transition-colors flex items-center space-x-2 ${actionColor}`}
              >
                <ActionIcon className="h-4 w-4" />
                <span>{actionText} Empresa</span>
              </DropdownMenuItem>
              {/* <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 transition-colors">
              Eliminar
            </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmStatus}
        title={modalTitle}
        message={<span dangerouslySetInnerHTML={{ __html: modalMessage }} />}
        confirmText={actionText}
        isProcessing={isProcessing}
        icon={
          <AlertTriangle
            className={emp.estado ? "text-red-500" : "text-green-500"}
          />
        }
      />
    </>
  );
};
