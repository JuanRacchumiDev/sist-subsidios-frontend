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
import { updateColaboradorByEstado } from "../../services/colaboradorService";
import { ConfirmDialog } from "../Common/ConfirmDialog";

interface Props {
  colaborador: Persona;
}

export const ColaboradorRow: React.FC<Props> = ({ colaborador }) => {
  const { showToast } = useToast();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  const nuevoEstado = !colaborador.estado;
  const action = nuevoEstado ? "activar" : "desactivar";
  const modalTitle = `${
    action.charAt(0).toUpperCase() + action.slice(1)
  } Colaborador`;
  const modalMessage = `¿Deseas <strong>${action}</strong> al colaborador: <strong>${colaborador.nombre_completo}</strong>?`;

  const handleShowDetail = () => {
    const urlEdit = `/colaborador/editar/${colaborador.id}`;
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

      const response = await updateColaboradorByEstado(colaborador.id, payload);

      const { result, data, message, error } = response as PersonaResponse;

      if (result && data) {
        showToast(
          "success",
          message || "Estado del colaborador actualizado con éxito.",
        );
      } else {
        showToast("error", error || "Error al actualizar al colaborador.");
      }
    } catch (error) {
      console.error("Error en la actualización de estado:", error);
      showToast("error", "Error de conexión al intentar actualizar.");
    } finally {
      setIsProcessing(false);
      handleCloseModal();
    }
  };

  const actionText = colaborador.estado ? "Desactivar" : "Activar";
  const ActionIcon = colaborador.estado ? ToggleLeft : ToggleRight;
  const actionColor = colaborador.estado ? "text-red-600" : "text-green-600";
  const hoverBgColor = colaborador.estado
    ? "hover:bg-red-100"
    : "hover:bg-green-100";

  return (
    <>
      <TableRow
        key={colaborador.id}
        className="hover:bg-slate-50/80 hover:cursor-pointer transition-colors duration-150 border-b border-slate-100"
      >
        <TableCell className="py-2 px-3 text-xs text-slate-500">
          {colaborador?.abreviatura}
        </TableCell>
        <TableCell className="py-2 px-3 text-xs text-slate-600 font-mono">
          {colaborador.numero_documento}
        </TableCell>
        <TableCell className="py-2 px-3 text-xs font-medium text-slate-700 max-w-[200px] truncate">
          {colaborador.nombre_completo}
        </TableCell>
        <TableCell className="py-2 px-3 text-xs text-slate-500 max-w-[180px] truncate">
          {colaborador.nombre_o_razon_social}
        </TableCell>
        <TableCell className="py-2 px-3 text-xs text-slate-500">
          {colaborador.telefono || "-"}
        </TableCell>
        <TableCell className="py-2 px-3 text-center">
          <div className="flex items-center justify-center">
            {colaborador.estado ? (
              <CircleCheck className="text-emerald-500 w-4 h-4 stroke-[2.5]" />
            ) : (
              <CircleX className="text-rose-500 w-4 h-4 stroke-[2.5]" />
            )}
          </div>
        </TableCell>
        {/* Altura de los botones de acciones alineados */}
        <TableCell className="py-2 px-3 text-right">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-7 w-7 p-0 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:ring-offset-0"
              >
                <span className="sr-only">Abrir menú de acciones</span>
                <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-white border border-slate-200 shadow-md min-w-[140px] text-xs p-1 rounded-md"
            >
              <DropdownMenuLabel className="font-medium text-slate-400 px-2 py-1 text-[10px] uppercase tracking-wider">
                Acciones
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />

              <DropdownMenuItem
                onClick={handleShowDetail}
                className="cursor-pointer hover:bg-slate-50 rounded-sm py-1 px-2 flex items-center gap-2 text-slate-700"
              >
                <Edit className="h-3.5 w-3.5 text-slate-400" />
                <span>Ver/Editar detalle</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />

              <DropdownMenuItem
                onClick={handleOpenStatusModal}
                className={`cursor-pointer rounded-sm py-1 px-2 flex items-center gap-2 font-medium ${actionColor} ${hoverBgColor}`}
              >
                <ActionIcon className="h-3.5 w-3.5" />
                <span>{actionText}</span>
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
            className={colaborador.estado ? "text-red-500" : "text-green-500"}
          />
        }
      />
    </>
  );
};
