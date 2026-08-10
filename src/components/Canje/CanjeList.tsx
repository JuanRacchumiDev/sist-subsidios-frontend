import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CalendarCheck,
  CalendarX,
  GraduationCap,
} from "lucide-react";
import { Spinner } from "../Common/Spinner";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CanjeTable } from "./CanjeTable";
import { getCanjesForReport } from "../../services/canjeService";
import { OutputType, ReportType } from "../../interfaces/ICanje";
import HDate from "../../helpers/HDate";
import { cn } from "../../lib/utils";

// Configuración extendida con etiquetas, descripciones y badges
const REPORT_BUTTONS = [
  {
    type: "no_consecutivos" as ReportType,
    limit: 90,
    label: "90 días",
    subtitle: "No Consecutivos",
    description:
      "Genera Excel de colaboradores que alcanzan o superan 90 días discontinuos.",
    title: "Reporte 90 días No Consecutivos",
    icon: CalendarX,
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    type: "consecutivos" as ReportType,
    limit: 150,
    label: "150 días",
    subtitle: "Consecutivos",
    description:
      "Genera Excel de colaboradores con 150 días continuos de descanso.",
    title: "Reporte 150 días Consecutivos",
    icon: CalendarCheck,
    badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    type: "global" as ReportType,
    limit: 340,
    label: "340 días",
    subtitle: "Global",
    description:
      "Genera Excel acumulado general (consecutivos y no consecutivos).",
    title: "Reporte 340 días Global",
    icon: Calendar,
    badgeColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
  },
];

export const CanjeList = () => {
  const [loading, setLoading] = useState(false);

  // Helper para forzar la descarga del archivo Blob
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

  const handleDownloadReport = async (
    outputType: OutputType,
    reportType: ReportType,
    limit: number,
    fechaInicio?: string,
    fechaFinal?: string,
  ) => {
    setLoading(true);

    try {
      const response = await getCanjesForReport(
        outputType,
        reportType,
        limit,
        fechaInicio,
        fechaFinal,
      );

      const { result, error, data } = response;

      if (!result || !data) {
        throw new Error(error || "Error al generar el reporte");
      }

      const mimeType =
        outputType === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      const dateSuffix = HDate.getCurrentDateToString("ddMMyyyy");
      const fileExtension = outputType === "pdf" ? "pdf" : "xlsx";
      const filename = `reporte_subsidios_${limit}_dias_${reportType}_${dateSuffix}.${fileExtension}`;

      downloadFile(data, filename, mimeType);
    } catch (error) {
      console.error("Error al descargar el reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-200">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-500">
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Gestión de subsidios de salud
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Listado de <span className="text-indigo-600">canjes</span>
          </h1>
          <p className="text-xs text-slate-500">
            Administra, visualiza y gestiona la información de todos los canjes.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden sm:flex gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs px-3 h-8",
            )}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Panel Principal
          </Link>

          {loading ? (
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
              <Spinner className="h-4 w-4 animate-spin text-indigo-600" />
              <span className="text-xs font-medium text-slate-600">
                Generando reporte Excel...
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {REPORT_BUTTONS.map(
                ({
                  type,
                  limit,
                  label,
                  subtitle,
                  description,
                  title,
                  icon: Icon,
                  badgeColor,
                }) => (
                  <div key={`${type}-${limit}`} className="relative group">
                    {/* Botón con Texto/Badge */}
                    <Button
                      onClick={() => handleDownloadReport("excel", type, limit)}
                      className="bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-sm px-2.5 py-1.5 h-9 cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                    >
                      <Icon className="h-4 w-4 text-emerald-600" />
                      <span className="hidden md:inline-block">{subtitle}</span>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                          badgeColor,
                        )}
                      >
                        {label}
                      </span>
                    </Button>

                    {/* Tooltip flotante al hacer Hover */}
                    <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col z-50 w-56 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95">
                      <div className="font-semibold text-emerald-400 flex items-center gap-1 mb-0.5">
                        <Icon className="h-3.5 w-3.5" />
                        <span>{title}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {description}
                      </p>
                      <div className="mt-1.5 text-[10px] text-slate-400 border-t border-slate-800 pt-1 font-mono">
                        Formato: Excel (.xlsx)
                      </div>
                      {/* Flechita superior del Tooltip */}
                      <div className="absolute -top-1 right-4 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabla Principal */}
      <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden bg-white">
        <CardContent className="p-0">
          <CanjeTable />
        </CardContent>
      </Card>
    </div>
  );
};
