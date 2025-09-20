import { Card, CardContent } from "../ui/card";
import { CobroTable } from "./CobroTable";

export const CobroList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Listado de cobros</h1>
      </div>
      <Card className="shadow-lg border-gray-200">
        <CardContent>
          <CobroTable />
        </CardContent>
      </Card>
    </div>
  );
};
