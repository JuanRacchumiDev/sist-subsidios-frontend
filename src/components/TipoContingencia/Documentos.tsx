import React, { useEffect } from "react";
import { DocumentoTipoContingencia } from "../../interfaces/IDocumentoTipoContingencia";
import { Adjunto } from "../../interfaces/IAdjunto";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../DescansoMedico/DescansoMedicoForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../components/ui/form";
import { RequiredLabel } from "../../components/Common/RequiredLabel";
import { Eye, Upload, FileCheck } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../../context/ToastContext";
import { uploadAdjunto, viewAdjunto } from "../../services/adjuntoService";
import { responseViewFile } from "../../types/TFile";
import { getEmpresaById } from "../../services/empresaService";
import { Empresa } from "../../interfaces/IEmpresa";
import { getPersonaById } from "../../services/personaService";
import { Persona } from "../../interfaces/IPersona";
import { cn } from "../../lib/utils";

interface DocumentosRequeridosProps {
  documentos: DocumentoTipoContingencia[];
  form: UseFormReturn<z.infer<typeof formSchema>>;
  adjuntosExistentes?: Adjunto[];
  isModeLetter?: boolean;
  idDescanso?: string;
  maxFileSizeMb?: number; // Prop opcional para definir el límite en MB (Por defecto: 2)
}

export const Documentos = ({
  documentos,
  form,
  adjuntosExistentes = [],
  isModeLetter = false,
  idDescanso = "",
  maxFileSizeMb = 2,
}: DocumentosRequeridosProps) => {
  const { showToast } = useToast();

  useEffect(() => {
    adjuntosExistentes.forEach((adjunto) => {
      if (adjunto.id_documento) {
        form.setValue(`documentos.${adjunto.id_documento}`, adjunto.id);
      }
    });
  }, [adjuntosExistentes, form]);

  const handleViewDocument = async (id: string) => {
    try {
      const response: responseViewFile = await viewAdjunto(id);
      const { result, data } = response;

      if (result && data) {
        const { url } = data;
        window.open(url, "_blank");
      } else {
        showToast("error", "Error al obtener el documento");
      }
    } catch (error) {
      console.error("Error viewing file:", error);
      showToast("error", "Error al ver el documento.");
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    idDocumento: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // --- 1. VALIDACIÓN DE FORMATO PDF ---
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    if (!isPdf) {
      showToast("error", "Solo se permiten archivos en formato PDF.");
      e.target.value = "";
      return;
    }

    // --- 2. VALIDACIÓN DE TAMAÑO EN MB ---
    const maxSizeBytes = maxFileSizeMb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showToast(
        "error",
        `El archivo supera el límite máximo de ${maxFileSizeMb} MB.`,
      );
      e.target.value = "";
      return;
    }

    let paramsAdjunto: Adjunto | null = null;
    const idEmpresa = form.getValues("idEmpresa");
    const idColaborador = form.getValues("idColaborador");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_documento", idDocumento);

    // Validando si existe el id de descanso médico
    if (idDescanso && idDescanso.length > 0) {
      formData.append("id_descansomedico", idDescanso);
      paramsAdjunto = {
        id_descansomedico: idDescanso,
        id_documento: idDocumento,
      };
    }

    if (idEmpresa) {
      const responseEmpresa = await getEmpresaById(idEmpresa);
      const { result, data } = responseEmpresa;
      if (result && data) {
        const { numero } = data as Empresa;
        formData.append("ruc", numero);
      }
    }

    if (idColaborador) {
      const responseColaborador = await getPersonaById(idColaborador);
      const { result, data } = responseColaborador;
      if (result && data) {
        const { id: idPersona, numero_documento } = data as Persona;
        formData.append("id_persona", idPersona);
        formData.append("numero_documento", numero_documento);
      }
    }

    try {
      const response = await uploadAdjunto(paramsAdjunto, formData);
      const { result, data, message } = response;

      if (result && data) {
        const dataAdjunto = data as Adjunto;
        const { id } = dataAdjunto;
        form.setValue(`documentos.${idDocumento}`, id);
        showToast("success", message || "Documento subido con éxito.");
      } else {
        showToast("error", message || "Error al subir el documento.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast("error", "Error al subir el documento.");
    } finally {
      e.target.value = ""; // Limpia el valor para permitir volver a subir el mismo archivo
    }
  };

  if (!documentos || documentos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 col-span-full border-t border-gray-100 pt-3 mt-1">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-xs text-gray-800 tracking-tight">
          Documentos Requeridos
        </h3>
        <span className="text-[10px] text-gray-400">
          Formato: PDF (Máx. {maxFileSizeMb}MB)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {documentos.map((doc) => {
          const uploadedFileId = form.watch(`documentos.${doc.id}`);
          const existingAdjunto = adjuntosExistentes.find(
            (adj) => adj.id_documento === doc.id,
          );
          const fileIdToUse = uploadedFileId || existingAdjunto?.id || null;

          return (
            <FormField
              key={doc.id}
              control={form.control}
              name={`documentos.${doc.id}`}
              render={() => {
                return (
                  <FormItem className="space-y-1">
                    <RequiredLabel className="text-[11px] font-medium text-gray-700 truncate block">
                      {doc.nombre}
                    </RequiredLabel>
                    <FormControl>
                      <div className="flex items-center gap-1.5">
                        <label
                          htmlFor={`file-input-${doc.id}`}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 h-8 px-2.5 border rounded-md text-xs transition-all duration-150 select-none",
                            isModeLetter
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : fileIdToUse
                                ? "bg-blue-50/50 border-blue-200 text-blue-700 hover:bg-blue-100/60 cursor-pointer font-medium"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer",
                          )}
                        >
                          {fileIdToUse ? (
                            <>
                              <FileCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                              <span className="truncate">Cambiar PDF</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                              <span className="truncate">Subir PDF</span>
                            </>
                          )}
                        </label>

                        <input
                          id={`file-input-${doc.id}`}
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, doc.id)}
                          disabled={isModeLetter}
                        />

                        {fileIdToUse && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 shrink-0 border-gray-300 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                            onClick={() => handleViewDocument(fileIdToUse)}
                            title="Ver documento"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                );
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Documentos;
