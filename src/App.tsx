import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";
import { Dashboard } from "./components/Dashboard/Dashboard";
// import { AnalyticsPage } from "./components/Analytics/AnalyticsPage";
// import { UserPage } from "./components/Users/UserPage";
import { LoginPage } from "./components/Auth/LoginPage";
import { NotFoundPage } from "./components/Layout/NotFoundPage";

import { ColaboradorListPage } from "./components/Colaborador/Page/ColaboradorListPage";
import { ColaboradorFormPage } from "./components/Colaborador/Page/ColaboradorFormPage";

import { EmpresaListPage } from "./components/Empresa/Page/EmpresaListPage";
import { EmpresaFormPage } from "./components/Empresa/Page/EmpresaFormPage";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
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
            <div className="p-6 space-y-6">
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
                      path="/empresa"
                      element={<EmpresaListPage />}
                    ></Route>
                    <Route
                      path="/empresa/nuevo"
                      element={<EmpresaFormPage />}
                    ></Route>

                    <Route
                      path="/mantenimiento/*"
                      element={<MantenimientoPage />}
                    ></Route>
                    {/* <Route
                      path="/analytics/*"
                      element={<AnalyticsPage />}
                    ></Route> */}
                    {/* <Route
                      path="/colaborador/*"
                      element={<ColaboradorPage />}
                    ></Route>
                    <Route path="/cargo/*" element={<CargoPage />}></Route> */}
                    {/* <Route path="/users/*" element={<UserPage />}></Route> */}
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
