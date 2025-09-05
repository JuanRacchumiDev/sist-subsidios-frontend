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
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DescansoMedicoDetalle } from "./Tabs/DescansoMedicoDetalle";
import { DatosMedicos } from "./Tabs/DatosMedicos";
import { InfoModal } from "../Common/InfoModal";
import { Button } from "../ui/button";
import { Spinner } from "../Common/Spinner";
import { useNavigate } from "react-router-dom";
import { Validacion } from "./Tabs/Validacion";
import { DescansoMedico } from "@/interfaces/IDescansoMedico";
import { formatDateToString } from "@/utils/formatDate";
import { getColaboradorById } from "@/services/colaboradorService";
import { Colaborador } from "@/interfaces/IColaborador";
import { getTipoDescansoById } from "@/services/tipoDescansoMedicoService";
import { TipoDescansoMedico } from "@/interfaces/ITipoDescansoMedico";
import { getTipoContingenciaById } from "@/services/tipoContingenciaService";
import { TipoContingencia } from "@/interfaces/ITipoContingencia";
import { getDiagnosticoByCodigo } from "@/services/diagnosticoService";
import { Diagnostico } from "@/interfaces/IDiagnostico";
import { createDescanso } from "@/services/descansoMedicoService";
import { useToast } from "../../context/ToastContext";
import { EstadoDescansoMedico } from "@/enums/EstadoRegistro";

export const formSchema = z.object({
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
  totalDias: z.string().optional(),
  colegiadoMedico: z.string().min(1, "El número de colegiado es requerido"),
  medicoTratante: z
    .string()
    .min(1, "El nombre del médico tratante es requerido"),
  idDiagnostico: z
    .string({
      message: "Debe seleccionar un diagnóstico",
    })
    .min(1, "Debe seleccionar un diagnóstico"),
  nombreEstablecimiento: z
    .string()
    .min(1, "El nombre del médico tratante es requerido"),
  documentos: z.record(z.string(), z.any()).optional(),
  aceptaResponsabilidad: z.boolean().optional(),
  aceptaPoliticaSubsidio: z.boolean().optional(),
  estadoRegistro: z.string().optional(),
  observacion: z.string().optional(),
});

