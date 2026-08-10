import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { LoginPage } from "./components/Auth/Page/LoginPage";
import { NotFoundPage } from "./components/Layout/NotFoundPage";

import { EmpresaListPage } from "./components/Empresa/Page/EmpresaListPage";
import { EmpresaFormPage } from "./components/Empresa/Page/EmpresaFormPage";

import { TrabajadorSocialListPage } from "./components/TrabajadorSocial/Page/TrabajadorSocialListPage";
import { TrabajadorSocialFormPage } from "./components/TrabajadorSocial/Page/TrabajadorSocialFormPage";

import { ColaboradorListPage } from "./components/Colaborador/Page/ColaboradorListPage";
import { ColaboradorFormPage } from "./components/Colaborador/Page/ColaboradorFormPage";

import { EspecialistaClienteListPage } from "./components/EspecialistaCliente/Page/EspecialistaClienteListPage";
import { EspecialistaClienteFormPage } from "./components/EspecialistaCliente/Page/EspecialistaClienteFormPage";

import { EspecialistaSHListPage } from "./components/EspecialistaSH/Page/EspecialistaSHListPage";
import { EspecialistaSHFormPage } from "./components/EspecialistaSH/Page/EspecialistaSHFormPage";

import { DescansoMedicoListPage } from "./components/DescansoMedico/Page/DescansoMedicoListPage";
import { DescansoMedicoFormPage } from "./components/DescansoMedico/Page/DescansoMedicoFormPage";

import { CanjeListPage } from "./components/Canje/Page/CanjeListPage";
import { CanjeFormPage } from "./components/Canje/Page/CanjeFormPage";

import { ReembolsoListPage } from "./components/Reembolso/Page/ReembolsoListPage";
import { ReembolsoFormPage } from "./components/Reembolso/Page/ReembolsoFormPage";

import { CobroListPage } from "./components/Cobro/Page/CobroListPage";
import { CobroFormPage } from "./components/Cobro/Page/CobroFormPage";

import { UsuarioListPage } from "./components/Usuario/Page/UsuarioListPage";
import { UsuarioFormPage } from "./components/Usuario/Page/UsuarioFormPage";

import { MantenimientoPage } from "./components/Mantenimiento/MantenimientoPage";

function App() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Verificamos si estamos en la página de login
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";

  const handleLogin = (isSuccess: boolean) => {
    setIsLoggedIn(isSuccess);
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");

    if (storedAuth) {
      setIsLoggedIn(true);
    } else if (!isLoginPage) {
      navigate("/login");
    }
  }, [isLoginPage, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-500">
      <div className="flex h-screen overflow-hidden">
        {!isLoginPage && isLoggedIn && (
          <Sidebar
            collapsed={sideBarCollapsed}
            onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
            currentPage={location.pathname}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {!isLoginPage && isLoggedIn && (
            <Header
              sidebarCollapsed={sideBarCollapsed}
              onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
            />
          )}

          <main className="flex-1 overflow-y-auto bg-transparent">
            {/* Clases dinámicas: Si es LoginPage no se aplica relleno ni espaciado, en rutas internas sí */}
            <div className={isLoginPage ? "h-full w-full" : "p-6 space-y-6"}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <LoginPage onLoginSuccess={() => handleLogin(true)} />
                  }
                />
                <Route
                  path="/login"
                  element={
                    <LoginPage onLoginSuccess={() => handleLogin(true)} />
                  }
                />

                {isLoggedIn ? (
                  <>
                    <Route path="/dashboard" element={<Dashboard />}></Route>

                    <Route
                      path="/colaborador"
                      element={<ColaboradorListPage />}
                    ></Route>
                    <Route
                      path="/colaborador/nuevo"
                      element={<ColaboradorFormPage />}
                    ></Route>
                    <Route
                      path="/colaborador/editar/:id"
                      element={<ColaboradorFormPage />}
                    ></Route>

                    <Route
                      path="/trabajador-social"
                      element={<TrabajadorSocialListPage />}
                    ></Route>
                    <Route
                      path="/trabajador-social/nuevo"
                      element={<TrabajadorSocialFormPage />}
                    ></Route>
                    <Route
                      path="/trabajador-social/editar/:id"
                      element={<TrabajadorSocialFormPage />}
                    ></Route>

                    <Route
                      path="/especialista-cliente"
                      element={<EspecialistaClienteListPage />}
                    ></Route>
                    <Route
                      path="/especialista-cliente/nuevo"
                      element={<EspecialistaClienteFormPage />}
                    ></Route>
                    <Route
                      path="/especialista-cliente/editar/:id"
                      element={<EspecialistaClienteFormPage />}
                    ></Route>

                    <Route
                      path="/especialista-sh"
                      element={<EspecialistaSHListPage />}
                    ></Route>
                    <Route
                      path="/especialista-sh/nuevo"
                      element={<EspecialistaSHFormPage />}
                    ></Route>
                    <Route
                      path="/especialista-sh/editar/:id"
                      element={<EspecialistaSHFormPage />}
                    ></Route>

                    <Route
                      path="/empresa"
                      element={<EmpresaListPage />}
                    ></Route>
                    <Route
                      path="/empresa/nuevo"
                      element={<EmpresaFormPage />}
                    ></Route>
                    <Route
                      path="/empresa/editar/:id"
                      element={<EmpresaFormPage />}
                    ></Route>

                    <Route
                      path="/descanso-medico"
                      element={<DescansoMedicoListPage />}
                    ></Route>
                    <Route
                      path="/descanso-medico/nuevo"
                      element={<DescansoMedicoFormPage />}
                    ></Route>
                    <Route
                      path="/descanso-medico/editar/:id"
                      element={<DescansoMedicoFormPage />}
                    ></Route>

                    <Route path="/canje" element={<CanjeListPage />}></Route>
                    <Route
                      path="/canje/editar/:id"
                      element={<CanjeFormPage />}
                    ></Route>

                    <Route
                      path="/reembolso"
                      element={<ReembolsoListPage />}
                    ></Route>
                    <Route
                      path="/reembolso/nuevo"
                      element={<ReembolsoFormPage />}
                    ></Route>
                    <Route
                      path="/reembolso/editar/:id"
                      element={<ReembolsoFormPage />}
                    ></Route>

                    <Route path="/cobro" element={<CobroListPage />}></Route>
                    <Route
                      path="/cobro/nuevo"
                      element={<CobroFormPage />}
                    ></Route>
                    <Route
                      path="/cobro/editar/:id"
                      element={<CobroFormPage />}
                    ></Route>

                    <Route
                      path="/usuario"
                      element={<UsuarioListPage />}
                    ></Route>
                    <Route
                      path="/usuario/nuevo"
                      element={<UsuarioFormPage />}
                    ></Route>

                    <Route
                      path="/mantenimiento/*"
                      element={<MantenimientoPage />}
                    ></Route>
                  </>
                ) : (
                  <Route
                    path="*"
                    element={
                      <LoginPage onLoginSuccess={() => handleLogin(true)} />
                    }
                  />
                )}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
