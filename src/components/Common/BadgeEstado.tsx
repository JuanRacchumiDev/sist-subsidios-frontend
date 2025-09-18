import React from "react";
import { EDescansoMedico } from "../../enums/EDescansoMedico";
import { ECanje } from "../../enums/ECanje";
import { ECobro } from "../../enums/ECobro";
import { EReembolso } from "../../enums/EReembolso";

// Definir un tipo de unión para todos los estados posibles
type Estado = EDescansoMedico | ECanje | ECobro | EReembolso;

// Mapa de estilos que centraliza la lógica de colores
const estadoStyles: Record<Estado, string> = {
  // Descanso Médico
  [EDescansoMedico.REGISTRO_INGRESADO]: "bg-blue-100 text-blue-800",
  [EDescansoMedico.REGISTRO_EXITOSO]: "bg-green-100 text-green-800",
  [EDescansoMedico.DOCUMENTACION_INCORRECTA]: "bg-red-100 text-red-800",
  [EDescansoMedico.POR_CANJEAR]: "bg-yellow-100 text-yellow-800",

  // Canje
  [ECanje.CANJE_REGISTRADO]: "bg-purple-100 text-purple-800",
  [ECanje.CANJE_ORSERVADO]: "bg-orange-100 text-orange-800",
  [ECanje.CANJE_INGRESADO]: "bg-indigo-100 text-indigo-800",
  [ECanje.CANJE_CONFORME]: "bg-cyan-100 text-cyan-800",

  // Cobro
  [ECobro.COBRO_INGRESADO]: "bg-teal-100 text-teal-800",
  [ECobro.COBRO_REALIZADO]: "bg-green-100 text-green-800", // Similar a REGISTRO_EXITOSO
  [ECobro.COBRO_PENDIENTE]: "bg-orange-100 text-orange-800", // Similar a CANJE_ORSERVADO

  // Reembolso
  [EReembolso.REEMBOLSO_INGRESADO]: "bg-fuchsia-100 text-fuchsia-800",
  [EReembolso.REEMBOLSO_REALIZADO]: "bg-green-100 text-green-800", // Similar a REGISTRO_EXITOSO
  [EReembolso.REEMBOLSO_OBSERVADO]: "bg-orange-100 text-orange-800", // Similar a CANJE_ORSERVADO
  [EReembolso.REEMBOLSO_CONFORME]: "bg-lime-100 text-lime-800",
};

interface BadgeEstadoProps {
  estado: Estado;
}

const BadgeEstado: React.FC<BadgeEstadoProps> = ({ estado }) => {
  const badgeClasses = estadoStyles[estado] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-flex
        items-center
        rounded-full
        px-2.5
        py-0.5
        text-xs
        font-medium
        ${badgeClasses}
    `}
    >
      {estado}
    </span>
  );
};

export default BadgeEstado;
