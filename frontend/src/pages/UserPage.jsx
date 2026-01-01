import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Settings, Save, X, Camera } from 'lucide-react';
import api from '../services/api';

const UserPage = () => {
  const { id } = useParams(); // ID da URL (quem estamos vendo)
  const { user: currentUser } = useContext(AuthContext); // Quem está logado
  
  // Estado local para armazenar dados da página
  const [profileUser, setProfileUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Dados do formulário de edição
  const [editForm, setEditForm] = useState({
    name: '',
    photo: '',
    bannerColor: '#444444', // Cor padrão
    password: '' // Opcional
  });

  // Simulação de verificação: O perfil que estou vendo é o meu?
  const isMyProfile = currentUser && currentUser.id === Number(id);

  // Carregar dados (fictício, pois ainda não temos rota GET /user/:id no backend, usaremos dados locais por enquanto)
  useEffect(() => {
    // TODO: Criar rota GET /users/:id no backend para buscar dados reais
    // Por enquanto, se for meu perfil, uso meus dados
    if (isMyProfile) {
      setProfileUser(currentUser);
      setEditForm({
        name: currentUser.name,
        photo: currentUser.photo || '',
        bannerColor: '#646cff' // Mock
      });
    }
  }, [id, currentUser, isMyProfile]);

  const handleSave = async () => {
    // Aqui enviaríamos o PUT para a API
    alert("Funcionalidade de salvar será conectada ao backend em breve!");
    
    // Atualiza visualmente (mock)
    setProfileUser({...profileUser, ...editForm});
    setIsEditing(false);
  };

  if (!profileUser) return <div className="container">Carregando perfil...</div>;

  return (
    <div>
      {/* --- BANNER --- */}
      <div style={{ 
        height: '200px', 
        backgroundColor: isEditing ? editForm.bannerColor : (profileUser.bannerColor || '#444'),
        position: 'relative'
      }}>
        {isEditing && (
          <div style={{position: 'absolute', right: 20, top: 20, background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px'}}>
            <label style={{color: 'white', marginRight: '10px'}}>Cor do Banner:</label>
            <input 
              type="color" 
              value={editForm.bannerColor} 
              onChange={(e) => setEditForm({...editForm, bannerColor: e.target.value})}
            />
          </div>
        )}
      </div>

      <div className="container" style={{ position: 'relative', marginTop: '-60px' }}>
        
        {/* --- CABEÇALHO DO PERFIL --- */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '30px' }}>
          
          {/* Foto de Perfil */}
          <div style={{ position: 'relative' }}>
            <img 
              src={isEditing ? (editForm.photo || "https://placehold.co/150") : (profileUser.photo || "https://placehold.co/150")} 
              alt="Avatar" 
              style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #1a1a1a', objectFit: 'cover', background: '#222' }}
            />
            {isEditing && (
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#646cff', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}>
                <Camera size={16} color="white" />
              </div>
            )}
          </div>

          {/* Info do Usuário + Botão de Editar */}
          <div style={{ flex: 1, paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="auth-input"
                  style={{fontSize: '1.5rem', fontWeight: 'bold'}}
                />
              ) : (
                <h1 style={{ margin: 0 }}>{profileUser.name}</h1>
              )}
              <span style={{ color: '#aaa' }}>@{profileUser.email?.split('@')[0]}</span>
            </div>

            {/* Botão de Engrenagem (Só aparece se for o dono do perfil) */}
            {isMyProfile && (
              <div style={{display: 'flex', gap: '10px'}}>
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="auth-btn" style={{background: '#444'}}><X size={20}/></button>
                    <button onClick={handleSave} className="auth-btn" style={{background: '#2ecc71'}}><Save size={20}/></button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff' }}
                    title="Editar Perfil"
                  >
                    <Settings size={28} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- FORMULÁRIO DE EDIÇÃO EXTRA --- */}
        {isEditing && (
          <div className="auth-container" style={{margin: '0 0 30px 0', textAlign: 'left'}}>
            <h3>Editar Informações</h3>
            <div className="auth-form">
              <label>URL da Foto de Perfil:</label>
              <input 
                type="text" 
                className="auth-input" 
                value={editForm.photo} 
                onChange={(e) => setEditForm({...editForm, photo: e.target.value})}
                placeholder="https://..."
              />
              <label>Alterar Senha (opcional):</label>
              <input type="password" className="auth-input" placeholder="Nova senha" />
            </div>
          </div>
        )}

        <hr style={{ borderColor: '#333', margin: '20px 0' }} />

        {/* --- ÁREA DE POSTS --- */}
        {isMyProfile && !isEditing && (
          <div style={{ marginBottom: '30px', background: '#2a2a2a', padding: '15px', borderRadius: '8px' }}>
            <textarea 
              placeholder={`No que você está pensando, ${profileUser.name}?`}
              style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', resize: 'none', fontSize: '1.1rem', outline: 'none' }}
              rows={3}
            ></textarea>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button className="auth-btn">Publicar</button>
            </div>
          </div>
        )}

        <h3>Publicações</h3>
        <p style={{color: '#777'}}>Nenhuma publicação ainda...</p>

      </div>
    </div>
  );
};

export default UserPage;