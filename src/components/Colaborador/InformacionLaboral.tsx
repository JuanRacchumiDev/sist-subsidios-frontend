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
import { Empresa } from "../../interfaces/IEmpresa";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { ColaboradorFormValues } from "./schemas/colaboradorSchema";

interface Props {
  empresas: Empresa[];
  cargos: Detalle[];
}

export const InformacionLaboralFields = ({ empresas, cargos }: Props) => {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<ColaboradorFormValues>();

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center gap-4 mb-6">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-bold border border-blue-100">
          02
        </span>
        <h3 className="text-lg font-bold text-slate-800">
          Información Laboral y de Contacto
        </h3>
        <div className="h-px bg-slate-100 flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
        {/* Empresa */}
        <FormField
          control={control}
          name="idEmpresa"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <RequiredLabel isRequired={true}>Empresa</RequiredLabel>
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
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white text-xs border border-slate-200 shadow-md outline-none">
                  {empresas.map((empresa) => (
                    <SelectItem
                      value={empresa.id}
                      key={empresa.id}
                      className="cursor-pointer hover:bg-blue-50 focus:bg-blue-100 data-[state=checked]:bg-blue-100 data-[state=checked]:font-semibold transition-colors"
                    >
                      {empresa.nombre_o_razon_social}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Cargo */}
        <FormField
          control={control}
          name="idCargo"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <RequiredLabel isRequired={true}>Cargo</RequiredLabel>
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
                    <SelectValue placeholder="Seleccionar cargo..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white text-xs border border-slate-200 shadow-md outline-none">
                  {cargos.map((cargo) => (
                    <SelectItem
                      value={cargo.id}
                      key={cargo.id}
                      className="cursor-pointer hover:bg-blue-50 focus:bg-blue-100 data-[state=checked]:bg-blue-100 data-[state=checked]:font-semibold transition-colors"
                    >
                      {cargo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Área */}
        <FormField
          control={control}
          name="nombreArea"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel isRequired={true}>Área</RequiredLabel>
              <FormControl>
                <Input
                  placeholder="Recursos Humanos"
                  autoComplete="off"
                  disabled={isSubmitting}
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

        {/* Sede */}
        <FormField
          control={control}
          name="nombreSede"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel isRequired={true}>Sede</RequiredLabel>
              <FormControl>
                <Input
                  placeholder="Sede Central"
                  autoComplete="off"
                  disabled={isSubmitting}
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

        {/* Teléfono / Celular */}
        <FormField
          control={control}
          name="telefono"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel isRequired={true}>
                Teléfono / Celular
              </RequiredLabel>
              <FormControl>
                <Input
                  placeholder="987654321"
                  autoComplete="off"
                  maxLength={9}
                  disabled={isSubmitting}
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

        {/* Correo Institucional */}
        <FormField
          control={control}
          name="emailInstitucional"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel isRequired={true}>
                Correo Institucional
              </RequiredLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="ejemplo@empresa.com"
                  autoComplete="off"
                  disabled={isSubmitting}
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

        {/* Correo Personal */}
        <FormField
          control={control}
          name="emailPersonal"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel isRequired={true}>Correo Personal</RequiredLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="ejemplo@gmail.com"
                  autoComplete="off"
                  disabled={isSubmitting}
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

        {/* Fecha Ingreso */}
        <FormField
          control={control}
          name="fechaIngreso"
          render={({ field, fieldState }) => (
            <FormItem>
              <RequiredLabel>Fecha de Ingreso</RequiredLabel>
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
                  disabled={isSubmitting}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
        <FormField
          control={control}
          name="esAsociadoSindicato"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="acceptSindicato"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-4 h-4"
                />
                <label htmlFor="acceptSindicato" className="text-sm">
                  Asociado a un sindicato
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="esPresentaInconvenientes"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="acceptInconvenientes"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-4 h-4"
                />
                <label htmlFor="acceptInconvenientes" className="text-sm">
                  Presenta inconvenientes
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
