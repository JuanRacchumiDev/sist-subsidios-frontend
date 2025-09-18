import { Card, CardContent } from "../ui/card";
import { CanjeTable } from "./CanjeTable";

export const CanjeList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Listado de canjes</h1>
      </div>
      <Card className="shadow-lg border-gray-200">
        <CardContent>
          <CanjeTable />
        </CardContent>
      </Card>
    </div>
  );
};
