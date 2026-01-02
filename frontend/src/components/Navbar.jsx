import { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LogOut, User, ChevronDown, Gamepad2, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  
  // Estados para controlar os menus e o modal sem bibliotecas externas
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

  return (
    <>
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#222]/95 backdrop-blur supports-[backdrop-filter]:bg-[#222]/60 text-gray-100">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          
          {/* 1. Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {/* Se tiver imagem, coloque aqui */}
            <span className="font-bold text-xl">BadCatFor</span>
          </Link>

          {/* 2. Navegação Central */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/games" className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1">
              <Gamepad2 size={16} />
              Jogos
            </Link>
          </nav>

          {/* 3. Área do Usuário (Direita) */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={menuRef}>
                {/* Botão que abre o menu do usuário */}
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 py-1 pl-1 pr-3 text-sm hover:bg-gray-700 transition-colors"
                >
                  <img 
                    src={user.photo || "https://placehold.co/100x100?text=U"} 
                    alt="Avatar" 
                    className="h-8 w-8 rounded-full object-cover border border-gray-600"
                  />
                  <span className="font-medium max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu (Feito manualmente) */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-md border border-gray-700 bg-[#1a1a1a] p-1 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-200">
                      Minha Conta
                    </div>
                    <div className="h-px bg-gray-700 my-1" />
                    
                    <Link 
                      to={`/user/${user.id}`} 
                      className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white outline-none"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Perfil
                    </Link>
                    
                    <div className="h-px bg-gray-700 my-1" />
                    
                    <button
                      onClick={() => setShowLogoutDialog(true)}
                      className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 outline-none"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Estado Deslogado
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2">
                  Login
                </Link>
                <Link to="/signup" className="text-sm font-medium bg-[#646cff] hover:bg-[#535bf2] text-white px-4 py-2 rounded-md transition-colors">
                  Criar Conta
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- MODAL DE LOGOUT (Feito manualmente) --- */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-lg border border-gray-800 bg-[#1a1a1a] p-6 shadow-lg">
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-lg font-semibold text-white">Confirmar saída</h2>
              <p className="text-sm text-gray-400">
                Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar.
              </p>
            </div>
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
              <button 
                onClick={() => setShowLogoutDialog(false)}
                className="inline-flex items-center justify-center rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none"
              >
                Cancelar
              </button>
              <button 
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
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