import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { formSchema } from "../DescansoMedicoForm";
import { UseFormReturn } from "react-hook-form";
import { RequiredLabel } from "@/components/Common/RequiredLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import {
  MENSAJES_OBSERVACION,
  EstadoDescansoMedico,
  LIST_ESTADOS_DESCANSOS_MEDICOS,
} from "@/helpers/HMessages";

interface ValidacionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const Validacion = ({ form }: ValidacionProps) => {
  return (
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="estadoRegistro"
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Estado del registro</RequiredLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.values(EstadoDescansoMedico).map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {
                      LIST_ESTADOS_DESCANSOS_MEDICOS[
                        estado as EstadoDescansoMedico
                      ]
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="observacion"
        render={({ field }) => {
          const estado = form.watch("estadoRegistro");
          const messageDefault = MENSAJES_OBSERVACION[estado] ?? "";

          useEffect(() => {
            if (
              estado === EstadoDescansoMedico.DOCUMENTACION_INCORRECTA &&
              !field.value
            ) {
              field.onChange(messageDefault);
            }
          }, [estado, field]);

          return (
            <FormItem>
              <RequiredLabel>Observación</RequiredLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalle la documentación pendiente..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};
