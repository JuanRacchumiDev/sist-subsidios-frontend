import { Route, Routes } from "react-router-dom";
import { ColaboradorForm } from "./ColaboradorForm";
import { ColaboradorList } from "./ColaboradorList";

export const ColaboradorPage = () => {
  return (
    <div>
      <Routes>
        <Route path="/listado" element={<ColaboradorList />} />
        <Route path="/nuevo" element={<ColaboradorForm />} />
      </Routes>
    </div>
  );
};
