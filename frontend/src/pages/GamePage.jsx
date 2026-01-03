import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, Heart, Share2, MessageSquare, ChevronDown, 
  ChevronUp, Clock, Users, Globe, Gamepad2, Calendar, AlertCircle 
} from 'lucide-react';

// Dados padrão para preencher lacunas da API (Mock Data)
const DEFAULT_GAME_DETAILS = {
  rating: 4.5,
  reviewCount: 0,
  price: 0,
  onSale: false,
  releaseDate: new Date().toISOString(),
  playtime: 'TBD',
  players: 'Single Player',
  genre: 'Ação',
  developer: 'Desconhecido',
  publisher: 'Desconhecido',
  platforms: ['PC'],
  screenshots: [],
  features: [],
  systemRequirements: {
    minimum: { os: 'Windows 10', processor: 'i5', memory: '8GB', graphics: 'GTX 1060', storage: '50GB' }
  }
};

const GamePage = () => {
  const { slug } = useParams();
  
  // Estados
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // Estado de Comentários
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // 1. Buscar Dados do Jogo e Comentários
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        // Fetch Jogo
        const gameRes = await fetch(`http://localhost:3000/api/games/${slug}`);
        let gameData = null;

        if (gameRes.ok) {
          gameData = await gameRes.json();
        } else {
          // Fallback: Tenta buscar na lista completa se a rota específica falhar
          console.warn('Rota específica falhou, tentando buscar na lista...');
          const allGamesRes = await fetch('http://localhost:3000/api/games');
          if (!allGamesRes.ok) throw new Error('Falha ao conectar com o servidor');
          
          const allGames = await allGamesRes.json();
          gameData = allGames.find(g => g.slug === slug);
        }

        if (!gameData) throw new Error('Jogo não encontrado');

        // Mescla dados da API com os dados padrão (DEFAULT_GAME_DETAILS)
        // Isso garante que a UI não quebre se faltar campos na API
        setGame({ ...DEFAULT_GAME_DETAILS, ...gameData });

        // Fetch Comentários (Opcional: Pode ser feito em uma rota separada)
        try {
          const commentsRes = await fetch(`http://localhost:3000/api/games/${slug}/comments`);
          if (commentsRes.ok) {
            const commentsData = await commentsRes.json();
            setComments(commentsData);
          }
        } catch (e) {
          console.error("Erro ao carregar comentários, iniciando lista vazia.");
        }

      } catch (err) {
        console.error('Erro fatal:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // 2. Handler para Adicionar Comentário
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmittingComment(true);

    try {
      const response = await fetch(`http://localhost:3000/api/games/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: newComment,
          userId: 1, // Exemplo: Substituir pelo ID do usuário logado real
          gameId: game.id 
        }),
      });

      if (response.ok) {
        const addedComment = await response.json();
        // Adiciona o comentário retornado à lista (optimistic update ou resposta da API)
        setComments(prev => [addedComment, ...prev]); 
        setNewComment('');
      } else {
        alert('Erro ao enviar comentário.');
      }
    } catch (err) {
      console.error('Erro no envio:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Renderização de Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Renderização de Erro
  if (error || !game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Ops! Algo deu errado.</h1>
        <p className="text-gray-400 mb-6">{error || 'Jogo não encontrado.'}</p>
        <Link to="/games" className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
          <ArrowLeft size={20} /> Voltar para Jogos
        </Link>
      </div>
    );
  }

  // Cálculos de preço para exibição
  const currentPrice = game.onSale ? (game.price * 0.8) : game.price;

  return (
    <div className="game-page bg-[#121212] min-h-screen text-gray-100 font-sans">
      
      {/* --- HERO SECTION --- */}
      <div 
        className="relative h-[500px] w-full bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(18,18,18,0.3), rgba(18,18,18,1)), url(${game.cover || 'https://via.placeholder.com/1920x600/222/555?text=Sem+Capa'})` 
        }}
      >
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
          <Link to="/games" className="absolute top-8 left-4 flex items-center gap-2 text-white hover:text-blue-400 transition">
            <ArrowLeft size={20} /> Voltar
          </Link>

          <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{game.name}</h1>

          <div className="flex flex-wrap items-center gap-6 mb-6">
            {/* Rating */}
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(game.rating) ? "#FFD700" : "none"} color="#FFD700" />
                ))}
              </div>
              <span className="text-sm font-medium">{game.rating} ({game.reviewCount} reviews)</span>
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-600/80 rounded-full text-xs font-semibold uppercase">{game.genre}</span>
              {game.platforms?.map(p => (
                <span key={p} className="px-3 py-1 bg-gray-700/80 rounded-full text-xs font-semibold uppercase">{p}</span>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-4 bg-gray-800/60 p-4 rounded-xl backdrop-blur-md border border-gray-700 max-w-fit">
            <div className="flex flex-col mr-4">
              {game.onSale && <span className="text-xs text-gray-400 line-through">R$ {game.price?.toFixed(2)}</span>}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {currentPrice > 0 ? `R$ ${currentPrice.toFixed(2)}` : 'Grátis'}
                </span>
                {game.onSale && <span className="bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded">-20%</span>}
              </div>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition transform hover:scale-105">
              Comprar Agora
            </button>
            
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-lg transition border ${isLiked ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-gray-700 hover:bg-gray-600 border-transparent'}`}
            >
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            </button>
            
            <button 
              className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* About */}
          <section>
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-blue-500 pl-4">Sobre o Jogo</h2>
            <div className={`text-gray-300 leading-relaxed overflow-hidden transition-all ${showFullDescription ? 'max-h-full' : 'max-h-32'}`}>
              <p>{game.description || "Descrição não disponível."}</p>
            </div>
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium"
            >
              {showFullDescription ? <><ChevronUp size={16}/> Mostrar menos</> : <><ChevronDown size={16}/> Ler mais</>}
            </button>

            {/* Features List */}
            {game.features && game.features.length > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {game.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                    <Star size={14} className="text-blue-500" /> {feat}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Gallery */}
          {game.screenshots && game.screenshots.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-blue-500 pl-4">Galeria</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {game.screenshots.map((src, idx) => (
                  <img 
                    key={idx} 
                    src={src} 
                    alt={`Screenshot ${idx}`} 
                    className="rounded-lg hover:opacity-80 transition cursor-pointer border border-gray-700"
                    onClick={() => window.open(src, '_blank')}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Comments Section */}
          <section className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="text-blue-500"/> Comentários ({comments.length})
            </h2>
            
            <div className="flex gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">EU</div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="O que você achou deste jogo?"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition resize-none h-24"
                />
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || submittingComment}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    {submittingComment ? 'Enviando...' : 'Publicar Comentário'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {comments.length > 0 ? comments.map((comment, index) => (
                <div key={comment.id || index} className="flex gap-4 border-b border-gray-700 pb-6 last:border-0">
                  <img 
                    src={comment.user?.photo || 'https://via.placeholder.com/40'} 
                    alt="User" 
                    className="w-10 h-10 rounded-full bg-gray-700"
                  />
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-white">{comment.user?.name || 'Usuário Anônimo'}</span>
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">Nenhum comentário ainda. Seja o primeiro!</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-white">Informações</h3>
            <div className="space-y-4">
              <InfoRow icon={Calendar} label="Lançamento" value={new Date(game.releaseDate).toLocaleDateString()} />
              <InfoRow icon={Clock} label="Tempo de Jogo" value={game.playtime} />
              <InfoRow icon={Users} label="Modo" value={game.players} />
              <InfoRow icon={Gamepad2} label="Desenvolvedor" value={game.developer} />
              <InfoRow icon={Globe} label="Distribuidora" value={game.publisher} />
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-white">Requisitos Mínimos</h3>
            <div className="text-sm space-y-3 text-gray-300">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-500">OS</span>
                <span>{game.systemRequirements?.minimum?.os}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-500">CPU</span>
                <span>{game.systemRequirements?.minimum?.processor}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-500">RAM</span>
                <span>{game.systemRequirements?.minimum?.memory}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-500">GPU</span>
                <span>{game.systemRequirements?.minimum?.graphics}</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

// Componente auxiliar para linhas da sidebar
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3 text-gray-400 group-hover:text-blue-400 transition">
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </div>
    <span className="text-sm font-medium text-gray-200">{value}</span>
  </div>
);

export default GamePage;