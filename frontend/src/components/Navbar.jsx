import { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
// Certifique-se de ter o lucide-react instalado. Se der erro, remova os ícones que faltam.
import { LogOut, User, ChevronDown, Gamepad2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  
  // Estados para controlar o menu e o modal
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const menuRef = useRef(null);

  // Fecha o menu se clicar fora dele
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

  // --- ESTILOS (Para manter organizado e fácil de ler) ---
  const styles = {
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      borderBottom: '1px solid #333',
      backgroundColor: 'rgba(34, 34, 34, 0.95)', // #222 com transparência
      backdropFilter: 'blur(8px)',
      padding: '0 1rem',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      height: '64px', // h-16
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logoLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1.25rem',
    },
    nav: {
      display: 'flex',
      gap: '24px',
      alignItems: 'center',
    },
    navLink: {
      fontSize: '0.875rem', // text-sm
      fontWeight: '500',
      color: '#ccc',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    userButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#333',
      border: '1px solid #444',
      borderRadius: '9999px', // Redondo
      padding: '4px 12px 4px 4px',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '0.875rem',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '1px solid #666',
    },
    // Estilos do Dropdown Flutuante
    dropdown: {
      position: 'absolute',
      right: 0,
      top: '100%', // Logo abaixo do botão
      marginTop: '8px',
      width: '220px',
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '6px',
      padding: '4px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: '8px 12px',
      fontSize: '0.875rem',
      color: '#e5e5e5',
      textDecoration: 'none',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      borderRadius: '4px',
    },
    // Estilos do Modal de Logout
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      background: '#1a1a1a',
      border: '1px solid #333',
      padding: '24px',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '400px',
      color: '#fff',
    },
    btnCancel: {
      padding: '8px 16px',
      background: 'transparent',
      border: '1px solid #444',
      color: '#ccc',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    btnConfirm: {
      padding: '8px 16px',
      background: '#dc2626', // Vermelho
      border: 'none',
      color: '#fff',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
    }
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.container}>
          
          {/* LOGO */}
          <Link to="/" style={styles.logoLink}>
            BadCatFor
          </Link>

          {/* NAVEGAÇÃO CENTRAL */}
          <div style={styles.nav}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/games" style={styles.navLink}>
              <Gamepad2 size={16} /> Jogos
            </Link>
          </div>

          {/* ÁREA DO USUÁRIO */}
          <div>
            {user ? (
              <div style={{ position: 'relative' }} ref={menuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={styles.userButton}
                >
                  <img 
                    src={user.photo || "https://placehold.co/100x100?text=U"} 
                    alt="Perfil" 
                    style={styles.avatar} 
                  />
                  <span style={{maxWidth: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                    {user.name}
                  </span>
                  <ChevronDown size={14} style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
                </button>

                {/* DROPDOWN MENU */}
                {isUserMenuOpen && (
                  <div style={styles.dropdown}>
                    <div style={{ padding: '8px 12px', fontSize: '0.75rem', color: '#888', fontWeight: 'bold' }}>
                      MINHA CONTA
                    </div>
                    
                    <Link to={`/user/${user.id}`} style={styles.menuItem} onClick={() => setIsUserMenuOpen(false)}>
                      <User size={16} style={{marginRight: '8px'}} />
                      Perfil
                    </Link>
                    
                    <div style={{height: '1px', background: '#333', margin: '4px 0'}}></div>
                    
                    <button 
                      onClick={() => setShowLogoutDialog(true)} 
                      style={{...styles.menuItem, color: '#ef4444'}} // Vermelho claro
                    >
                      <LogOut size={16} style={{marginRight: '8px'}} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // ESTADO DESLOGADO
              <div style={{ display: 'flex', gap: '15px' }}>
                <Link to="/login" style={{...styles.navLink, color: '#fff'}}>Login</Link>
                <Link to="/signup" style={{padding: '6px 16px', background: '#646cff', borderRadius: '4px', color: '#fff', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500'}}>
                  Criar Conta
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MODAL DE CONFIRMAÇÃO DE LOGOUT */}
      {showLogoutDialog && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{marginTop: 0, marginBottom: '8px', fontSize: '1.1rem'}}>Confirmar saída</h2>
            <p style={{color: '#aaa', marginBottom: '24px', fontSize: '0.9rem'}}>
              Tem certeza que deseja sair da sua conta?
            </p>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
              <button onClick={() => setShowLogoutDialog(false)} style={styles.btnCancel}>
                Cancelar
              </button>
              <button onClick={handleLogout} style={styles.btnConfirm}>
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