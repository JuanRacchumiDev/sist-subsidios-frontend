import React, { useState } from "react";
import {
  Diagnostico,
  DiagnosticoResponse,
} from "../../../interfaces/IDiagnostico";
import { TableCell, TableRow } from "../../ui/table";
import {
  AlertTriangle,
  CircleCheck,
  CircleX,
  Edit,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
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
import { useToast } from "../../../context/ToastContext";
import { ConfirmDialog } from "../../Common/ConfirmDialog";
import { updateDiagnosticoByEstado } from "../../../services/diagnosticoService";

interface Props {
  diagnostico: Diagnostico;
  onStatusChange?: (diagnosticoId: string) => void;
}

export const DiagnosticoRow: React.FC<Props> = ({
  diagnostico,
  onStatusChange,
}) => {
  const { showToast } = useToast();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  const nuevoEstado = !diagnostico.estado;
  const action = nuevoEstado ? "activar" : "desactivar";
  const modalTitle = `${
    action.charAt(0).toUpperCase() + action.slice(1)
  } Diagnóstico`;
  const modalMessage = `¿Deseas <strong>${action}</strong> el diagnóstico: <strong>${diagnostico.nombre}</strong>?`;

  const handleShowDetail = () => {
    const url = `/mantenimiento/diagnostico/editar/${diagnostico.codCie10}`;
    console.log({ url });
    navigate(url);
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
      const payload: Diagnostico = {
        estado: nuevoEstado,
      };

      const response = await updateDiagnosticoByEstado(
        diagnostico.codCie10,
        payload,
      );

      const { result, data, message, error } = response as DiagnosticoResponse;

      if (result && data) {
        showToast(
          "success",
          message || "Estado del diagnóstico actualizado con éxito.",
        );

        if (onStatusChange) {
          onStatusChange(diagnostico.codCie10);
        }
      } else {
        showToast("error", error || "Error al actualizar el diagnóstico.");
      }
    } catch (error) {
      console.error("Error en la actualización de estado:", error);
      showToast("error", "Error de conexión al intentar actualizar.");
    } finally {
      setIsProcessing(false);
      handleCloseModal();
    }
  };

  const actionText = diagnostico.estado ? "Desactivar" : "Activar";
  const ActionIcon = diagnostico.estado ? ToggleLeft : ToggleRight;
  const actionColor = diagnostico.estado ? "text-red-600" : "text-green-600";
  const hoverBgColor = diagnostico.estado
    ? "hover:bg-red-100"
    : "hover:bg-green-100";

  return (
    <>
      <TableRow
        key={diagnostico.codCie10}
        className="hover:bg-blue-100 hover:cursor-pointer transition-colors duration-200"
      >
        <TableCell className="py-3">{diagnostico.codCie10}</TableCell>
        <TableCell className="py-3">{diagnostico.nombre}</TableCell>
        <TableCell className="py-3">
          {diagnostico.estado ? (
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
                <span>{actionText} Diagnóstico</span>
              </DropdownMenuItem>
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
            className={diagnostico.estado ? "text-red-500" : "text-green-500"}
          />
        }
      />
    </>
  );
};
