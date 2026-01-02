import { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LogOut, User, ChevronDown, Gamepad2, LogIn, UserPlus } from 'lucide-react';
import './Navbar.css'; // Vamos criar este arquivo

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      {/* --- HEADER --- */}
      <header className="navbar-header">
        <div className="navbar-container">
          
          {/* 1. Logo à esquerda */}
          <Link to="/" className="navbar-logo">
            <span>BadCatFor</span>
          </Link>

          {/* 2. Navegação Central */}
          <nav className="navbar-links">
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <Link to="/games" className="navbar-link">
              <Gamepad2 size={16} />
              <span>Jogos</span>
            </Link>
          </nav>

          {/* 3. Área do Usuário (Direita) */}
          <div className="navbar-user-area">
            <div className="navbar-user-menu" ref={menuRef}>
              {/* Botão do usuário - SEMPRE VISÍVEL */}
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="navbar-user-button"
              >
                {user ? (
                  <>
                    <img 
                      src={user.photo || "https://placehold.co/100x100?text=U"} 
                      alt="Avatar" 
                      className="navbar-user-avatar"
                    />
                    <span className="navbar-user-name">
                      {user.name}
                    </span>
                  </>
                ) : (
                  <User size={20} className="navbar-user-icon" />
                )}
                <ChevronDown 
                  size={14} 
                  className={`navbar-user-chevron ${isUserMenuOpen ? 'rotated' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="navbar-dropdown">
                  {user ? (
                    // MENU PARA USUÁRIO LOGADO
                    <>
                      <div className="navbar-dropdown-header">
                        Minha Conta
                      </div>
                      <div className="navbar-divider" />
                      
                      <Link 
                        to={`/user/${user.id}`} 
                        className="navbar-dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={16} />
                        <span>Perfil</span>
                      </Link>
                      
                      <div className="navbar-divider" />
                      
                      <button
                        onClick={() => setShowLogoutDialog(true)}
                        className="navbar-dropdown-item navbar-logout-button"
                      >
                        <LogOut size={16} />
                        <span>Sair</span>
                      </button>
                    </>
                  ) : (
                    // MENU PARA USUÁRIO NÃO LOGADO
                    <>
                      <div className="navbar-dropdown-header">
                        Conta
                      </div>
                      <div className="navbar-divider" />
                      
                      <Link 
                        to="/login" 
                        className="navbar-dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LogIn size={16} />
                        <span>Login</span>
                      </Link>
                      
                      <Link 
                        to="/signup" 
                        className="navbar-dropdown-item navbar-signup-button"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserPlus size={16} />
                        <span className="navbar-signup-text">Criar Conta</span>
                        <span className="navbar-signup-badge">Novo</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* --- MODAL DE LOGOUT --- */}
      {showLogoutDialog && (
        <div className="navbar-logout-modal">
          <div className="navbar-modal-content">
            <div className="navbar-modal-text">
              <h2>Confirmar saída</h2>
              <p>
                Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar.
              </p>
            </div>
            <div className="navbar-modal-buttons">
              <button 
                onClick={() => setShowLogoutDialog(false)}
                className="navbar-modal-cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={handleLogout}
                className="navbar-modal-confirm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;