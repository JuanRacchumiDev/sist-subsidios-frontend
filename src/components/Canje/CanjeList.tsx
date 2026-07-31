import {
  ArrowLeft,
  Calendar,
  CalendarCheck,
  CalendarX,
  GraduationCap,
} from "lucide-react";
import { Spinner } from "../Common/Spinner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CanjeTable } from "./CanjeTable";
import { useState } from "react";
import { getCanjesForReport } from "../../services/canjeService";
import HDate from "../../helpers/HDate";
import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

type ReportType = "no_consecutivos" | "consecutivos" | "global";

export const CanjeList = () => {
  const [loading, setLoading] = useState(false);

  const handleDownloadReport = async (
    outputType: "pdf" | "excel",
    reportType: ReportType,
    limit: number,
  ) => {
    setLoading(true);

    try {
      const response = await getCanjesForReport(outputType, reportType, limit);

      const { result, error, data } = response;

      if (!result) {
        throw new Error(error || "Error al generar el reporte");
      }

      const blob = new Blob([data], {
        type:
          outputType === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const dateSuffix = HDate.getCurrentDateToString("ddMMyyyy");

      const fileExtension = outputType === "pdf" ? "pdf" : "xlsx";

      const filename = `reporte_subsidios_${limit}_dias_${reportType}_${dateSuffix}.${fileExtension}`;

      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error al descargar el reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-200">
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
            <div className="flex items-center space-x-2">
              <Spinner className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-gray-500">Generando reporte...</span>
            </div>
          ) : (
            <div className="flex space-x-3">
              {/* Ícono 1: 90 días No Consecutivos */}
              <Button
                onClick={() =>
                  handleDownloadReport("excel", "no_consecutivos", 90)
                }
                className="bg-transparent border border-gray-400 text-green-600 hover:bg-green-50 hover:border-green-600 hover:text-green-700 transition-colors shadow-none px-2 py-2 cursor-pointer"
                title="Reporte 90 días No Consecutivos (Excel)"
              >
                <CalendarX className="h-6 w-6" />
              </Button>
              {/* Ícono 2: 150 días Consecutivos */}
              <Button
                onClick={() =>
                  handleDownloadReport("excel", "consecutivos", 150)
                }
                className="bg-transparent border border-gray-400 text-green-600 hover:bg-green-50 hover:border-green-600 hover:text-green-700 transition-colors shadow-none px-2 py-2 cursor-pointer"
                title="Reporte 150 días Consecutivos (Excel)"
              >
                <CalendarCheck className="h-6 w-6" />
              </Button>
              {/* Ícono 3: 340 días Global (Consecutivos y No Consecutivos) */}
              <Button
                onClick={() => handleDownloadReport("excel", "global", 340)}
                className="bg-transparent border border-gray-400 text-green-600 hover:bg-green-50 hover:border-green-600 hover:text-green-700 transition-colors shadow-none px-2 py-2 cursor-pointer"
                title="Reporte 340 días Global (Excel)"
              >
                <Calendar className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden bg-white">
        <CardContent className="p-0">
          <CanjeTable />
        </CardContent>
      </Card>
    </div>
  );
};
