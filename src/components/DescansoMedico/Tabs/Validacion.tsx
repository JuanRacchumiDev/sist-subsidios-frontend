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
  isModeLetter?: boolean;
}

export const Validacion = ({ form, isModeLetter = false }: ValidacionProps) => {
  console.log("---- variable form in component Validacion ----");
  console.log({ form });

  console.log("---- variable isModeLetter in component Validacion ----");
  console.log({ isModeLetter });

  const { id } = useParams<{ id: string }>();
  const userProfile = useMemo(() => getAuthData()?.usuario, []);
  const isEditMode = !!id;

  const estadoRegistro = form.watch("estadoRegistro");

  const { estadosPermitidos } = useMemo(() => {
    const estadosPermitidos: EDescansoMedico[] = [];
    let isDisabled = false;

    const { nombre_perfil_url } = userProfile;

    console.log("---- nombre_perfil_url in component Validacion ----");
    console.log({ nombre_perfil_url });

    if (nombre_perfil_url === "especialista-empresa") {
      estadosPermitidos.push(EDescansoMedico.REGISTRO_INGRESADO);
      estadosPermitidos.push(EDescansoMedico.REGISTRO_EXITOSO);
      estadosPermitidos.push(EDescansoMedico.DOCUMENTACION_NO_CONFORME);
    } else if (nombre_perfil_url === "especialista-sophia-human") {
      estadosPermitidos.push(EDescansoMedico.REGISTRO_INGRESADO);
      estadosPermitidos.push(EDescansoMedico.REGISTRO_EXITOSO);
      estadosPermitidos.push(EDescansoMedico.DOCUMENTACION_NO_CONFORME);
    } else if (nombre_perfil_url === "colaborador") {
      if (isEditMode) {
        estadosPermitidos.push(
          form.getValues("estadoRegistro") as EDescansoMedico,
        );
        isDisabled = true;
      } else {
        estadosPermitidos.push(EDescansoMedico.REGISTRO_INGRESADO);
        isDisabled = true;
      }
    } else if (nombre_perfil_url === "administrador") {
      estadosPermitidos.push(EDescansoMedico.REGISTRO_INGRESADO);
      estadosPermitidos.push(EDescansoMedico.REGISTRO_EXITOSO);
      estadosPermitidos.push(EDescansoMedico.DOCUMENTACION_NO_CONFORME);
      isDisabled = false;
    }

    return { estadosPermitidos, isDisabled };
  }, [userProfile, isEditMode, form]);

  useEffect(() => {
    if (
      estadoRegistro === EDescansoMedico.DOCUMENTACION_NO_CONFORME &&
      !form.getValues("observacion")
    ) {
      form.setValue("observacion", "Pendiente adjuntar documentación.");
    }
  }, [estadoRegistro, form]);

  const showObservacion =
    estadoRegistro === EDescansoMedico.DOCUMENTACION_NO_CONFORME;

  return (
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="estadoRegistro"
        render={({ field, fieldState }) => (
          <FormItem className="w-full">
            <RequiredLabel>Estado del registro</RequiredLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger
                  className={`w-full ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } focus:ring-2 focus:ring-offset-2 transition-all duration-300 cursor-pointer `}
                >
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
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

      {showObservacion && (
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
      )}
    </div>
  );
};
