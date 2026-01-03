import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Settings, Save, X, Camera, Image as ImageIcon } from 'lucide-react';

const UserPage = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  
  const [profileUser, setProfileUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
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
      <div 
        className='banner-user' 
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="banner-overlay"></div>

        {/* Input para trocar Banner (Aparece só ao editar) */}
        {isEditing && (
          <div className="banner-edit-container">
            <label className="banner-label">
              <ImageIcon size={14} /> URL do Banner:
            </label>
            <input 
              type="text" 
              value={editForm.banner} 
              onChange={(e) => setEditForm({...editForm, banner: e.target.value})}
              placeholder="https://exemplo.com/banner.jpg"
              className="auth-input banner-input"
            />
          </div>
        )}
      </div>

      <div className="user-page-container">
        
        <div className="profile-header">
          
          {/* FOTO DE PERFIL */}
          <div className="profile-avatar-container">
            <img 
              src={isEditing ? (editForm.photo || "https://placehold.co/150?text=Foto") : (profileUser.photo || "https://fjapncbcetbchzoostmw.supabase.co/storage/v1/object/public/images/nopicuser.jpg")} 
              alt="Avatar" 
              className="profile-avatar"
            />
            {isEditing && (
              <div className="avatar-edit-overlay">
                <Camera size={18} color="white" />
              </div>
            )}
          </div>

          {/* INFORMAÇÕES E BOTÕES */}
          <div className="profile-info-container">
            <div className="profile-info">
              {isEditing ? (
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="auth-input profile-name-input"
                />
              ) : (
                <h1 className="profile-name">
                  {profileUser.name}
                </h1>
              )}
              <span className="profile-username">
                @{profileUser.email?.split('@')[0]}
              </span>
            </div>

            {isMyProfile && (
              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="auth-btn cancel-btn" title="Cancelar">
                        <X size={20}/>
                    </button>
                    <button onClick={handleSave} className="auth-btn save-btn" title="Salvar">
                        <Save size={20}/>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="edit-btn"
                    title="Editar Perfil"
                  >
                    <Settings size={18} />
                    <span>Editar Perfil</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FORMULÁRIO DE EDIÇÃO SECUNDÁRIO */}
        {isEditing && (
          <div className="auth-container edit-details-container">
            <h3 className="edit-details-title">Detalhes da Conta</h3>
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

        <hr className="divider" />

        {isMyProfile && !isEditing && (
          <div className="post-input-container">
            <div className="post-input-header">
               <img 
                  src={profileUser.photo || "https://placehold.co/50"} 
                  alt="" 
                  className="post-input-avatar"
               />
               <textarea 
                  placeholder={`No que você está pensando, ${profileUser.name}?`}
                  className="post-textarea"
                  rows={2}
               ></textarea>
            </div>
            <div className="post-actions">
              <button className="auth-btn post-button">Publicar</button>
            </div>
          </div>
        )}

        <h3 style={{color: '#fff'}}>Publicações</h3>
        <div className="empty-posts">
            <p>Nenhuma publicação ainda...</p>
        </div>

      </div>
    </div>
  );
};

export default UserPage;