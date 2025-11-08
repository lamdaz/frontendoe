import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrendingMovies } from '../api/api';
import '../styles/Banner.css';

const Banner = () => {
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();
  const imageBase = 'https://image.tmdb.org/t/p/original';

  useEffect(() => {
    loadBannerMovie();
  }, []);

  const loadBannerMovie = async () => {
    try {
      const movies = await getTrendingMovies();
      if (movies && movies.length > 0) {
        // Pick a random movie from the trending list
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        setMovie(randomMovie);
      }
    } catch (error) {
      console.error('Error loading banner movie:', error);
    }
  };

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  const handlePlay = () => {
    if (movie) {
      navigate(`/watch/movie/${movie.id}`);
    }
  };

  if (!movie) return null;

  return (
    <div 
      className="banner"
      style={{
        backgroundImage: `url(${imageBase}${movie.backdrop_path})`,
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        
        <div className="banner__buttons">
          <button className="banner__button banner__button--play" onClick={handlePlay}>
            ▶ Play
          </button>
          <button className="banner__button banner__button--info">
            ℹ More Info
          </button>
        </div>

        <p className="banner__description">
          {truncate(movie?.overview, 150)}
        </p>
      </div>
      
      <div className="banner__fadeBottom" />
    </div>
  );
};

export default Banner;
