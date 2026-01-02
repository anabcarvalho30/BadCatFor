import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const GamesPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    api.get('/games')
      .then(response => setGames(response.data))
      .catch(error => console.error("Erro", error));
  }, []);

  return (
    <div className="container">
      <h1>Últimos Jogos de Terror</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {games.map(game => (
          <div key={game.id} className="game-card">
            <img 
              src={game.image} 
              alt={game.name} 
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            <h3>{game.name}</h3>
            <Link to={`/games/${game.slug}`}>Ver Detalhes</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;