export const DescansoMedicoForm = () => {
  const [showResponsabilidad, setShowResponsabilidad] = useState(false);
  const [showPoliticaSubsidio, setShowPoliticaSubsidio] = useState(false);

  const [activeTab, setActiveTab] = useState("datos-descanso-medico");

  const navigate = useNavigate();

  const { showToast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idEmpresa: "",
      idColaborador: "",
      idTipoDescansoMedico: "",
      idTipoContingencia: "",
      fechaOtorgamiento: null,
      fechaInicio: null,
      fechaFinal: null,
      totalDias: "",
      colegiadoMedico: "",
      medicoTratante: "",
      idDiagnostico: "",
      nombreEstablecimiento: "",
      documentos: {},
      aceptaResponsabilidad: false,
      aceptaPoliticaSubsidio: false,
      estadoRegistro: "",
      observacion: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const {
        idColaborador,
        idTipoDescansoMedico,
        idTipoContingencia,
        idDiagnostico,
        fechaOtorgamiento,
        fechaInicio,
        fechaFinal,
        colegiadoMedico,
        medicoTratante,
        totalDias,
        aceptaPoliticaSubsidio,
        aceptaResponsabilidad,
        estadoRegistro,
        nombreEstablecimiento,
      } = values;

      // Obteniendo la fecha actual en formato yyyy-mm-dd
      const fechaRegistro = formatDateToString(new Date());

      // Obtener el nombre del colaborador
      let nombreColaborador: string = "";
      const responseColaborador = await getColaboradorById(idColaborador);
      console.log({ responseColaborador });
      const { result: resultCol, data: dataCol } = responseColaborador;
      if (resultCol && dataCol) {
        const { nombres, apellido_paterno, apellido_materno } =
          dataCol as Colaborador;
        nombreColaborador = `${nombres} ${apellido_paterno} ${apellido_materno}`;
      }

      // Obtener tipo de descanso médico
      let nombreTipoDescanso: string = "";
      const responseTipoDescanso = await getTipoDescansoById(
        idTipoDescansoMedico
      );
      console.log({ responseTipoDescanso });
      const { result: resultTipoDescanso, data: dataTipoDescanso } =
        responseTipoDescanso;
      if (resultTipoDescanso && dataTipoDescanso) {
        const { nombre } = dataTipoDescanso as TipoDescansoMedico;
        nombreTipoDescanso = nombre;
      }

      // Obtener tipo de contingencia
      let nombreTipoContingencia: string = "";
      const responseTipoContingencia = await getTipoContingenciaById(
        idTipoContingencia
      );
      console.log({ responseTipoContingencia });
      const { result: resultTipoContingencia, data: dataTipoContingencia } =
        responseTipoContingencia;
      if (resultTipoContingencia && dataTipoContingencia) {
        const { nombre } = dataTipoContingencia as TipoContingencia;
        nombreTipoContingencia = nombre;
      }

      // Obtener diagnóstico
      let nombreDiagnostico: string = "";
      const responseDiagnostico = await getDiagnosticoByCodigo(idDiagnostico);
      console.log({ responseDiagnostico });
      const { result: resultDx, data: dataDx } = responseDiagnostico;
      if (resultDx && dataDx) {
        const { nombre } = dataDx as Diagnostico;
        nombreDiagnostico = nombre;
      }

      const payloadDescansoMedico: DescansoMedico = {
        id_colaborador: idColaborador,
        id_tipodescansomedico: idTipoDescansoMedico,
        id_tipocontingencia: idTipoContingencia,
        codcie10_diagnostico: idDiagnostico,
        codigo: "DM-2025-0001",
        fecha_otorgamiento: formatDateToString(fechaOtorgamiento),
        fecha_inicio: formatDateToString(fechaInicio),
        fecha_final: formatDateToString(fechaFinal),
        fecha_registro: fechaRegistro,
        numero_colegiatura: colegiadoMedico,
        medico_tratante: medicoTratante,
        total_dias: parseInt(totalDias),
        is_acepta_responsabilidad: aceptaResponsabilidad,
        is_acepta_politica: aceptaPoliticaSubsidio,
        nombre_colaborador: nombreColaborador,
        nombre_tipodescansomedico: nombreTipoDescanso,
        nombre_tipocontingencia: nombreTipoContingencia,
        nombre_diagnostico: nombreDiagnostico,
        nombre_establecimiento: nombreEstablecimiento,
        estado_registro: estadoRegistro as EstadoDescansoMedico,
      };

      const responseNewDescanso = await createDescanso(payloadDescansoMedico);
      const { result: resultNewDescanso, message: messageNewDescanso } =
        responseNewDescanso;

      if (resultNewDescanso) {
        showToast("success", messageNewDescanso);
        navigate("/descanso-medico");
      } else {
        showToast(
          "error",
          messageNewDescanso || "Error al registrar el representante legal"
        );
        return;
      }
    } catch (error) {
      console.error("Error al registrar cargo", error);
      showToast("error", error);
    }
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
                  <TabsTrigger value="validacion">Validación</TabsTrigger>
                </TabsList>

                <TabsContent value="datos-descanso-medico" className="mt-6">
                  <DescansoMedicoDetalle form={form} />
                </TabsContent>

                <TabsContent value="datos-medicos" className="mt-6">
                  <DatosMedicos form={form} />
                </TabsContent>

                <TabsContent value="validacion" className="mt-6">
                  <Validacion form={form} />
                </TabsContent>
              </Tabs>

              <div className="space-y-4 mt-6">
                <FormField
                  control={form.control}
                  name="aceptaResponsabilidad"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          id="responsabilidad"
                        />
                        <label
                          htmlFor="responsabilidad"
                          className="text-sm text-gray-700"
                        >
                          Declaro que la información proporcionada es verdadera
                          y es mi responsabilidad
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowResponsabilidad(true)}
                          className="text-blue-500 underline text-sm"
                        >
                          Ver más
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aceptaPoliticaSubsidio"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          id="politicaSubsidio"
                        />
                        <label
                          htmlFor="politicaSubsidio"
                          className="text-sm text-gray-700"
                        >
                          Acepto la política de la empresa en caso de subsidio
                          por documentación incorrecta
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPoliticaSubsidio(true)}
                          className="text-blue-500 underline text-sm"
                        >
                          Ver más
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => navigate("/descanso-medico")}
                >
                  {isSubmitting ? "Cancelando..." : "Cancelar"}
                </Button>
              </div>
            </form>

            {/* Modales informativos */}
            <InfoModal
              open={showResponsabilidad}
              onClose={() => setShowResponsabilidad(false)}
              title="Responsabilidad del colaborador"
              content="Como colaborador, usted es responsable de la veracidad y autenticidad de los documentos entregados"
            />

            <InfoModal
              open={showPoliticaSubsidio}
              onClose={() => setShowPoliticaSubsidio(false)}
              title="Política de subsidio"
              content="La empresa se reserva el derecho de rechazar subsidios si la documentación no está completa o es observada"
            />
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
