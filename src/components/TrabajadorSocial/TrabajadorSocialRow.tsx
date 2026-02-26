import { Persona, PersonaResponse } from "../../interfaces/IPersona";
import { TableCell, TableRow } from "../ui/table";
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
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useToast } from "../../context/ToastContext";
import { useState } from "react";
import { updateTrabajadorSocialByEstado } from "@/services/trabajadorSocialService";
import { ConfirmDialog } from "../Common/ConfirmDialog";

interface Props {
  trabajadorSocial: Persona;
  onStatusChange?: (trabajadorSocialId: string) => void;
}

export const TrabajadorSocialRow: React.FC<Props> = ({
  trabajadorSocial,
  onStatusChange,
}) => {
  const { showToast } = useToast();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  const nuevoEstado = !trabajadorSocial.estado;
  const action = nuevoEstado ? "activar" : "desactivar";
  const modalTitle = `${
    action.charAt(0).toUpperCase() + action.slice(1)
  } Trabajador social`;
  const modalMessage = `¿Deseas <strong>${action}</strong> al trabajador social: <strong>${trabajadorSocial.nombre_completo}</strong>?`;

  const handleShowDetail = () => {
    const urlEdit = `/trabajador-social/editar/${trabajadorSocial.id}`;
    console.log({ urlEdit });
    navigate(urlEdit);
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
      const payload: Persona = {
        estado: nuevoEstado,
      };

      const response = await updateTrabajadorSocialByEstado(
        trabajadorSocial.id,
        payload,
      );

      const { result, data, message, error } = response as PersonaResponse;

      if (result && data) {
        showToast(
          "success",
          message || "Estado del trabajador social actualizado con éxito.",
        );

        if (onStatusChange) {
          onStatusChange(trabajadorSocial.id);
        }
      } else {
        showToast(
          "error",
          error || "Error al actualizar al trabajador social.",
        );
      }
    } catch (error) {
      console.error("Error en la actualización de estado:", error);
      showToast("error", "Error de conexión al intentar actualizar.");
    } finally {
      setIsProcessing(false);
      handleCloseModal();
    }
  };

  const actionText = trabajadorSocial.estado ? "Desactivar" : "Activar";
  const ActionIcon = trabajadorSocial.estado ? ToggleLeft : ToggleRight;
  const actionColor = trabajadorSocial.estado
    ? "text-red-600"
    : "text-green-600";
  const hoverBgColor = trabajadorSocial.estado
    ? "hover:bg-red-100"
    : "hover:bg-green-100";

  return (
    <>
      <TableRow
        key={trabajadorSocial.id}
        className="hover:bg-blue-100 hover:cursor-pointer transition-colors duration-200"
      >
        <TableCell className="py-3">{trabajadorSocial.abreviatura}</TableCell>
        <TableCell className="py-3">
          {trabajadorSocial.numero_documento}
        </TableCell>
        <TableCell className="py-3">
          {trabajadorSocial.nombre_completo}
        </TableCell>
        <TableCell className="py-3">
          {trabajadorSocial.nombre_o_razon_social}
        </TableCell>
        <TableCell className="py-3">{trabajadorSocial.telefono}</TableCell>
        <TableCell className="py-3">
          {trabajadorSocial.estado ? (
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
                <span>{actionText} Trabajador Social</span>
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
            className={
              trabajadorSocial.estado ? "text-red-500" : "text-green-500"
            }
          />
        }
      />
    </>
  );
};
