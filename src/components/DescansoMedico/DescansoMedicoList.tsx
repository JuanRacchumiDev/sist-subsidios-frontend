import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileSpreadsheet, GraduationCap, Plus } from "lucide-react";
import { Spinner } from "../Common/Spinner";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { DescansoMedicoTable } from "./DescansoMedicoTable";
import { getDescansosForReport } from "../../services/descansoMedicoService";
import HDate from "../../helpers/HDate";
import { cn } from "../../lib/utils";

export const DescansoMedicoList = () => {
  const newRoute = `/descanso-medico/nuevo`;
  const [loading, setLoading] = useState(false);

  // Helper reutilizable para forzar la descarga del archivo Blob
  const downloadFile = (data: BlobPart, filename: string, mimeType: string) => {
    const blob = new Blob([data], { type: mimeType });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  };

  const handleDownloadReport = async (type: "pdf" | "excel") => {
    setLoading(true);

    try {
      const response = await getDescansosForReport(type);
      const { result, error, data } = response;

      if (!result || !data) {
        throw new Error(error || "Error al generar el reporte");
      }

      const mimeType =
        type === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      const dateSuffix = HDate.getCurrentDateToString("ddMMyyyy");
      const fileExtension = type === "pdf" ? "pdf" : "xlsx";
      const filename = `reporte_descansos_medicos_${dateSuffix}.${fileExtension}`;

      downloadFile(data, filename, mimeType);
    } catch (error) {
      console.error("Error al descargar el reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-500">
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Gestión de subsidios de salud
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Listado de{" "}
            <span className="text-indigo-600">descansos médicos</span>
          </h1>
          <p className="text-xs text-slate-500">
            Administra, visualiza y gestiona la información de todos los
            descansos médicos.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden sm:flex gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs px-3 h-9",
            )}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Panel Principal
          </Link>

          {loading ? (
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 h-9">
              <Spinner className="h-4 w-4 animate-spin text-emerald-600" />
              <span className="text-xs font-medium text-slate-600">
                Generando Excel...
              </span>
            </div>
          ) : (
            <div className="relative group">
              {/* Botón Estilizado con Badge .xlsx */}
              <Button
                onClick={() => handleDownloadReport("excel")}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-xs px-2.5 py-1.5 h-9 cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <span className="hidden md:inline-block">
                  Reporte Descansos
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border text-emerald-700 bg-emerald-50 border-emerald-200">
                  .xlsx
                </span>
              </Button>

              {/* Tooltip Informativo Flotante */}
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col z-50 w-56 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95">
                <div className="font-semibold text-emerald-400 flex items-center gap-1 mb-0.5">
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>Reporte Consolidado</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Descarga un reporte en Excel con el listado completo y
                  detallado de descansos médicos registrados.
                </p>
                <div className="mt-1.5 text-[10px] text-slate-400 border-t border-slate-800 pt-1 font-mono">
                  Formato: Excel (.xlsx)
                </div>
                {/* Flecha del Tooltip */}
                <div className="absolute -top-1 right-4 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            </div>
          )}

          <Link
            to={newRoute}
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs gap-1.5 px-3 h-9 text-xs font-medium transition-colors",
            )}
          >
            <Plus className="w-4 h-4" />
            Nuevo descanso médico
          </Link>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden bg-white">
        <CardContent className="p-0">
          <DescansoMedicoTable />
        </CardContent>
      </Card>
    </div>
  );
};
