import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import GamesPage from './pages/GamesPage';
import GamePage from './pages/GamePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import UserPage from './pages/UserPage';
import SupportPage from './pages/SupportPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Rota Pública Principal */}
          <Route path="/" element={<Home />} />
          
          {/* Rotas de Conteúdo */}
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:slug" element={<GamePage />} />
          <Route path="/support" element={<SupportPage />} />
          
          {/* Rotas Institucionais */}
          <Route path="/team" element={<div className="container"><h1>Equipe</h1></div>} />
          
          {/* Rotas de Autenticação */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Rotas de Usuário */}
          <Route path="/user/:id" element={<UserPage />} />
          
          {/* Rota 404 */}
          <Route path="*" element={<div className="container"><h1>404 - Página não encontrada</h1></div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;