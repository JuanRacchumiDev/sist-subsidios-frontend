import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { DescansoMedicoTable } from "./DescansoMedicoTable";
import { ArrowLeft, FileSpreadsheet, GraduationCap, Plus } from "lucide-react";
import { Spinner } from "../Common/Spinner";
import { useState } from "react";
import { Button } from "../ui/button";
import { getDescansosForReport } from "../../services/descansoMedicoService";
import HDate from "../../helpers/HDate";
import { buttonVariants } from "../ui/button";
import { cn } from "../../lib/utils";

export const DescansoMedicoList = () => {
  const newRoute = `/descanso-medico/nuevo`;

  const [loading, setLoading] = useState(false);

  const handleDownloadReport = async (type: "pdf" | "excel") => {
    setLoading(true);

    try {
      const response = await getDescansosForReport(type);

      const { result, error, data } = response;

      if (!result) {
        throw new Error(error || "Error al generar el reporte");
      }

      const blob = new Blob([data], {
        type:
          type === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const dateSuffix = HDate.getCurrentDateToString("ddMMyyyy");

      const fileExtension = type === "pdf" ? "pdf" : "xlsx";

      const filename = `reporte_descansos_${dateSuffix}.${fileExtension}`;

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
            <>
              <Button
                onClick={() => handleDownloadReport("excel")}
                className="bg-transparent border border-gray-400 text-green-600 hover:bg-green-50 hover:border-green-600 hover:text-green-700 transition-colors shadow-none px-2 py-2 cursor-pointer"
                title="Generar reporte Excel"
              >
                <FileSpreadsheet className="h-6 w-6" />
              </Button>
            </>
          )}

          <Link
            to={newRoute}
            className={cn(
              buttonVariants({ size: "sm" }), // Tamaño ajustado a 'sm' para entorno compacto
              "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs gap-1.5 px-3 h-8 text-xs font-medium transition-colors",
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
