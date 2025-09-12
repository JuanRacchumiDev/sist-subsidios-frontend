import { Route, Routes } from "react-router-dom";
import { CargoList } from "./Cargo/CargoList";
import { CargoForm } from "./Cargo/CargoForm";
import { DocumentoTipoContingenciaList } from "./DocumentoTipoContingencia/DocumentoTipoContingenciaList";
import { DocumentoTipoContigenciaForm } from "./DocumentoTipoContingencia/DocumentoTipoContingenciaForm";

export const MantenimientoPage = () => {
  return (
    <div>
      <Routes>
        <Route path="/cargo" element={<CargoList />} />
        <Route path="/cargo/nuevo" element={<CargoForm />} />
        <Route path="/cargo/editar/:id" element={<CargoForm />} />

        <Route
          path="/documento-tipo-contingencia"
          element={<DocumentoTipoContingenciaList />}
        />
        <Route
          path="/documento-tipo-contingencia/nuevo"
          element={<DocumentoTipoContigenciaForm />}
        />
        <Route
          path="/documento-tipo-contingencia/editar/:id"
          element={<DocumentoTipoContigenciaForm />}
        />
      </Routes>
    </div>
  );
};
