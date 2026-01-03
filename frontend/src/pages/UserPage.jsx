import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Settings, Save, X, Camera, Image as ImageIcon } from 'lucide-react';

const UserPage = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  
  const [profileUser, setProfileUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Alterado de bannerColor para banner (url)
  const [editForm, setEditForm] = useState({
    name: '',
    photo: '',
    banner: '', 
    password: '' 
  });

  const isMyProfile = currentUser && currentUser.id === Number(id);

  useEffect(() => {
    if (isMyProfile) {
      setProfileUser(currentUser);
      setEditForm({
        name: currentUser.name,
        photo: currentUser.photo || '',
        banner: currentUser.banner || ''
      });
    }
  }, [id, currentUser, isMyProfile]);

  const handleSave = async () => {
    alert("Funcionalidade de salvar será conectada ao backend em breve!");
    setProfileUser({...profileUser, ...editForm});
    setIsEditing(false);
  };

  if (!profileUser) return <div className="container" style={{padding: '20px', color: '#fff'}}>Carregando perfil...</div>;

  const bannerImage = isEditing 
    ? (editForm.banner || "https://placehold.co/1200x300/333/666?text=Sem+Banner") 
    : (profileUser.banner || "https://placehold.co/1200x300/222/555?text=Banner");

  return (
    <div>
      {/* --- ÁREA DO BANNER --- */}
      <div className='banner-user' style={{ 
        height: '250px', // Aumentei um pouco para ficar mais bonito com imagem
        width: '100%',
        backgroundColor: '#222',
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Overlay escuro para melhorar leitura se tiver texto sobre a imagem, opcional */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))'}}></div>

        {/* Input para trocar Banner (Aparece só ao editar) */}
        {isEditing && (
          <div style={{
            position: 'absolute', 
            right: 20, 
            top: 20, 
            background: 'rgba(0,0,0,0.8)', 
            padding: '15px', 
            borderRadius: '8px',
            backdropFilter: 'blur(4px)',
            border: '1px solid #444',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            width: '300px'
          }}>
            <label style={{color: '#ccc', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
              <ImageIcon size={14} /> URL do Banner:
            </label>
            <input 
              type="text" 
              value={editForm.banner} 
              onChange={(e) => setEditForm({...editForm, banner: e.target.value})}
              placeholder="https://exemplo.com/banner.jpg"
              className="auth-input"
              style={{fontSize: '0.85rem', padding: '8px'}}
            />
          </div>
        )}
      </div>

      <div className="container" style={{ position: 'relative', marginTop: '-60px', padding: '0 20px', maxWidth: '1000px', margin: '-80px auto 0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '30px' }}>
          
          {/* FOTO DE PERFIL */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <img 
              src={isEditing ? (editForm.photo || "https://placehold.co/150?text=Foto") : (profileUser.photo || "https://placehold.co/150?text=U")} 
              alt="Avatar" 
              style={{ 
                width: '140px', 
                height: '140px', 
                borderRadius: '50%', 
                border: '5px solid #121212', // Cor de fundo da página para parecer recortado
                objectFit: 'cover', 
                background: '#222',
                boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
              }}
            />
            {isEditing && (
              <div style={{ position: 'absolute', bottom: 5, right: 5, background: '#646cff', borderRadius: '50%', padding: '8px', cursor: 'pointer', border: '2px solid #121212' }}>
                <Camera size={18} color="white" />
              </div>
            )}
          </div>

          {/* INFORMAÇÕES E BOTÕES */}
          <div style={{ flex: 1, paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{marginBottom: '5px'}}>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="auth-input"
                  style={{fontSize: '1.8rem', fontWeight: 'bold', padding: '5px', background: 'rgba(0,0,0,0.5)'}}
                />
              ) : (
                <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {profileUser.name}
                </h1>
              )}
              <span style={{ color: '#ccc', fontSize: '1rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                @{profileUser.email?.split('@')[0]}
              </span>
            </div>

            {isMyProfile && (
              <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="auth-btn" style={{background: '#444', padding: '8px 12px'}} title="Cancelar">
                        <X size={20}/>
                    </button>
                    <button onClick={handleSave} className="auth-btn" style={{background: '#2ecc71', padding: '8px 12px'}} title="Salvar">
                        <Save size={20}/>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    style={{ background: '#333', border: '1px solid #555', cursor: 'pointer', color: '#fff', padding: '8px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}
                    title="Editar Perfil"
                  >
                    <Settings size={18} />
                    <span style={{fontSize: '0.9rem'}}>Editar Perfil</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FORMULÁRIO DE EDIÇÃO SECUNDÁRIO */}
        {isEditing && (
          <div className="auth-container" style={{margin: '0 0 30px 0', textAlign: 'left', background: '#1a1a1a', border: '1px solid #333'}}>
            <h3 style={{marginTop: 0, color: '#646cff'}}>Detalhes da Conta</h3>
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

        <hr style={{ borderColor: '#333', margin: '30px 0' }} />

        {isMyProfile && !isEditing && (
          <div style={{ marginBottom: '30px', background: '#222', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
            <div style={{display: 'flex', gap: '15px'}}>
               <img 
                  src={profileUser.photo || "https://placehold.co/50"} 
                  alt="" 
                  style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}}
               />
               <textarea 
                  placeholder={`No que você está pensando, ${profileUser.name}?`}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', resize: 'none', fontSize: '1rem', outline: 'none', marginTop: '10px' }}
                  rows={2}
               ></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', borderTop: '1px solid #333', paddingTop: '10px' }}>
              <button className="auth-btn" style={{padding: '8px 20px', borderRadius: '20px'}}>Publicar</button>
            </div>
          </div>
        )}

        <h3 style={{color: '#fff'}}>Publicações</h3>
        <div style={{padding: '40px', textAlign: 'center', color: '#555', border: '2px dashed #333', borderRadius: '12px'}}>
            <p>Nenhuma publicação ainda...</p>
        </div>

      </div>
    </div>
  );
};

export default UserPage;