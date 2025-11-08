import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import MovieRow from '../components/MovieRow';
import {
  getTrendingMovies,
  getTrendingTV,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
} from '../api/api';
import '../styles/Browse.css';

const Browse = () => {
  const { category } = useParams();

  const renderContent = () => {
    switch (category) {
      case 'movies':
        return (
          <>
            <h1 className="browse__title">Movies</h1>
            <MovieRow title="Trending Movies" fetchData={getTrendingMovies} type="movie" />
            <MovieRow title="Popular Movies" fetchData={getPopularMovies} type="movie" />
            <MovieRow title="Top Rated Movies" fetchData={getTopRatedMovies} type="movie" />
          </>
        );
      case 'tv':
        return (
          <>
            <h1 className="browse__title">TV Shows</h1>
            <MovieRow title="Trending TV Shows" fetchData={getTrendingTV} type="tv" />
            <MovieRow title="Popular TV Shows" fetchData={getPopularTV} type="tv" />
            <MovieRow title="Top Rated TV Shows" fetchData={getTopRatedTV} type="tv" />
          </>
        );
      case 'trending':
        return (
          <>
            <h1 className="browse__title">Trending Now</h1>
            <MovieRow title="Trending Movies" fetchData={getTrendingMovies} type="movie" />
            <MovieRow title="Trending TV Shows" fetchData={getTrendingTV} type="tv" />
          </>
        );
      default:
        return (
          <>
            <h1 className="browse__title">Browse</h1>
            <MovieRow title="Trending Movies" fetchData={getTrendingMovies} type="movie" />
            <MovieRow title="Popular Movies" fetchData={getPopularMovies} type="movie" />
          </>
        );
    }
  };

  return (
    <div className="browse">
      <Header />
      <div className="browse__content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Browse;
