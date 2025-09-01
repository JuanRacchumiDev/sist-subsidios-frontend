import { Upload } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { ColaboradorTable } from "./ColaboradorTable";
import { Link } from "react-router-dom";

export const ColaboradorList = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <a
            href="/colaborador/upload"
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg shadow hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <Upload size={16} />
            <span>Cargar Excel</span>
          </a>
          <Link
            to="/colaborador/nuevo"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nuevo colaborador
          </Link>
        </div>
      </div>
      <Card>
        <CardContent>
          <ColaboradorTable />
        </CardContent>
      </Card>
    </>
  );
};
