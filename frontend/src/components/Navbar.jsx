import { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LogOut, User, ChevronDown, Gamepad2, LogIn, UserPlus } from 'lucide-react';

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
      <nav className="navbar-header">
        <div className="navbar-container">
          
           <Link to="/" className="navbar-logo">
            <img 
              src="https://fjapncbcetbchzoostmw.supabase.co/storage/v1/object/public/images/badcatlogo.png" 
              alt="BadCatFor Logo" 
              className="navbar-logo-img"
            />
          </Link>
          
          {/* Links de navegação */}
          <div className="navbar-nav">
            <Link to="/" className="nav-link navbar-nav-link">Home</Link>
            <Link to="/games" className="nav-link navbar-nav-link">
              Jogos
            </Link>
          </div>

          {/* Área do usuário */}
          <div className="user-menu-container" ref={menuRef}>
            {user ? (
              <>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="navbar-user-button"
                >
                  <img 
                    src={user.photo || "https://placehold.co/100x100?text=U"} 
                    alt="Perfil" 
                    className="navbar-avatar"
                  />
                  <span className="navbar-user-name">{user.name}</span>
                  <ChevronDown 
                    size={16} 
                    style={{ 
                      transition: 'transform 0.2s',
                      transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="navbar-dropdown">
                    <Link 
                      to={`/user/${user.id}`} 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="navbar-menu-item"
                    >
                      <User size={16} />
                      <span>Meu Perfil</span>
                    </Link>
                    
                    <button 
                      onClick={() => setShowLogoutDialog(true)}
                      className="navbar-menu-item"
                      style={{ color: '#ff6b6b', borderTop: '1px solid #333' }}
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="navbar-user-button"
                >
                  <User size={20} />
                  <ChevronDown 
                    size={16} 
                    style={{ 
                      transition: 'transform 0.2s',
                      transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="navbar-dropdown">
                    <Link 
                      to="/login" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="navbar-menu-item"
                    >
                      <LogIn size={16} />
                      <span>Login</span>
                    </Link>
                    
                    <Link 
                      to="/signup" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="navbar-menu-item"
                      style={{ 
                        color: 'white', 
                        background: '#b600adff',
                        justifyContent: 'center'
                      }}
                    >
                      <UserPlus size={16} />
                      <span>Criar Conta</span>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Modal de confirmação de logout */}
      {showLogoutDialog && (
        <div className="navbar-modal-overlay">
          <div className="navbar-modal-content">
            <h3 style={{ margin: '0 0 16px 0', color: 'white' }}>Confirmar saída</h3>
            <p style={{ color: '#999', marginBottom: '24px' }}>
              Tem certeza que deseja sair da sua conta?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowLogoutDialog(false)}
                className="navbar-btn-cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={handleLogout}
                className="navbar-btn-confirm"
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