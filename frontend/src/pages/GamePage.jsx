import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Download, 
  Gamepad2, 
  Calendar, 
  Clock, 
  Users, 
  Globe, 
  Heart, 
  Share2, 
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Dados de exemplo - você substituirá por dados da API
const mockGameData = {
  id: 1,
  name: 'Silent Hill 2 Remake',
  slug: 'silent-hill-2-remake',
  cover: 'https://fjapncbcetbchzoostmw.supabase.co/storage/v1/object/public/images/game-covers/silent-hill-2.jpg',
  description: 'O remake aclamado do clássico de terror psicológico. Retorne à cidade de Silent Hill em uma experiência reconstruída do zero com gráficos de última geração e jogabilidade modernizada.',
  releaseDate: '2024-10-08',
  playtime: '15-20 horas',
  players: 'Single Player',
  genre: 'Terror Psicológico',
  developer: 'Bloober Team',
  publisher: 'Konami',
  platforms: ['PS5', 'PC', 'Xbox Series X/S'],
  rating: 4.8,
  reviewCount: 1247,
  price: 249.90,
  onSale: true,
  salePrice: 199.90,
  screenshots: [
    'https://fjapncbcetbchzoostmw.supabase.co/storage/v1/object/public/images/game-screens/silent-hill-1.jpg',
    'https://fjapncbcetbchzoostmw.supabase.co/storage/v1/object/public/images/game-screens/silent-hill-2.jpg',
    'https://fjapncbcetbchzoostmw.supabase.co/storage/v1/object/public/images/game-screens/silent-hill-3.jpg',
    'https://fjapncbcetbchzoostmw.supabase.co/storage/v1/object/public/images/game-screens/silent-hill-4.jpg'
  ],
  features: [
    'Gr�ficos em 4K com ray tracing',
    'Sistema de combate redesenhado',
    'Trilha sonora remasterizada',
    'Novas �reas explor�veis',
    'Modo foto integrado'
  ],
  systemRequirements: {
    minimum: {
      os: 'Windows 10 64-bit',
      processor: 'Intel Core i5-7500 / AMD Ryzen 3 1200',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GTX 1060 6GB / AMD RX 580 8GB',
      storage: '50 GB'
    },
    recommended: {
      os: 'Windows 11 64-bit',
      processor: 'Intel Core i7-9700K / AMD Ryzen 5 3600',
      memory: '16 GB RAM',
      graphics: 'NVIDIA RTX 2070 / AMD RX 6700 XT',
      storage: '50 GB SSD'
    }
  }
};

