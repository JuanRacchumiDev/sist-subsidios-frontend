import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { CobroTable } from "./CobroTable";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { cn } from "../../lib/utils";

export const CobroList = () => {
  return (
    <div className="animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-500">
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Gestión de subsidios de salud
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Listado de <span className="text-indigo-600">cobros</span>
          </h1>
          <p className="text-xs text-slate-500">
            Administra, visualiza y gestiona la información de todos los cobros.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden sm:flex gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs px-3 h-8",
            )}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Panel Principal
          </Link>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden bg-white">
        <CardContent className="p-0">
          <CobroTable />
        </CardContent>
      </Card>
    </div>
  );
};
