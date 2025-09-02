import { DocumentoContingencia } from "@/interfaces/IDocumentoContingencia";
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
import { Input } from "@/components/ui/input";
import { Eye, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/context/ToastContext";
import { uploadAdjunto } from "../../services/adjuntoService";
import React from "react";

interface DocumentosRequeridosProps {
  documentos: DocumentoContingencia[];
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const Documentos = ({ documentos, form }: DocumentosRequeridosProps) => {
  const { showToast } = useToast();

  console.log({ documentos });

  const handleViewDocument = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, "_blank");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create FormData object
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_tipoadjunto", "443374a4-3ad2-405b-81c7-c76fa09df51f");

    try {
      const response = await uploadAdjunto(formData);
      const { result, data, message } = response;

      if (result && data) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
      <h3 className="font-semibold text-lg col-span-full">
        Documentos Requeridos
      </h3>
      {documentos.map((doc) => (
        <FormField
          key={doc.id}
          control={form.control}
          name={`documentos.${doc.id}`}
          render={({ field }) => {
            const uploadedFileUrl = form.getValues(`documentos.${doc.id}`);
            // console.log(
            //   "doc id",
            //   doc.id,
            //   "doc nombre",
            //   doc.nombre,
            //   "uploadedFileUrl",
            //   uploadedFileUrl
            // );
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
                      {uploadedFileUrl
                        ? "Cambiar Documento"
                        : "Subir Documento"}
                    </label>
                    <input
                      id={`file-input-${doc.id}`}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e)}
                      //   onChange={(e) => {
                      //     const file = e.target.files?.[0];
                      //     field.onChange(file);
                      //   }}
                    />
                    {uploadedFileUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewDocument(uploadedFileUrl)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  /> */}
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
