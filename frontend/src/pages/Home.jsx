import { Link } from 'react-router-dom';
import { Ghost, Gamepad2, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <section className="home-hero">
        <div className="container">
          <h1 className="home-hero-title">
            Bem-vindo ao <span>BadCatFor</span>
          </h1>
          <p className="home-hero-subtitle">
            A comunidade definitiva para amantes do terror. Descubra novos pesadelos, 
            discuta teorias e compartilhe suas experiências nos jogos mais assustadores.
          </p>
          <Link to="/games" className="auth-btn home-hero-button">
            <Gamepad2 size={24} />
            Explorar Jogos
          </Link>
        </div>
      </section>

      <div className="container home-features">
        <h2 className="home-features-title">Por que entrar no BadCatFor?</h2>
        
        <div className="features-grid">
          
          {/* Card 1 */}
          <div className="game-card feature-card">
            <div className="feature-icon"><Ghost size={48} /></div>
            <h3>Jogos Assustadores</h3>
            <p>Uma curadoria dos melhores (e piores) jogos de terror, dos clássicos aos indies obscuros.</p>
          </div>

          {/* Card 2 */}
          <div className="game-card feature-card">
            <div className="feature-icon"><Users size={48} /></div>
            <h3>Comunidade Ativa</h3>
            <p>Conecte-se com outros jogadores, personalize seu perfil e crie sua reputação no fórum.</p>
          </div>

          {/* Card 3 */}
          <div className="game-card feature-card">
            <div className="feature-icon"><Gamepad2 size={48} /></div>
            <h3>Reviews Sinceros</h3>
            <p>Leia e escreva análises detalhadas. Saiba se vale a pena levar aquele susto antes de comprar.</p>
          </div>

        </div>
      </div>

      <div className="home-news">
        <div className="container">
          <div className="news-header">
            <h2>Últimas Notícias</h2>
            <Link to="/about/news" className="news-link">
              Ver tudo <ArrowRight size={16} />
            </Link>
          </div>

          <div className="news-list">
            <div className="news-item">
              <small className="news-date">01 Jan, 2026</small>
              <h3>Silent Hill 2 Remake: O pesadelo retorna</h3>
              <p>Confira nossa análise completa sobre o retorno triunfante da Konami...</p>
            </div>
            
            <div className="news-item">
              <small className="news-date">28 Dez, 2025</small>
              <h3>Resident Evil 9 anunciado?</h3>
              <p>Rumores indicam que o próximo título da franquia se passará em uma ilha fantasma...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;