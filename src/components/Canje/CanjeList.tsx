import { Calendar, CalendarCheck, CalendarX } from "lucide-react";
import { Spinner } from "../Common/Spinner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CanjeTable } from "./CanjeTable";
import { useState } from "react";
import { getCanjesForReport } from "@/services/canjeService";
import HDate from "@/helpers/HDate";

// Definición de los tipos de reporte
type ReportType = "no_consecutivos" | "consecutivos" | "global";

export const CanjeList = () => {
  const [loading, setLoading] = useState(false);

  const handleDownloadReport = async (
    outputType: "pdf" | "excel",
    reportType: ReportType,
    limit: number
  ) => {
    setLoading(true);

    try {
      const response = await getCanjesForReport(outputType, reportType, limit);

      console.log({ response });

      // Si la respuesta no es exitosa, lanza un error o maneja la lógica
      if (!response.result) {
        throw new Error(response.error || "Error al generar el reporte");
      }

      const blob = new Blob([response.data], {
        type:
          outputType === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // const blob = new Blob([response.data]);

      const dateSuffix = HDate.getCurrentDateToString("ddMMyyyy");

      const fileExtension = outputType === "pdf" ? "pdf" : "xlsx";

      // const filename = `reporte_canjes_${dateSuffix}.${fileExtension}`;
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
      // Puedes usar un toast o un modal para mostrar el error al usuario
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Listado de canjes</h1>
        <div className="flex space-x-3 items-center">
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
                className="bg-transparent border border-gray-400 text-red-600 hover:bg-red-50 hover:border-red-600 hover:text-red-700 transition-colors shadow-none p-2 cursor-pointer"
                title="Reporte 90 días No Consecutivos (Excel)"
              >
                <CalendarX className="h-6 w-6" />
              </Button>

              {/* Ícono 2: 150 días Consecutivos */}
              <Button
                onClick={() =>
                  handleDownloadReport("excel", "consecutivos", 150)
                }
                className="bg-transparent border border-gray-400 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-600 hover:text-yellow-700 transition-colors shadow-none p-2 cursor-pointer"
                title="Reporte 150 días Consecutivos (Excel)"
              >
                <CalendarCheck className="h-6 w-6" />
              </Button>

              {/* Ícono 3: 340 días Global (Consecutivos y No Consecutivos) */}
              <Button
                onClick={() => handleDownloadReport("excel", "global", 340)}
                className="bg-transparent border border-gray-400 text-blue-600 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 transition-colors shadow-none p-2 cursor-pointer"
                title="Reporte 340 días Global (Excel)"
              >
                <Calendar className="h-6 w-6" />
              </Button>

              {/* Ícono General de Excel (Mantenido o reemplazado) */}
              {/* Si este botón era para un reporte general de la tabla, mantenlo.
                                Si es redundante, elimínalo o úsalo para un reporte general sin límites. */}
              {/* <Button
                onClick={() => handleDownloadReport("excel", "global", 0)} // Ejemplo de reporte general
                className="bg-transparent border border-gray-400 text-green-600 hover:bg-green-50 hover:border-green-600 hover:text-green-700 transition-colors shadow-none p-2 cursor-pointer"
                title="Generar listado completo (Excel)"
              >
                <FileSpreadsheet className="h-6 w-6" />
              </Button> */}
            </div>
          )}
        </div>
      </div>
      <Card className="shadow-lg border-gray-200">
        <CardContent>
          <CanjeTable />
        </CardContent>
      </Card>
    </div>
  );
};
