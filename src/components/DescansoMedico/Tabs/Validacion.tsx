import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import { formSchema } from "../DescansoMedicoForm";
import { UseFormReturn } from "react-hook-form";
import { RequiredLabel } from "../../../components/Common/RequiredLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { useEffect, useMemo } from "react";
import { EDescansoMedico } from "../../../enums/EDescansoMedico";
import { getAuthData } from "../../../utils/authMemo";
import { useParams } from "react-router-dom";

interface ValidacionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const Validacion = ({ form }: ValidacionProps) => {
  const { id } = useParams<{ id: string }>();
  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  const isEditMode = !!id;

  const { estadosPermitidos, isDisabled } = useMemo(() => {
    const estadosPermitidos: EDescansoMedico[] = [];
    let isDisabled = false;

    // Lógica con usuarios con perfil id_colaborador
    if (userProfile?.id_colaborador) {
      if (isEditMode) {
        // En modo edición, el colaborador solo puede ver el estado actual, no cambiarlo.
        estadosPermitidos.push(
          form.getValues("estadoRegistro") as EDescansoMedico
        );
        isDisabled = true;
      } else {
        // En nuevo registro, el estado por defecto es "Registro ingresado" y está deshabilitado.
        estadosPermitidos.push(EDescansoMedico.REGISTRO_INGRESADO);
        isDisabled = true;
      }
    } else {
      // Lógica para id_especialista o id_administrador
      // Se muestran todos los estados excepto "Registro exitoso"
      Object.values(EDescansoMedico).forEach((estado) => {
        if (estado !== EDescansoMedico.REGISTRO_EXITOSO) {
          estadosPermitidos.push(estado);
        }
      });
    }

    return { estadosPermitidos, isDisabled };
  }, [userProfile, isEditMode, form]);

  useEffect(() => {
    // Si el estado es "Documentación incorrecta", se establece la observación por defecto
    // Se elimina la dependencia de MENSAJES_OBSERVACION
    if (
      form.watch("estadoRegistro") ===
        EDescansoMedico.DOCUMENTACION_INCORRECTA &&
      !form.getValues("observacion")
    ) {
      form.setValue("observacion", "Pendiente adjuntar documentación.");
    }
  }, [form.watch("estadoRegistro"), form]);

  return (
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="estadoRegistro"
        render={({ field, fieldState }) => (
          <FormItem>
            <RequiredLabel>Estado del registro</RequiredLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""}
              disabled={isDisabled}
            >
              <FormControl>
                <SelectTrigger
                  className={`
                    ${
                      fieldState.invalid
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500"
                    }
                      focus:ring-2 focus:ring-offset-2 transition-all duration-300
                  `}
                >
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {estadosPermitidos.map((estado) => (
                  <SelectItem
                    key={estado}
                    value={estado}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {estado}
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
        render={({ field, fieldState }) => (
          <FormItem>
            <RequiredLabel>Observación</RequiredLabel>
            <FormControl>
              <Textarea
                placeholder="Detalle la documentación pendiente..."
                {...field}
                className={`
                  ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }
                  transition-all duration-300
                `}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
