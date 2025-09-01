import { Route, Routes } from "react-router-dom";
import { CargoList } from "./Cargo/CargoList";
import { CargoForm } from "./Cargo/CargoForm";

export const MantenimientoPage = () => {
  return (
    <div>
      <Routes>
        <Route path="/cargo" element={<CargoList />} />
        <Route path="/cargo/nuevo" element={<CargoForm />} />
        <Route path="/cargo/editar/:id" element={<CargoForm />} />
      </Routes>
    </div>
  );
};
