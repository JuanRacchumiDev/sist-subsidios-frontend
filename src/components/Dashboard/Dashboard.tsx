import React from "react";
import {
  HeartPulse,
  ArrowLeftRight,
  HandCoins,
  CircleDollarSign,
  Users,
  Building2,
  Calendar,
  FileSpreadsheet,
  Activity,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { KpiCard } from "./KpiCard";
import { AlertaNormativaCard } from "./AlertaNormativaCard";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header de Bienvenida */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>Resumen del Sistema DMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Panel de Control Institucional
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Monitoreo en tiempo real de incapacidades temporales, expedientes de
            canje, solicitudes de reembolso y cobros.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <Link
            to="/canje"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ver Reportes</span>
          </Link>
        </div>
      </div>

      {/* 2. Sección de KPIs de los 4 Módulos Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Descansos Médicos"
          value="1,248"
          subtitle="Registrados este año"
          trend={{ value: "+12.5%", isPositive: true }}
          icon={HeartPulse}
          iconBgColor="bg-rose-50"
          iconColor="text-rose-600"
        />
        <KpiCard
          title="Canjes CITT"
          value="856"
          subtitle="Procesados ante EsSalud"
          trend={{ value: "+8.2%", isPositive: true }}
          icon={ArrowLeftRight}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <KpiCard
          title="Reembolsos"
          value="S/ 142,850"
          subtitle="Recuperados de subsidios"
          trend={{ value: "+15.3%", isPositive: true }}
          icon={HandCoins}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <KpiCard
          title="Cobros Pendientes"
          value="S/ 38,400"
          subtitle="Por tramitar o subsanar"
          trend={{ value: "-3.1%", isPositive: false }}
          icon={CircleDollarSign}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* 3. Panel de Alertas por Umbrales Normativos (90, 150 y 340 días) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Control de Límites Acumulados
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Reglas de evaluación normativas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AlertaNormativaCard
            daysLimit={90}
            title="Días No Consecutivos"
            count={14}
            description="Colaboradores que acumulan 90 o más días discontinuos en el año."
            type="no_consecutivos"
            badgeColor="bg-amber-100 text-amber-800"
            borderColor="border-amber-500"
          />
          <AlertaNormativaCard
            daysLimit={150}
            title="Días Consecutivos"
            count={6}
            description="Colaboradores con descanso continuo ininterrumpido a evaluar."
            type="consecutivos"
            badgeColor="bg-emerald-100 text-emerald-800"
            borderColor="border-emerald-500"
          />
          <AlertaNormativaCard
            daysLimit={340}
            title="Acumulado Global"
            count={2}
            description="Límite máximo subsidiable previo a evaluación de incapacidad."
            type="global"
            badgeColor="bg-rose-100 text-rose-800"
            borderColor="border-rose-500"
          />
        </div>
      </div>

      {/* 4. Tablas Resumen / Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2/3): Descansos Médicos Recientes */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Últimos Descansos Médicos Registrados
            </h3>
            <Link
              to="/descanso-medico"
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="border-slate-200 shadow-xs rounded-xl overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-3">Colaborador</th>
                      <th className="p-3">Contingencia</th>
                      <th className="p-3">F. Inicio</th>
                      <th className="p-3 text-center">Días</th>
                      <th className="p-3 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">
                        Pérez Gomez, Juan Carlos
                      </td>
                      <td className="p-3">Enfermedad Común</td>
                      <td className="p-3">01/08/2026</td>
                      <td className="p-3 text-center font-bold">15</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pendiente Canje
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">
                        Rodríguez Silva, Maria Elena
                      </td>
                      <td className="p-3">Maternidad</td>
                      <td className="p-3">15/07/2026</td>
                      <td className="p-3 text-center font-bold">98</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Canjeado CITT
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">
                        Mendoza Torres, Carlos Alberto
                      </td>
                      <td className="p-3">Accidente Trabajo</td>
                      <td className="p-3">28/07/2026</td>
                      <td className="p-3 text-center font-bold">30</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          En Reembolso
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha (1/3): Estadísticas de Cobertura */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            Resumen General de Entidades
          </h3>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Empresas Asociadas
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Clientes activos
                  </div>
                </div>
              </div>
              <span className="text-lg font-black text-slate-900">32</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Total Colaboradores
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Padrón de afiliados
                  </div>
                </div>
              </div>
              <span className="text-lg font-black text-slate-900">4,850</span>
            </div>

            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Próximos Vencimientos</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Hay <strong>8 canjes</strong> que vencerán en los próximos 5
                días hábiles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
