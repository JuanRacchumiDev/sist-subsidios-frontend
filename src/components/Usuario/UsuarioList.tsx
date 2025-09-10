import { Link } from "react-router-dom";
import { UsuarioTable } from "./UsuarioTable";
import { Card, CardContent } from "../ui/card";

export const UsuarioList = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <Link
            to="/usuario/nuevo"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nuevo usuario
          </Link>
        </div>
      </div>
      <Card>
        <CardContent>
          <UsuarioTable />
        </CardContent>
      </Card>
    </>
  );
};
