import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { EmpresaTable } from "./EmpresaTable";

export const EmpresaList = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <Link
            to="/empresa/nuevo"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nueva empresa
          </Link>
        </div>
      </div>
      <Card>
        <CardContent>
          <EmpresaTable />
        </CardContent>
      </Card>
    </>
  );
};
