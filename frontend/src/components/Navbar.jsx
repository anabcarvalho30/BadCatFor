import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: '0.8rem 2rem', borderBottom: '1px solid #333', background: '#222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', textDecoration: 'none' }}>
        BadCatFor
      </Link>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" className="nav-link" style={{color: '#ccc', textDecoration: 'none'}}>Home</Link>
        <Link to="/games" className="nav-link" style={{color: '#ccc', textDecoration: 'none'}}>Jogos</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {user ? (
          <>
            <Link to={`/user/${user.id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
              <span style={{fontWeight: 'bold'}}>{user.name}</span>
              <img 
                src={user.photo || "https://placehold.co/100x100?text=U"} 
                alt="Perfil" 
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #646cff', objectFit: 'cover' }}
              />
            </Link>
            <button onClick={logout} style={{background: 'transparent', border: 'none', color: '#666', cursor: 'pointer'}} title="Sair">
               <LogOut size={20} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" style={{color: '#fff', textDecoration: 'none'}}>Login</Link>
            <Link to="/signup" style={{padding: '5px 15px', background: '#646cff', borderRadius: '4px', color: '#fff', textDecoration: 'none'}}>Criar Conta</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;