import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const SignUpPage = () => {
  const navigate = useNavigate(); // Hook para redirecionar o utilizador
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Evita que a página recarregue
    try {
      await api.post('/auth/register', formData);
      alert('Conta criada com sucesso! Faça login agora.');
      navigate('/login'); // Manda para o login
    } catch (error) {
      console.error(error);
      alert('Erro ao criar conta: ' + (error.response?.data?.error || 'Tente novamente.'));
    }
  };

  return (
    <div className="auth-container">
      <h2>Criar Conta</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <input 
          type="text" 
          name="name" 
          placeholder="Seu Nome" 
          className="auth-input"
          onChange={handleChange}
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Seu Email" 
          className="auth-input"
          onChange={handleChange}
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Sua Senha" 
          className="auth-input"
          onChange={handleChange}
          required 
        />
        <button type="submit" className="auth-btn">Registar</button>
      </form>
      <Link to="/login" className="auth-link">Já tem conta? Faça Login</Link>
    </div>
  );
};

export default SignUpPage;