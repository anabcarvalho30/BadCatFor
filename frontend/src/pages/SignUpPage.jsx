import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const SignUpPage = () => {
  const navigate = useNavigate();
  
  // 1. Atualizamos o estado para incluir bio e os arquivos (inicialmente null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    photo: null, 
    banner: null
  });

  // 2. O handleChange agora precisa detectar se é um campo de texto ou arquivo
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files.length > 0) {
      // Se for input de arquivo, pegamos o primeiro arquivo
      setFormData({ ...formData, [name]: files[0] });
    } else {
      // Se for texto normal
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 3. Criamos um FormData para enviar arquivos + textos
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('email', formData.email);
    dataToSend.append('password', formData.password);
    dataToSend.append('bio', formData.bio);
    
    // Só anexamos se o usuário tiver selecionado um arquivo
    if (formData.photo) dataToSend.append('photo', formData.photo);
    if (formData.banner) dataToSend.append('banner', formData.banner);

    try {
      // 4. Enviamos o FormData. O navegador/axios geralmente detecta o Content-Type
      // mas podemos forçar para garantir.
      await api.post('/auth/register', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Conta criada com sucesso! Faça login agora.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar conta: ' + (error.response?.data?.error || 'Tente novamente.'));
    }
  };

  return (
    <div className="auth-container">
      <h2>Criar Conta</h2>
      <form onSubmit={handleRegister} className="auth-form">
        
        {/* Campos Originais */}
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

        {/* --- NOVOS CAMPOS --- */}
        
        {/* Bio (Textarea para textos maiores) */}
        <textarea
          name="bio"
          placeholder="Conte um pouco sobre você (Bio)"
          className="auth-input auth-textarea"
          onChange={handleChange}
          rows="3"
        />

        {/* Upload de Foto de Perfil */}
        <div className="file-input-group">
          <label>Foto de Perfil:</label>
          <input 
            type="file" 
            name="photo" 
            accept="image/*" // Aceita apenas imagens
            className="auth-input"
            onChange={handleChange}
          />
        </div>

        {/* Upload de Banner */}
        <div className="file-input-group">
          <label>Banner de Fundo:</label>
          <input 
            type="file" 
            name="banner" 
            accept="image/*" // Aceita apenas imagens
            className="auth-input"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="auth-btn">Registrar</button>
      </form>
      <Link to="/login" className="auth-link">Já tem conta? Faça Login</Link>
    </div>
  );
};

export default SignUpPage;