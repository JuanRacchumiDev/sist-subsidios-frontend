import { RequiredLabel } from "@/components/Common/RequiredLabel";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../DescansoMedicoForm";

interface DatosMedicosProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const DatosMedicos = ({ form }: DatosMedicosProps) => {
  return (
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="colegiadoMedico"
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Colegiado Médico</RequiredLabel>
            <FormControl>
              <Input
                placeholder="Ingrese el número de colegiado"
                autoComplete="off"
                maxLength={6}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="medicoTratante"
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Médico Tratante</RequiredLabel>
            <FormControl>
              <Input
                placeholder="Ingrese nombre del médico"
                autoComplete="off"
                maxLength={50}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
