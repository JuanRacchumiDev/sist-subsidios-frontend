import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import {
  ReembolsoFilter,
  ReembolsoPaginateResponse,
} from "../../interfaces/IReembolso";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getDetalles } from "../../services/detalleParametroService";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { ParametroClase } from "../../constants/parametroClase";

interface CanjeFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: ReembolsoPaginateResponse;
  onApplyFilters: (filters: ReembolsoFilter) => void;
}
