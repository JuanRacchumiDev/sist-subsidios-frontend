import { Card, CardContent } from "../ui/card";
import { ReembolsoTable } from "./ReembolsoTable";

export const ReembolsoList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Listado de reembolsos
        </h1>
      </div>
      <Card className="shadow-lg border-gray-200">
        <CardContent>
          <ReembolsoTable />
        </CardContent>
      </Card>
    </div>
  );
};
