import { Link } from 'react-router-dom';
import { Ghost, Gamepad2, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <section style={{
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url("https://fjapncbcetbchzoostmw.supabase.co/storage/v1/object/public/images/BadCatBanner.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 20px',
        textAlign: 'center',
        borderBottom: '1px solid #333'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', textShadow: '0 0 10px #000' }}>
            Bem-vindo ao <span>BadCatFor</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '700px', margin: '0 auto 40px' }}>
            A comunidade definitiva para amantes do terror. Descubra novos pesadelos, 
            discuta teorias e compartilhe suas experiências nos jogos mais assustadores.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/games" className="auth-btn" style={{ textDecoration: 'none', fontSize: '1.1rem', padding: '15px 30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Gamepad2 size={24} />
              Explorar Jogos
            </Link>
            <Link to="/signup" style={{ 
              padding: '15px 30px', 
              border: '1px solid #8200b6ff', 
              borderRadius: '4px', 
              color: '#8200b6ff', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>Por que entrar no BadCatFor?</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* Card 1 */}
          <div className="game-card" style={{ textAlign: 'center', padding: '30px' }}>
            <div><Ghost size={48} /></div>
            <h3>Jogos Assustadores</h3>
            <p style={{ color: '#aaa' }}>Uma curadoria dos melhores (e piores) jogos de terror, dos clássicos aos indies obscuros.</p>
          </div>

          {/* Card 2 */}
          <div className="game-card" style={{ textAlign: 'center', padding: '30px' }}>
            <div><Users size={48} /></div>
            <h3>Comunidade Ativa</h3>
            <p style={{ color: '#aaa' }}>Conecte-se com outros jogadores, personalize seu perfil e crie sua reputação no fórum.</p>
          </div>

          {/* Card 3 */}
          <div className="game-card" style={{ textAlign: 'center', padding: '30px' }}>
            <div><Gamepad2 size={48} /></div>
            <h3>Reviews Sinceros</h3>
            <p style={{ color: '#aaa' }}>Leia e escreva análises detalhadas. Saiba se vale a pena levar aquele susto antes de comprar.</p>
          </div>

        </div>
      </div>

      <div style={{ background: '#222', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>Últimas Notícias</h2>
            <Link to="/about/news" style={{ color: '#8200b6ff', display: 'flex', alignItems: 'center', gap: '5px' }}>
              Ver tudo <ArrowRight size={16} />
            </Link> {/*Path não existe!!!*/}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '20px', background: '#1a1a1a', borderLeft: '4px solid #8200b6ff', borderRadius: '4px' }}>
              <small style={{ color: '#888' }}>01 Jan, 2026</small>
              <h3 style={{ margin: '5px 0' }}>Silent Hill 2 Remake: O pesadelo retorna</h3>
              <p style={{ margin: 0, color: '#ccc' }}>Confira nossa análise completa sobre o retorno triunfante da Konami...</p>
            </div>
            
            <div style={{ padding: '20px', background: '#1a1a1a', borderLeft: '4px solid #e74c3c', borderRadius: '4px' }}>
              <small style={{ color: '#888' }}>28 Dez, 2025</small>
              <h3 style={{ margin: '5px 0' }}>Resident Evil 9 anunciado?</h3>
              <p style={{ margin: 0, color: '#ccc' }}>Rumores indicam que o próximo título da franquia se passará em uma ilha fantasma...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;