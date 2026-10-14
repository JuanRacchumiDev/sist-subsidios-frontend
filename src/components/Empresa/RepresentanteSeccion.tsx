import { UseFormReturn } from "react-hook-form";
import { Search, Loader2, User, Briefcase } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RequiredLabel } from "../Common/RequiredLabel";
import { Detalle } from "../../interfaces/IDetalleParametro";
import { EmpresaFormValues } from "./empresaSchema";

interface RepresentanteSeccionProps {
  form: UseFormReturn<EmpresaFormValues>;
  tiposDocumento: Detalle[];
  cargos: Detalle[];
  isSearchingPersona: boolean;
  onSearchPersona: (tipoDoc: string, numDoc: string) => void;
}

export const RepresentanteSeccion = ({
  form,
  tiposDocumento,
  cargos,
  isSearchingPersona,
  onSearchPersona,
}: RepresentanteSeccionProps) => {
  const inputErrorClass = (invalid: boolean) =>
    `w-full transition-colors ${
      invalid
        ? "border-red-500 focus:ring-red-500"
        : "focus:ring-blue-500 hover:border-gray-400"
    }`;

  const handlePersonaSearch = () => {
    const idTipoDoc = form.getValues("idTipoDocumento");
    const numDoc = form.getValues("numeroDocumento");
    if (idTipoDoc && numDoc) {
      onSearchPersona(idTipoDoc, numDoc);
    }
  };

  return (
    <div className="space-y-8">
      {/* Encabezado principal de la sección */}
      <div className="flex items-center gap-4 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
          02
        </span>
        <h3 className="text-lg font-semibold text-slate-800">
          Datos del Representante Legal
        </h3>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      {/* GRUPO 1: DATOS PERSONALES */}
      <fieldset className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 relative transition-all hover:border-slate-300">
        <legend className="px-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm flex items-center gap-2">
          <User className="h-4 w-4 text-blue-600" />
          Datos Personales
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 pt-2">
          {/* Tipo Documento */}
          <FormField
            control={form.control}
            name="idTipoDocumento"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <RequiredLabel isRequired={true}>
                  Tipo de Documento
                </RequiredLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
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
                        key={tipo.id}
                        value={tipo.id}
                        className="cursor-pointer hover:bg-blue-50 focus:bg-blue-100 data-[state=checked]:bg-blue-100 data-[state=checked]:font-semibold transition-colors"
                      >
                        {tipo.abreviatura || tipo.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* Número de Documento */}
          <FormField
            control={form.control}
            name="numeroDocumento"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <RequiredLabel isRequired={true}>
                  Número de Documento
                </RequiredLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="44668800"
                      autoComplete="off"
                      maxLength={8}
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handlePersonaSearch();
                        }
                      }}
                      className={`transition-all bg-white ${
                        fieldState.invalid
                          ? "border-red-400 focus-visible:ring-red-100"
                          : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                      }`}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handlePersonaSearch}
                    disabled={isSearchingPersona || !field.value}
                    title="Consultar Persona en Reniec/API"
                    className="bg-white"
                  >
                    {isSearchingPersona ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    ) : (
                      <Search className="h-4 w-4 text-gray-600" />
                    )}
                  </Button>
                </div>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* Nombres */}
          <FormField
            control={form.control}
            name="nombres"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <RequiredLabel isRequired={true}>Nombres</RequiredLabel>
                <FormControl>
                  <Input
                    placeholder="Juan Carlos"
                    autoComplete="off"
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

          {/* Apellido Paterno */}
          <FormField
            control={form.control}
            name="apellidoPaterno"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <RequiredLabel isRequired={true}>
                  Apellido Paterno
                </RequiredLabel>
                <FormControl>
                  <Input
                    placeholder="Pérez"
                    autoComplete="off"
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

          {/* Apellido Materno */}
          <FormField
            control={form.control}
            name="apellidoMaterno"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <RequiredLabel isRequired={true}>
                  Apellido Materno
                </RequiredLabel>
                <FormControl>
                  <Input
                    placeholder="Gómez"
                    autoComplete="off"
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

          {/* Sexo */}
          <FormField
            control={form.control}
            name="sexo"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <RequiredLabel isRequired={true}>Sexo</RequiredLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
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
        </div>
      </fieldset>

      {/* GRUPO 2: DATOS DEL REPRESENTANTE */}
      <fieldset className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 relative transition-all hover:border-slate-300">
        <legend className="px-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-blue-600" />
          Información Institucional / Representación
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 pt-2">
          {/* Cargo */}
          <FormField
            control={form.control}
            name="idCargo"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <RequiredLabel isRequired={true}>Cargo</RequiredLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger
                      className={`w-full transition-all bg-white ${
                        fieldState.invalid
                          ? "border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
                      }`}
                    >
                      <SelectValue placeholder="Seleccionar cargo" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="bg-white text-xs border border-slate-200 shadow-md outline-none">
                    {cargos.map((cargo) => (
                      <SelectItem
                        key={cargo.id}
                        value={cargo.id}
                        className="cursor-pointer hover:bg-blue-50 focus:bg-blue-100 data-[state=checked]:bg-blue-100 data-[state=checked]:font-semibold transition-colors"
                      >
                        {cargo.descripcion || cargo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* Dirección Fiscal */}
          <FormField
            control={form.control}
            name="direccionFiscal"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <RequiredLabel isRequired={true}>
                  Dirección Fiscal
                </RequiredLabel>
                <FormControl>
                  <Input
                    placeholder="Av. Perú 123"
                    autoComplete="off"
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

          {/* Partida Registral */}
          <FormField
            control={form.control}
            name="partidaRegistral"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <RequiredLabel isRequired={true}>
                  Partida Registral
                </RequiredLabel>
                <FormControl>
                  <Input
                    placeholder="11029384"
                    autoComplete="off"
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

          {/* Teléfono */}
          <FormField
            control={form.control}
            name="telefono"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <RequiredLabel isRequired={true}>Teléfono</RequiredLabel>
                <FormControl>
                  <Input
                    placeholder="987654321"
                    autoComplete="off"
                    {...field}
                    className={`transition-all bg-white ${
                      fieldState.invalid
                        ? "border-red-400 focus-visible:ring-red-100"
                        : "border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-500"
                    }`}
                    maxLength={9}
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* Correo Electrónico */}
          <FormField
            control={form.control}
            name="emailPersonal"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <RequiredLabel isRequired={true}>
                  Correo Electrónico
                </RequiredLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="representante@empresa.com"
                    autoComplete="off"
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

          {/* OSPE */}
          <FormField
            control={form.control}
            name="ospe"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <RequiredLabel isRequired={true}>OSPE</RequiredLabel>
                <FormControl>
                  <Input
                    placeholder="Chiclayo"
                    autoComplete="off"
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
      </fieldset>
    </div>
  );
};
