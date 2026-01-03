import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Importa sua instância do axios
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Share2, 
  MessageSquare,
  Clock,
  Users,
  Globe,
  Gamepad2,
  Calendar,
  Tag,
  Download,
  ExternalLink
} from 'lucide-react';

const GamePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Buscar dados do jogo
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        
        // Buscar jogo pelo slug
        const gameResponse = await api.get(`/games/${slug}`);
        setGame(gameResponse.data);
        
        // Buscar comentários (se houver endpoint)
        try {
          const commentsResponse = await api.get(`/games/${slug}/comments`);
          setComments(commentsResponse.data || []);
        } catch (commentsError) {
          console.log('Endpoint de comentários não disponível');
        }
        
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar jogo:', err);
        setError(err.response?.data?.error || 'Jogo não encontrado');
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchGameData();
    }
  }, [slug]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/games/${slug}/comments`, {
        content: newComment
      });
      
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
      alert('Erro ao adicionar comentário');
    }
  };

  const handleLike = async () => {
    try {
      // Se tiver endpoint para favoritos
      await api.post(`/games/${slug}/like`);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Erro ao favoritar:', err);
      setIsLiked(!isLiked); // Alterna visualmente mesmo sem backend
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: game.name,
        text: `Confira ${game.name} no BadCatFor!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <h2>Carregando jogo...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container">
        <div className="game-not-found">
          <h1>Jogo não encontrado</h1>
          <p>{error || 'O jogo que você está procurando não existe.'}</p>
          <p><small>Slug: {slug}</small></p>
          <Link to="/games" className="auth-btn">
            <ArrowLeft size={20} />
            Voltar para Jogos
          </Link>
        </div>
      </div>
    );
  }

  // Dados adicionais que podem vir da API ou serem padrão
  const gameDetails = {
    rating: game.rating || 4.0,
    price: game.price || 0,
    releaseDate: game.releaseDate || 'Indisponível',
    developer: game.developer || 'Desconhecido',
    publisher: game.publisher || 'Desconhecido',
    playtime: game.playtime || 'Indeterminado',
    players: game.players || 'Single Player',
    genre: game.genre || 'Terror',
    platforms: game.platforms || ['PC'],
    screenshots: game.screenshots || [],
    features: game.features || []
  };

  return (
    <div className="game-page">
      {/* Hero Section */}
      <div 
        className="game-hero"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${game.cover || 'https://via.placeholder.com/1920x600/222/555?text=BadCatFor+Games'})` 
        }}
      >
        <div className="container">
          <Link to="/games" className="back-button">
            <ArrowLeft size={20} />
            Voltar
          </Link>
          
          <div className="game-hero-content">
            <div className="game-header">
              <h1 className="game-title">{game.name}</h1>
              
              <div className="game-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < Math.floor(gameDetails.rating) ? "#FFD700" : "none"} 
                      color="#FFD700" 
                    />
                  ))}
                  <span className="rating-text">
                    {gameDetails.rating.toFixed(1)}/5.0
                  </span>
                </div>
              </div>

              <div className="game-tags">
                <span className="game-tag">
                  <Tag size={14} />
                  {gameDetails.genre}
                </span>
                <span className="game-tag">
                  <Users size={14} />
                  {gameDetails.players}
                </span>
                {gameDetails.platforms.map((platform, index) => (
                  <span key={index} className="game-tag platform-tag">
                    <Gamepad2 size={14} />
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            <div className="game-actions">
              {gameDetails.price > 0 && (
                <div className="price-section">
                  <span className="current-price">
                    R$ {gameDetails.price.toFixed(2)}
                  </span>
                </div>
              )}
              
              <div className="action-buttons">
                <button 
                  className="action-btn primary-btn"
                  onClick={() => alert('Funcionalidade de download em desenvolvimento')}
                >
                  <Download size={20} />
                  {gameDetails.price > 0 ? 'Comprar' : 'Baixar'}
                </button>
                
                <button 
                  className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                >
                  <Heart size={20} fill={isLiked ? "#ff4757" : "none"} />
                  {isLiked ? 'Favoritado' : 'Favoritar'}
                </button>
                
                <button 
                  className="action-btn share-btn"
                  onClick={handleShare}
                >
                  <Share2 size={20} />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container game-content">
        <div className="game-main-content">
          {/* Descrição do Jogo */}
          <section className="game-section">
            <h2 className="section-title">Sobre o Jogo</h2>
            <div className="game-description">
              <p>{game.description}</p>
            </div>
          </section>

          {/* Características */}
          {gameDetails.features.length > 0 && (
            <section className="game-section">
              <h2 className="section-title">Características</h2>
              <div className="game-features">
                <ul>
                  {gameDetails.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <Star size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Screenshots */}
          {gameDetails.screenshots.length > 0 && (
            <section className="game-section">
              <h2 className="section-title">Capturas de Tela</h2>
              <div className="screenshots-grid">
                {gameDetails.screenshots.map((screenshot, index) => (
                  <div key={index} className="screenshot-item">
                    <img 
                      src={screenshot} 
                      alt={`${game.name} screenshot ${index + 1}`}
                      onClick={() => window.open(screenshot, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Informações Técnicas */}
          <section className="game-section">
            <h2 className="section-title">Informações do Jogo</h2>
            <div className="game-info-grid">
              <div className="info-item">
                <Calendar size={20} />
                <div>
                  <span className="info-label">Lançamento</span>
                  <span className="info-value">{gameDetails.releaseDate}</span>
                </div>
              </div>
              
              <div className="info-item">
                <Clock size={20} />
                <div>
                  <span className="info-label">Duração</span>
                  <span className="info-value">{gameDetails.playtime}</span>
                </div>
              </div>
              
              <div className="info-item">
                <Gamepad2 size={20} />
                <div>
                  <span className="info-label">Desenvolvedor</span>
                  <span className="info-value">{gameDetails.developer}</span>
                </div>
              </div>
              
              <div className="info-item">
                <Globe size={20} />
                <div>
                  <span className="info-label">Distribuidora</span>
                  <span className="info-value">{gameDetails.publisher}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Seção de Comentários */}
          <section className="game-section">
            <h2 className="section-title">
              Comentários ({comments.length})
            </h2>
            
            {/* Formulário de comentário */}
            <div className="comment-form">
              <textarea
                className="comment-input"
                placeholder="Deixe seu comentário sobre este jogo..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <button 
                className="auth-btn comment-submit-btn"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                <MessageSquare size={18} />
                Enviar Comentário
              </button>
            </div>

            {/* Lista de Comentários */}
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-author">
                        <img 
                          src={comment.user?.photo || 'https://via.placeholder.com/40/333/fff?text=U'} 
                          alt={comment.user?.name || 'Usuário'}
                          className="comment-avatar"
                        />
                        <div>
                          <span className="comment-author-name">
                            {comment.user?.name || 'Anônimo'}
                          </span>
                          <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="comment-content">
                      <p>{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-comments">
                  <MessageSquare size={48} />
                  <p>Nenhum comentário ainda. Seja o primeiro!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="game-sidebar">
          {/* Detalhes Técnicos */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Detalhes Técnicos</h3>
            <div className="technical-details">
              <div className="detail-item">
                <span className="detail-label">ID</span>
                <span className="detail-value">{game.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Slug</span>
                <span className="detail-value">{game.slug}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">URL</span>
                <a 
                  href={`/games/${game.slug}`}
                  className="detail-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copiado!');
                  }}
                >
                  <ExternalLink size={14} />
                  Copiar link
                </a>
              </div>
            </div>
          </div>

          {/* Status do Jogo */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Status</h3>
            <div className="game-status">
              <div className="status-item available">
                <span className="status-dot"></span>
                <span>Disponível</span>
              </div>
              <div className="status-item">
                <span>Comunidade ativa</span>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Ações Rápidas</h3>
            <div className="quick-actions">
              <button 
                className="quick-action-btn"
                onClick={() => alert('Funcionalidade de review em desenvolvimento')}
              >
                <MessageSquare size={16} />
                Escrever Review
              </button>
              <button 
                className="quick-action-btn"
                onClick={handleShare}
              >
                <Share2 size={16} />
                Compartilhar
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GamePage;