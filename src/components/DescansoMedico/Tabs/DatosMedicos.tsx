import { RequiredLabel } from "../../../components/Common/RequiredLabel";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../DescansoMedicoForm";
import { getDiagnosticos } from "../../../services/diagnosticoService";
import { Diagnostico } from "../../../interfaces/IDiagnostico";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import SearchableCombobox from "../../../components/Common/SearchableCombobox";

interface DatosMedicosProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  isModeLetter?: boolean;
}

// Interfaz para el diagnóstico formateado
interface DiagnosticoConFormato extends Diagnostico {
  display: string;
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

export const DatosMedicos = ({
  form,
  isModeLetter = false,
}: DatosMedicosProps) => {
  const { showToast } = useToast();

  const [dxs, setDxs] = useState<Diagnostico[]>([]);

  // Id del diagnóstico seleccionado
  // const selectedDiagnosticoId = form.watch("idDiagnostico");

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

  const formattedDxs: DiagnosticoConFormato[] = useMemo(() => {
    return dxs.map((dx) => ({
      ...dx,
      display: `${dx.codCie10} - ${dx.nombre}`,
    }));
  }, [dxs]);

  // Id del diagnóstico seleccionado
  const selectedDiagnosticoId = form.watch("idDiagnostico");
  const selectedDiagnostico = formattedDxs.find(
    (dx) => dx.codCie10 === selectedDiagnosticoId
  );

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
                className={`
                  ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }
                    transition-all duration-300
                `}
                disabled={isModeLetter}
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
                className={`
                  ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }
                    transition-all duration-300
                `}
                disabled={isModeLetter}
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
          // const selectedDiagnostico = dxs.find(
          //   (dx) => dx.codCie10 === field.value
          // );

          return (
            <FormItem className="flex flex-col">
              <RequiredLabel>Diagnóstico</RequiredLabel>
              <SearchableCombobox<DiagnosticoConFormato>
                placeholder="Buscar un diagnóstico"
                options={formattedDxs}
                value={field.value}
                onChange={field.onChange}
                displayKey="display"
                valueKey="codCie10"
                searchKeys={["codCie10", "nombre"]}
                disabled={isModeLetter}
              />
              {/* {selectedDiagnostico && (
                <FormDescription>
                  Diagnóstico seleccionado: <b>{selectedDiagnostico.nombre}</b>
                </FormDescription>
              )} */}
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
                className={`
                  ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }
                    transition-all duration-300
                `}
                disabled={isModeLetter}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
