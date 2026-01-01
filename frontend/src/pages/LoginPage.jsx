import { useState, useContext } from 'react'; // Adicionado useContext
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext'; // Importar o contexto

const LoginPage = () => {
  const navigate = useNavigate();
  
  // Pegamos a função de login do nosso Contexto Global
  const { login } = useContext(AuthContext); 

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      
      const { token, user } = response.data;
      
      // CORREÇÃO: Usamos a função do contexto em vez de localStorage manual
      // Isso faz a Navbar atualizar instantaneamente!
      login(user, token);

      alert(`Bem-vindo de volta, ${user.name}!`);
      navigate('/'); // Vai para a Home

    } catch (error) {
      console.error(error);
      alert('Falha no login: ' + (error.response?.data?.error || 'Credenciais inválidas.'));
    }
  };

  return (
    <div className="auth-container">
      <h2>Entrar no BadCatFor</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          className="auth-input"
          onChange={handleChange}
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Senha" 
          className="auth-input"
          onChange={handleChange}
          required 
        />
        <button type="submit" className="auth-btn">Entrar</button>
      </form>
      <Link to="/signup" className="auth-link">Não tem conta? Registe-se</Link>
    </div>
  );
};

export default LoginPage;