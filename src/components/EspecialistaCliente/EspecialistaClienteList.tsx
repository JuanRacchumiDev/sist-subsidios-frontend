import { Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { EspecialistaClienteTable } from "./EspecialistaClienteTable";

export const EspecialistaClienteList = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Listado de especialistas cliente
        </h1>
        <div className="flex space-x-3">
          {/* <a
            href="/especialista-cliente/upload"
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg shadow hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <Upload size={16} />
            <span>Cargar Excel</span>
          </a> */}
          <Link
            to="/especialista-cliente/nuevo"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Nuevo especialista cliente
          </Link>
        </div>
      </div>
      <Card className="shadow-lg border-gray-200">
        <CardContent>
          <EspecialistaClienteTable />
        </CardContent>
      </Card>
    </>
  );
};
