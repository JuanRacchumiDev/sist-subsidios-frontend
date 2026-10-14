import { format } from "date-fns";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { RequiredLabel } from "../Common/RequiredLabel";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { TrabajadorSocialFormValues } from "./schemas/trabajadorSocialSchema";

interface Props {
  tiposDocumento: Detalle[];
  isEditMode: boolean;
  camposHabilitados: boolean;
  campoFecNacHabilitado: boolean;
  onSearchPersonaByDocumento?: (
    tipoDoc: string,
    numDoc: string,
  ) => Promise<void>;
}

export const InformacionPersonalFields = ({
  tiposDocumento,
  isEditMode,
  camposHabilitados,
  campoFecNacHabilitado,
  onSearchPersonaByDocumento,
}: Props) => {
  const {
    control,
    getValues,
    formState: { isSubmitting },
  } = useFormContext<TrabajadorSocialFormValues>();

  const handleKeyDownDocumento = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!value || !onSearchPersonaByDocumento) return;

      const idTipoDocumento = getValues("idTipoDocumento");
      await onSearchPersonaByDocumento(idTipoDocumento, value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-bold border border-blue-100">
          01
        </span>
        <h3 className="text-lg font-bold text-slate-800">
          Información Personal
        </h3>
        <div className="h-px bg-slate-100 flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
        {/* Tipo Documento */}
        <FormField
          control={control}
          name="idTipoDocumento"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <RequiredLabel isRequired={true}>Tipo de Documento</RequiredLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? ""}
                disabled={isSubmitting || isEditMode}
              >
                <FormControl>
                  <SelectTrigger
                    className={`w-full transition-all bg-white ${
                      fieldState.invalid
                        ? "border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
                    }`}
                  >
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white text-xs border border-slate-200 shadow-md outline-none">
                  {tiposDocumento.map((tipo) => (
                    <SelectItem
                      value={tipo.id}
                      key={tipo.id}
                      className="cursor-pointer hover:bg-blue-50 focus:bg-blue-100 data-[state=checked]:bg-blue-100 data-[state=checked]:font-semibold transition-colors"
                    >
                      {tipo.abreviatura}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Número Documento */}
        <FormField
          control={control}
          name="numeroDocumento"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel isRequired={true}>N° de documento</RequiredLabel>
              <FormControl>
                <Input
                  placeholder="12345678"
                  autoComplete="off"
                  maxLength={8}
                  disabled={isSubmitting || isEditMode}
                  {...field}
                  onKeyDown={(e) => handleKeyDownDocumento(e, field.value)}
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

        {/* Nombres */}
        <FormField
          control={control}
          name="nombres"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel isRequired={true}>Nombres</RequiredLabel>
              <FormControl>
                <Input
                  placeholder="María Angélica"
                  autoComplete="off"
                  maxLength={40}
                  {...field}
                  disabled={
                    (camposHabilitados !== undefined && !camposHabilitados) ||
                    isSubmitting
                  }
                  className={`transition-all ${
                    fieldState.invalid
                      ? "border-red-400 focus-visible:ring-red-100"
                      : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                  } ${
                    !camposHabilitados
                      ? "bg-slate-50 text-slate-500 cursor-not-allowed"
                      : "bg-white"
                  }`}
                />
              </FormControl>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Apellido Paterno */}
        <FormField
          control={control}
          name="apellidoPaterno"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel isRequired={true}>Apellido Paterno</RequiredLabel>
              <FormControl>
                <Input
                  placeholder="Pérez"
                  autoComplete="off"
                  maxLength={40}
                  {...field}
                  disabled={
                    (camposHabilitados !== undefined && !camposHabilitados) ||
                    isSubmitting
                  }
                  className={`transition-all ${
                    fieldState.invalid
                      ? "border-red-400 focus-visible:ring-red-100"
                      : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                  } ${
                    !camposHabilitados
                      ? "bg-slate-50 text-slate-500 cursor-not-allowed"
                      : "bg-white"
                  }`}
                />
              </FormControl>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Apellido Materno */}
        <FormField
          control={control}
          name="apellidoMaterno"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel isRequired={true}>Apellido Materno</RequiredLabel>
              <FormControl>
                <Input
                  placeholder="Vallejos"
                  autoComplete="off"
                  maxLength={40}
                  {...field}
                  disabled={
                    (camposHabilitados !== undefined && !camposHabilitados) ||
                    isSubmitting
                  }
                  className={`transition-all ${
                    fieldState.invalid
                      ? "border-red-400 focus-visible:ring-red-100"
                      : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                  } ${
                    !camposHabilitados
                      ? "bg-slate-50 text-slate-500 cursor-not-allowed"
                      : "bg-white"
                  }`}
                />
              </FormControl>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Sexo */}
        <FormField
          control={control}
          name="sexo"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <RequiredLabel isRequired={true}>Sexo</RequiredLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? ""}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger
                    className={`w-full transition-all bg-white ${
                      fieldState.invalid
                        ? "border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
                    }`}
                  >
                    <SelectValue placeholder="Seleccionar sexo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white text-xs border border-slate-200 shadow-md outline-none">
                  <SelectItem
                    value="M"
                    className="cursor-pointer hover:bg-blue-50 focus:bg-blue-100 data-[state=checked]:bg-blue-100 data-[state=checked]:font-semibold transition-colors"
                  >
                    Masculino
                  </SelectItem>
                  <SelectItem
                    value="F"
                    className="cursor-pointer hover:bg-blue-50 focus:bg-blue-100 data-[state=checked]:bg-blue-100 data-[state=checked]:font-semibold transition-colors"
                  >
                    Femenino
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Fecha de Nacimiento */}
        <FormField
          control={control}
          name="fechaNacimiento"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel>Fecha de Nacimiento</RequiredLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const dateVal = e.target.value
                      ? new Date(`${e.target.value}T00:00:00`)
                      : null;
                    field.onChange(dateVal);
                  }}
                  disabled={
                    (!camposHabilitados && !campoFecNacHabilitado) ||
                    isSubmitting
                  }
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
