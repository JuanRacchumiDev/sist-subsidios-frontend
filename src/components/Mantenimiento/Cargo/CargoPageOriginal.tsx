import { Route, Routes } from "react-router-dom";
import { CargoList } from "./CargoList";
import { CargoForm } from "./CargoForm";

export const CargoPage = () => {
  return (
    <div>
      <Routes>
        <Route path="/listado" element={<CargoList />} />
        <Route path="/nuevo" element={<CargoForm />} />
      </Routes>
    </div>
  );
};
