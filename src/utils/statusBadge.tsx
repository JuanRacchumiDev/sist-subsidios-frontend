import { Badge } from "../components/ui/badge";

export const getStatusBadge = (estado: boolean) => {
  const text = estado ? "Activo" : "Inactivo";
  const color = estado
    ? "bg-green-100 text-green-800 border border-green-300"
    : "bg-yellow-100 text-yellow-800 border border-yellow-300";

  return <Badge className={`${color} px-3 py-1 text-sm`}>{text}</Badge>;
};
