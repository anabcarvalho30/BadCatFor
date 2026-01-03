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
      <h1>Nossos jogos!</h1>
      <div className='GamesPage'>
        {games.map(game => (
          <Link to={`/games/${game.slug}`} className="game-card-link">
            <div key={game.id} className="game-card">
              <img
                src={game.cover || 'https://via.placeholder.com/250'}
                alt={game.name}
                style={{ width: '100%', height: '25rem', objectFit: 'cover' }}
              />
              <h3>{game.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;