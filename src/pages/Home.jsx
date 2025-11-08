import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import MovieRow from '../components/MovieRow';
import {
  getTrendingMovies,
  getTrendingTV,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
} from '../api/api';

const Home = () => {
  return (
    <div className="home">
      <Header />
      <Banner />
      
      <div className="home__rows">
        <MovieRow title="Trending Now" fetchData={getTrendingMovies} type="movie" />
        <MovieRow title="Popular Movies" fetchData={getPopularMovies} type="movie" />
        <MovieRow title="Top Rated Movies" fetchData={getTopRatedMovies} type="movie" />
        <MovieRow title="Trending TV Shows" fetchData={getTrendingTV} type="tv" />
        <MovieRow title="Popular TV Shows" fetchData={getPopularTV} type="tv" />
        <MovieRow title="Top Rated TV Shows" fetchData={getTopRatedTV} type="tv" />
      </div>
    </div>
  );
};

export default Home;
