import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Share2, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  Globe,
  Gamepad2,
  Calendar
} from 'lucide-react';

const GamePage = () => {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Buscar dados do jogo
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        console.log('Buscando jogo com slug:', slug); // LOG
        
        // PRIMEIRO: Verificar se estamos conseguindo acessar a API
        const testResponse = await fetch('http://localhost:3000/api/games');
        console.log('Teste API games:', testResponse.ok); // LOG
        
        // TENTATIVA 1: Buscar pela rota específica
        const gameResponse = await fetch(`http://localhost:3000/api/games/${slug}`);
        console.log('Resposta da API:', gameResponse.status, gameResponse.statusText); // LOG
        
        if (!gameResponse.ok) {
          console.log('Jogo não encontrado na rota específica, tentando buscar na listagem...');
          
          // TENTATIVA 2: Buscar na listagem e filtrar pelo slug
          const allGamesResponse = await fetch('http://localhost:3000/api/games');
          if (allGamesResponse.ok) {
            const allGames = await allGamesResponse.json();
            console.log('Todos os jogos:', allGames); // LOG
            
            const foundGame = allGames.find(g => g.slug === slug);
            console.log('Jogo encontrado na listagem:', foundGame); // LOG
            
            if (foundGame) {
              setGame(foundGame);
              setError(null);
            } else {
              throw new Error(`Jogo com slug "${slug}" não encontrado na listagem`);
            }
          } else {
            throw new Error('Não foi possível carregar a listagem de jogos');
          }
        } else {
          const gameData = await gameResponse.json();
          console.log('Dados do jogo recebidos:', gameData); // LOG
          setGame(gameData);
          setError(null);
        }
        
      } catch (err) {
        console.error('Erro ao buscar jogo:', err);
        setError(err.message);
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchGameData();
    } else {
      setError('Slug não fornecido');
      setLoading(false);
    }
  }, [slug]);

  // Restante do código permanece o mesmo...

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/api/games/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const addedComment = await response.json();
        setComments([...comments, addedComment]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <h2>Carregando jogo...</h2>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container">
        <div className="game-not-found">
          <h1>Jogo não encontrado</h1>
          <p>O jogo que você está procurando não existe ou foi removido.</p>
          <Link to="/games" className="auth-btn">
            <ArrowLeft size={20} />
            Voltar para Jogos
          </Link>
        </div>
      </div>
    );
  }

  // Dados padrão (você pode adicionar estes campos ao seu model depois)
  const gameDetails = {
    rating: 4.5,
    reviewCount: 1247,
    price: 249.90,
    onSale: false,
    releaseDate: '2024-10-08',
    playtime: '15-20 horas',
    players: 'Single Player',
    genre: 'Terror Psicológico',
    developer: 'Desenvolvedor Desconhecido',
    publisher: 'Distribuidora Desconhecida',
    platforms: ['PC', 'Console'],
    screenshots: [
      'https://via.placeholder.com/800x450/333/666?text=Screenshot+1',
      'https://via.placeholder.com/800x450/333/666?text=Screenshot+2',
      'https://via.placeholder.com/800x450/333/666?text=Screenshot+3',
    ],
    features: [
      'Jogabilidade envolvente',
      'Gráficos de alta qualidade',
      'História cativante',
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10',
        processor: 'Intel Core i5',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GTX 1060',
        storage: '50 GB'
      },
      recommended: {
        os: 'Windows 11',
        processor: 'Intel Core i7',
        memory: '16 GB RAM',
        graphics: 'NVIDIA RTX 2060',
        storage: '50 GB SSD'
      }
    }
  };

  return (
    <div className="game-page">
      {/* Hero Section com Cover */}
      <div 
        className="game-hero"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${game.cover || 'https://via.placeholder.com/1920x600/222/555?text=Capa+do+Jogo'})` 
        }}
      >
        <div className="container">
          <Link to="/games" className="back-button">
            <ArrowLeft size={20} />
            Voltar para Jogos
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
                    {gameDetails.rating}/5 ({gameDetails.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="game-tags">
                <span className="game-tag">{gameDetails.genre}</span>
                <span className="game-tag">{gameDetails.players}</span>
                {gameDetails.platforms.map((platform, index) => (
                  <span key={index} className="game-tag platform-tag">{platform}</span>
                ))}
              </div>
            </div>

            <div className="game-actions">
              <div className="price-section">
                {gameDetails.onSale ? (
                  <>
                    <span className="original-price">R$ {gameDetails.price.toFixed(2)}</span>
                    <span className="sale-price">R$ {(gameDetails.price * 0.8).toFixed(2)}</span>
                    <span className="discount-badge">-20%</span>
                  </>
                ) : (
                  <span className="current-price">R$ {gameDetails.price.toFixed(2)}</span>
                )}
              </div>

              <div className="action-buttons">
                <button className="action-btn primary-btn" onClick={() => alert('Funcionalidade de compra em desenvolvimento!')}>
                  Comprar Agora
                </button>
                <button 
                  className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart size={20} fill={isLiked ? "#ff4757" : "none"} />
                  {isLiked ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </button>
                <button className="action-btn share-btn" onClick={() => navigator.clipboard.writeText(window.location.href)}>
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
            <div className={`game-description ${showFullDescription ? 'expanded' : ''}`}>
              <p>{game.description}</p>
              
              <div className="game-features">
                <h3>Características Principais</h3>
                <ul>
                  {gameDetails.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <Star size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className="toggle-description-btn"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? (
                  <>
                    <ChevronUp size={16} />
                    Mostrar menos
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Continuar lendo
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Screenshots Gallery */}
          {gameDetails.screenshots.length > 0 && (
            <section className="game-section">
              <h2 className="section-title">Capturas de Tela</h2>
              <div className="screenshots-grid">
                {gameDetails.screenshots.map((screenshot, index) => (
                  <div key={index} className="screenshot-thumb">
                    <img 
                      src={screenshot} 
                      alt={`Screenshot ${index + 1} de ${game.name}`}
                      onClick={() => window.open(screenshot, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Informações do Jogo */}
          <section className="game-section">
            <h2 className="section-title">Informações do Jogo</h2>
            <div className="game-info-grid">
              <div className="info-item">
                <Calendar size={20} />
                <div>
                  <span className="info-label">Data de Lançamento</span>
                  <span className="info-value">
                    {new Date(gameDetails.releaseDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <div className="info-item">
                <Clock size={20} />
                <div>
                  <span className="info-label">Tempo de Jogo</span>
                  <span className="info-value">{gameDetails.playtime}</span>
                </div>
              </div>
              <div className="info-item">
                <Users size={20} />
                <div>
                  <span className="info-label">Modo de Jogo</span>
                  <span className="info-value">{gameDetails.players}</span>
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
            <h2 className="section-title">Comentários ({comments.length})</h2>
            
            {/* Formulário para novo comentário */}
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
                          <span className="comment-author-name">{comment.user?.name || 'Anônimo'}</span>
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
                  <p>Seja o primeiro a comentar sobre este jogo!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="game-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Detalhes Técnicos</h3>
            <div className="technical-details">
              <div className="detail-item">
                <span className="detail-label">ID do Jogo:</span>
                <span className="detail-value">{game.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Slug:</span>
                <span className="detail-value">{game.slug}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">Requisitos do Sistema</h3>
            <div className="requirements-preview">
              <div className="req-preview-item">
                <span>Sistema Operacional:</span>
                <span>{gameDetails.systemRequirements.minimum.os}</span>
              </div>
              <div className="req-preview-item">
                <span>Processador:</span>
                <span>{gameDetails.systemRequirements.minimum.processor}</span>
              </div>
              <div className="req-preview-item">
                <span>Memória:</span>
                <span>{gameDetails.systemRequirements.minimum.memory}</span>
              </div>
              <button 
                className="view-requirements-btn"
                onClick={() => alert('Requisitos completos em desenvolvimento!')}
              >
                Ver requisitos completos
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GamePage;