const GamePage = () => {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSystemRequirements, setShowSystemRequirements] = useState(false);

  // Aqui você fará a requisição para a API usando o slug
  // const { data: game, loading, error } = useFetchGame(slug);
  
  const game = mockGameData; // Temporário

  if (!game) {
    return (
      <div className="container">
        <div className="game-not-found">
          <h1>Jogo n�o encontrado</h1>
          <p>O jogo que voc� est� procurando n�o existe ou foi removido.</p>
          <Link to="/games" className="auth-btn">
            <ArrowLeft size={20} />
            Voltar para Jogos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      {/* Hero Section com Cover */}
      <div 
        className="game-hero"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${game.cover})` }}
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
                      fill={i < Math.floor(game.rating) ? "#FFD700" : "none"} 
                      color="#FFD700" 
                    />
                  ))}
                  <span className="rating-text">{game.rating}/5 ({game.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="game-tags">
                <span className="game-tag">{game.genre}</span>
                <span className="game-tag">{game.players}</span>
                {game.platforms.map((platform, index) => (
                  <span key={index} className="game-tag platform-tag">{platform}</span>
                ))}
              </div>
            </div>

            <div className="game-actions">
              <div className="price-section">
                {game.onSale ? (
                  <>
                    <span className="original-price">R$ {game.price.toFixed(2)}</span>
                    <span className="sale-price">R$ {game.salePrice.toFixed(2)}</span>
                    <span className="discount-badge">-{Math.round((1 - game.salePrice/game.price) * 100)}%</span>
                  </>
                ) : (
                  <span className="current-price">R$ {game.price.toFixed(2)}</span>
                )}
              </div>

              <div className="action-buttons">
                <button className="action-btn primary-btn">
                  <Download size={20} />
                  Comprar Agora
                </button>
                <button 
                  className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart size={20} fill={isLiked ? "#ff4757" : "none"} />
                  {isLiked ? 'Remover' : 'Favoritar'}
                </button>
                <button className="action-btn share-btn">
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
                  {game.features.map((feature, index) => (
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
          <section className="game-section">
            <h2 className="section-title">Capturas de Tela</h2>
            <div className="screenshots-grid">
              {game.screenshots.map((screenshot, index) => (
                <div 
                  key={index}
                  className={`screenshot-thumb ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={screenshot} alt={`Screenshot ${index + 1}`} />
                </div>
              ))}
            </div>
            <div className="screenshot-main">
              <img src={game.screenshots[selectedImage]} alt="Visualização principal" />
            </div>
          </section>

          {/* Informações Técnicas */}
          <section className="game-section">
            <h2 className="section-title">Informações do Jogo</h2>
            <div className="game-info-grid">
              <div className="info-item">
                <Calendar size={20} />
                <div>
                  <span className="info-label">Data de Lançamento</span>
                  <span className="info-value">{new Date(game.releaseDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <div className="info-item">
                <Clock size={20} />
                <div>
                  <span className="info-label">Tempo de Jogo</span>
                  <span className="info-value">{game.playtime}</span>
                </div>
              </div>
              <div className="info-item">
                <Users size={20} />
                <div>
                  <span className="info-label">Modo de Jogo</span>
                  <span className="info-value">{game.players}</span>
                </div>
              </div>
              <div className="info-item">
                <Gamepad2 size={20} />
                <div>
                  <span className="info-label">Desenvolvedor</span>
                  <span className="info-value">{game.developer}</span>
                </div>
              </div>
              <div className="info-item">
                <Globe size={20} />
                <div>
                  <span className="info-label">Distribuidora</span>
                  <span className="info-value">{game.publisher}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Requisitos do Sistema */}
          <section className="game-section">
            <div className="section-header">
              <h2 className="section-title">Requisitos do Sistema</h2>
              <button 
                className="toggle-btn"
                onClick={() => setShowSystemRequirements(!showSystemRequirements)}
              >
                {showSystemRequirements ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            
            {showSystemRequirements && (
              <div className="system-requirements">
                <div className="requirements-grid">
                  <div className="requirements-card">
                    <h3 className="requirements-title">Mínimos</h3>
                    <div className="requirements-list">
                      <div className="req-item">
                        <span className="req-label">Sistema Operacional</span>
                        <span className="req-value">{game.systemRequirements.minimum.os}</span>
                      </div>
                      <div className="req-item">
                        <span className="req-label">Processador</span>
                        <span className="req-value">{game.systemRequirements.minimum.processor}</span>
                      </div>
                      <div className="req-item">
                        <span className="req-label">Memória</span>
                        <span className="req-value">{game.systemRequirements.minimum.memory}</span>
                      </div>
                      <div className="req-item">
                        <span className="req-label">Placa de Vídeo</span>
                        <span className="req-value">{game.systemRequirements.minimum.graphics}</span>
                      </div>
                      <div className="req-item">
                        <span className="req-label">Armazenamento</span>
                        <span className="req-value">{game.systemRequirements.minimum.storage}</span>
                      </div>
                    </div>
                  </div>

                  <div className="requirements-card recommended">
                    <h3 className="requirements-title">Recomendados</h3>
                    <div className="requirements-list">
                      <div className="req-item">
                        <span className="req-label">Sistema Operacional</span>
                        <span className="req-value">{game.systemRequirements.recommended.os}</span>
                      </div>
                      <div className="req-item">
                        <span className="req-label">Processador</span>
                        <span className="req-value">{game.systemRequirements.recommended.processor}</span>
                      </div>
                      <div className="req-item">
                        <span className="req-label">Memória</span>
                        <span className="req-value">{game.systemRequirements.recommended.memory}</span>
                      </div>
                      <div className="req-item">
                        <span className="req-label">Placa de Vídeo</span>
                        <span className="req-value">{game.systemRequirements.recommended.graphics}</span>
                      </div>
                      <div className="req-item">
                        <span className="req-label">Armazenamento</span>
                        <span className="req-value">{game.systemRequirements.recommended.storage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="game-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Jogo Disponível Em</h3>
            <div className="platforms-list">
              {game.platforms.map((platform, index) => (
                <div key={index} className="platform-item">
                  <span className="platform-icon">🎮</span>
                  <span>{platform}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">Comunidade</h3>
            <div className="community-stats">
              <div className="stat-item">
                <Heart size={20} />
                <span>1.2K Favoritos</span>
              </div>
              <div className="stat-item">
                <MessageSquare size={20} />
                <span>847 Comentários</span>
              </div>
            </div>
            <button className="community-btn">
              <Users size={20} />
              Entrar na Comunidade
            </button>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">Jogos Similares</h3>
            <div className="similar-games">
              <div className="similar-game">
                <img src="https://via.placeholder.com/60" alt="Similar Game" />
                <div>
                  <h4>Resident Evil 4 Remake</h4>
                  <span className="similar-price">R$ 199,90</span>
                </div>
              </div>
              <div className="similar-game">
                <img src="https://via.placeholder.com/60" alt="Similar Game" />
                <div>
                  <h4>The Medium</h4>
                  <span className="similar-price">R$ 149,90</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GamePage;