import React from "react";
import { DocumentoContingencia } from "@/interfaces/IDocumentoContingencia";
import { Adjunto } from "@/interfaces/IAdjunto";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../DescansoMedico/DescansoMedicoForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RequiredLabel } from "@/components/Common/RequiredLabel";
import { Eye, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/context/ToastContext";
import { uploadAdjunto, viewAdjunto } from "../../services/adjuntoService";
import { responseViewFile } from "../../types/TFile";

interface DocumentosRequeridosProps {
  documentos: DocumentoContingencia[];
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const Documentos = ({ documentos, form }: DocumentosRequeridosProps) => {
  const { showToast } = useToast();

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
    idDocumento: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create FormData object
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_documento", idDocumento);

    try {
      const response = await uploadAdjunto(formData);
      console.log("response upload file", response);

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
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
      <h3 className="font-semibold text-lg col-span-full">
        Documentos Requeridos
      </h3>
      {documentos.map((doc) => (
        <FormField
          key={doc.id}
          control={form.control}
          name={`documentos.${doc.id}`}
          render={() => {
            const uploadedFileId = form.watch(`documentos.${doc.id}`);
            return (
              <FormItem>
                <RequiredLabel>{doc.nombre}</RequiredLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={`file-input-${doc.id}`}
                      className="flex items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadedFileId ? "Cambiar Documento" : "Subir Documento"}
                    </label>
                    <input
                      id={`file-input-${doc.id}`}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, doc.id)}
                    />
                    {uploadedFileId && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewDocument(uploadedFileId)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      ))}
    </div>
  );
};

export default Documentos;
