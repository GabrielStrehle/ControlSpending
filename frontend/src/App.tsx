import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import PessoasPage from "./pages/Pessoas/PessoasPage";
import CategoriasPage from "./pages/Categorias/CategoriasPage";
import TransacoesPage from "./pages/Transacoes/TransacoesPage";
import TotaisPage from "./pages/Totais/TotaisPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <nav className="sidebar">
          <h1>Controle de Gastos</h1>
          <p className="subtitle">Gerenciamento residencial</p>
          <ul>
            <li>
              <NavLink to="/pessoas" className={({ isActive }) => isActive ? "active" : ""}>
                <span className="nav-icon">&#128100;</span> Pessoas
              </NavLink>
            </li>
            <li>
              <NavLink to="/categorias" className={({ isActive }) => isActive ? "active" : ""}>
                <span className="nav-icon">&#128193;</span> Categorias
              </NavLink>
            </li>
            <li>
              <NavLink to="/transacoes" className={({ isActive }) => isActive ? "active" : ""}>
                <span className="nav-icon">&#128176;</span> Transações
              </NavLink>
            </li>
            <li>
              <NavLink to="/totais" className={({ isActive }) => isActive ? "active" : ""}>
                <span className="nav-icon">&#128202;</span> Totais
              </NavLink>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/pessoas" replace />} />
            <Route path="/pessoas" element={<PessoasPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/transacoes" element={<TransacoesPage />} />
            <Route path="/totais" element={<TotaisPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
