import { Link } from "react-router-dom";
import { UsuarioTable } from "./UsuarioTable";
import { Card, CardContent } from "../ui/card";

export const UsuarioList = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Listado de usuarios
        </h1>
        <div className="flex space-x-3">
          <Link
            to="/usuario/nuevo"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Nuevo usuario
          </Link>
        </div>
      </div>
      <Card className="shadow-lg border-gray-200">
        <CardContent>
          <UsuarioTable />
        </CardContent>
      </Card>
    </>
  );
};
