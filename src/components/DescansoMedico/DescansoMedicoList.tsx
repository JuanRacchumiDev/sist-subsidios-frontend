import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { DescansoMedicoTable } from "./DescansoMedicoTable";

export const DescansoMedicoList = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <Link
            to="/descanso-medico/nuevo"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nuevo descanso médico
          </Link>
        </div>
      </div>
      <Card>
        <CardContent>
          <DescansoMedicoTable />
        </CardContent>
      </Card>
    </>
  );
};
