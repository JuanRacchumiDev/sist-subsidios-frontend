import { RequiredLabel } from "@/components/Common/RequiredLabel";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../DescansoMedicoForm";
import { getDiagnosticos } from "@/services/diagnosticoService";
import { Diagnostico } from "@/interfaces/IDiagnostico";
import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import SearchableCombobox from "@/components/Common/SearchableCombobox";

interface DatosMedicosProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const dataDiagnosticos = async () => {
  let diagnosticos: Diagnostico[] = [];
  const response = await getDiagnosticos();
  const { result, data } = response;
  if (result && data) {
    diagnosticos = data as Diagnostico[];
  }
  return diagnosticos;
};

export const DatosMedicos = ({ form }: DatosMedicosProps) => {
  const { showToast } = useToast();

  const [dxs, setDxs] = useState<Diagnostico[]>([]);

  // Id del diagnóstico seleccionado
  const selectedDiagnosticoId = form.watch("idDiagnostico");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dxsRes] = await Promise.all([dataDiagnosticos()]);

        setDxs(dxsRes);
      } catch (error) {
        console.error("Error al obtener datos", error);
        showToast("error", "Error al cargar los datos del formulario.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="colegiadoMedico"
        render={({ field, fieldState }) => (
          <FormItem>
            <RequiredLabel>Colegiado Médico</RequiredLabel>
            <FormControl>
              <Input
                placeholder="Ingrese el número de colegiado"
                autoComplete="off"
                maxLength={6}
                {...field}
                className={fieldState.invalid ? "border-red-500" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="medicoTratante"
        render={({ field, fieldState }) => (
          <FormItem>
            <RequiredLabel>Médico Tratante</RequiredLabel>
            <FormControl>
              <Input
                placeholder="Ingrese nombre del médico"
                autoComplete="off"
                maxLength={50}
                {...field}
                className={fieldState.invalid ? "border-red-500" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="idDiagnostico"
        render={({ field, fieldState }) => {
          const selectedDiagnostico = dxs.find(
            (dx) => dx.codCie10 === field.value
          );

          return (
            <FormItem className="flex flex-col">
              <RequiredLabel>Diagnóstico</RequiredLabel>
              <SearchableCombobox<Diagnostico>
                placeholder="Buscar un diagnóstico"
                options={dxs}
                value={field.value}
                onChange={field.onChange}
                displayKey="nombre"
                valueKey="codCie10"
                // isInvalid={fieldState.invalid}
              />
              {selectedDiagnostico && (
                <FormDescription>
                  Diagnóstico seleccionado: <b>{selectedDiagnostico.nombre}</b>
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="nombreEstablecimiento"
        render={({ field, fieldState }) => (
          <FormItem>
            <RequiredLabel>Establecimiento</RequiredLabel>
            <FormControl>
              <Input
                placeholder="Ingrese nombre del establecimiento de salud"
                autoComplete="off"
                maxLength={100}
                {...field}
                className={fieldState.invalid ? "border-red-500" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
