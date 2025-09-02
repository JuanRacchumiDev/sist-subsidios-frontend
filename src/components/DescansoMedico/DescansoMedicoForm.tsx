import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "../ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DescansoMedicoDetalle } from "./Tabs/DescansoMedicoDetalle";
import { DatosMedicos } from "./Tabs/DatosMedicos";
import { v4 as uuidv4 } from "uuid";

export const formSchema = z.object({
  id: z.string().optional(),
  idEmpresa: z
    .string({
      message: "Debe seleccionar una empresa",
    })
    .min(1, "Debe seleccionar una empresa"),
  idColaborador: z
    .string({
      message: "Debe seleccionar un colaborador",
    })
    .min(1, "Debe seleccionar un colaborador"),
  idTipoDescansoMedico: z
    .string({
      message: "Debe seleccionar un tipo de descanso médico",
    })
    .min(1, "Debe seleccionar un tipo de descanso médico"),
  idTipoContingencia: z
    .string({
      message: "Debe seleccionar un tipo de contingencia",
    })
    .min(1, "Debe seleccionar un tipo de contingencia"),
  fechaOtorgamiento: z
    .date({
      message: "La fecha de otorgamiento es requerida",
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "La fecha de otorgamiento es requerida",
    }),
  fechaInicio: z
    .date({
      message: "La fecha de inicio es requerida",
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "La fecha de inicio es requerida",
    }),
  fechaFinal: z
    .date({
      message: "La fecha final es requerida",
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "La fecha final es requerida",
    }),
  colegiadoMedico: z.string().min(1, "El número de colegiado es requerido"),
  medicoTratante: z
    .string()
    .min(1, "El nombre del médico tratante es requerido"),
  documentos: z.record(z.string(), z.any()).optional(),
});

export const DescansoMedicoForm = () => {
  const [descansoId] = useState(uuidv4());

  const [activeTab, setActiveTab] = useState("datos-descanso-medico");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: descansoId,
      idEmpresa: "",
      idColaborador: "",
      idTipoDescansoMedico: "",
      idTipoContingencia: "",
      fechaOtorgamiento: null,
      fechaInicio: null,
      fechaFinal: null,
      colegiadoMedico: "",
      medicoTratante: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Handle form submission logic
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del descanso médico</CardTitle>
          <CardDescription>
            Complete el formulario para registrar un descanso médico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="datos-descanso-medico">
                    Datos del descanso médico
                  </TabsTrigger>
                  <TabsTrigger value="datos-medicos">Datos médicos</TabsTrigger>
                </TabsList>

                <TabsContent value="datos-descanso-medico" className="mt-6">
                  <DescansoMedicoDetalle form={form} />
                </TabsContent>

                <TabsContent value="datos-medicos" className="mt-6">
                  <DatosMedicos form={form} />
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
