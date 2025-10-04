import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { DescansoMedicoTable } from "./DescansoMedicoTable";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { Spinner } from "../Common/Spinner";
import { useState } from "react";
import { Button } from "../ui/button";
import { getDescansosForReport } from "../../services/descansoMedicoService";
import HDate from "@/helpers/HDate";

export const DescansoMedicoList = () => {
  const [loading, setLoading] = useState(false);

  const handleDownloadReport = async (type: "pdf" | "excel") => {
    setLoading(true);

    try {
      const response = await getDescansosForReport(type);

      // Si la respuesta no es exitosa, lanza un error o maneja la lógica
      if (!response.result) {
        throw new Error(response.error || "Error al generar el reporte");
      }

      const blob = new Blob([response.data], {
        type:
          type === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // const blob = new Blob([response.data]);

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
      // Puedes usar un toast o un modal para mostrar el error al usuario
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Listado de descansos médicos
        </h1>
        <div className="flex space-x-3 items-center">
          {loading ? (
            <div className="flex items-center space-x-2">
              <Spinner className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-gray-500">Generando reporte...</span>
            </div>
          ) : (
            <>
              {/* Botón para reporte PDF */}
              {/* <Button
                onClick={() => handleDownloadReport("pdf")}
                className="bg-transparent border border-gray-400 text-red-600 hover:bg-red-50 hover:border-red-600 hover:text-red-700 transition-colors shadow-none px-2 py-2 cursor-pointer"
                title="Generar reporte PDF"
              >
                <FileDown className="h-6 w-6" />
              </Button> */}
              {/* Botón para reporte Excel */}
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
            to="/descanso-medico/nuevo"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Nuevo descanso médico
          </Link>
        </div>
      </div>
      <Card className="shadow-lg border-gray-200">
        <CardContent>
          <DescansoMedicoTable />
        </CardContent>
      </Card>
    </div>
  );
};
