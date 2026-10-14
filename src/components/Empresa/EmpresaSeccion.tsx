import { UseFormReturn } from "react-hook-form";
import { Search, Loader2 } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RequiredLabel } from "../Common/RequiredLabel";
import { EmpresaFormValues } from "./empresaSchema";

interface EmpresaSeccionProps {
  form: UseFormReturn<EmpresaFormValues>;
  isEditMode: boolean;
  isSearchingRuc: boolean;
  onSearchRuc: (ruc: string) => void;
}

export const EmpresaSeccion = ({
  form,
  isEditMode,
  isSearchingRuc,
  onSearchRuc,
}: EmpresaSeccionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
          01
        </span>
        <h3 className="text-lg font-semibold text-slate-800">
          Información de la Empresa
        </h3>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
        {/* RUC */}
        <FormField
          control={form.control}
          name="ruc"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel isRequired={true}>RUC</RequiredLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="20103269319"
                    autoComplete="off"
                    maxLength={11}
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (field.value) onSearchRuc(field.value);
                      }
                    }}
                    disabled={isEditMode}
                    className={`transition-all bg-white ${
                      fieldState.invalid
                        ? "border-red-400 focus-visible:ring-red-100"
                        : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                    }`}
                  />
                </FormControl>
                {!isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => field.value && onSearchRuc(field.value)}
                    disabled={isSearchingRuc || !field.value}
                    title="Consultar RUC en SUNAT"
                  >
                    {isSearchingRuc ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    ) : (
                      <Search className="h-4 w-4 text-gray-600" />
                    )}
                  </Button>
                )}
              </div>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Razón Social */}
        <FormField
          control={form.control}
          name="razonSocial"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel isRequired={true}>Razón Social</RequiredLabel>
              <FormControl>
                <Input
                  placeholder="SOPHIA HUMAN S.A.C."
                  autoComplete="off"
                  maxLength={100}
                  {...field}
                  className={`transition-all bg-white ${
                    fieldState.invalid
                      ? "border-red-400 focus-visible:ring-red-100"
                      : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                  }`}
                />
              </FormControl>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Dirección */}
        <FormField
          control={form.control}
          name="direccion"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel>Dirección Comercial</RequiredLabel>
              <FormControl>
                <Input
                  placeholder="Av. Libertad 203"
                  autoComplete="off"
                  maxLength={150}
                  {...field}
                  className={`transition-all bg-white ${
                    fieldState.invalid
                      ? "border-red-400 focus-visible:ring-red-100"
                      : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                  }`}
                />
              </FormControl>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
