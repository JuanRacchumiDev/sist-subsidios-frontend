import React from "react";
import { FormLabel } from "../ui/form";
import { cn } from "../../lib/utils";

interface RequiredLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const RequiredLabel: React.FC<RequiredLabelProps> = ({
  children,
  className,
}) => (
  <FormLabel className={cn("text-xs font-semibold text-gray-700", className)}>
    {children} <span className="text-red-500">*</span>
  </FormLabel>
);
