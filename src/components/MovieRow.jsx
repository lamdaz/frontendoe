import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MovieRow.css';

const MovieRow = ({ title, fetchData, type = 'movie' }) => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const imageBase = 'https://image.tmdb.org/t/p/w500';

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await fetchData();
      setMovies(data);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  };

  const handleClick = (item) => {
    const mediaType = item.media_type || type;
    navigate(`/watch/${mediaType}/${item.id}`);
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-row">
      <h2 className="movie-row__title">{title}</h2>
      <div className="movie-row__posters">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-row__poster-container"
            onClick={() => handleClick(movie)}
          >
            <img
              className="movie-row__poster"
              src={`${imageBase}${movie.poster_path || movie.backdrop_path}`}
              alt={movie.title || movie.name}
              loading="lazy"
            />
            <div className="movie-row__poster-info">
              <h3 className="movie-row__poster-title">
                {movie.title || movie.name}
              </h3>
              <div className="movie-row__poster-rating">
                ⭐ {movie.vote_average?.toFixed(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
