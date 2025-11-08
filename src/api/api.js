import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://diuuiu.onrender.com';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Create axios instance for backend API
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Create axios instance for TMDB API
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Get streaming sources for a movie
export const getMovieSources = async (tmdbId) => {
  try {
    const response = await api.get(`/movie/${tmdbId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie sources:', error);
    throw error;
  }
};

// Get streaming sources for a TV show episode
export const getTvSources = async (tmdbId, season, episode) => {
  try {
    const response = await api.get(`/tv/${tmdbId}`, {
      params: { s: season, e: episode }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TV sources:', error);
    throw error;
  }
};

// TMDB API calls

// Get trending movies
export const getTrendingMovies = async () => {
  try {
    const response = await tmdbApi.get('/trending/movie/week');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

// Get trending TV shows
export const getTrendingTV = async () => {
  try {
    const response = await tmdbApi.get('/trending/tv/week');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    return [];
  }
};

// Get popular movies
export const getPopularMovies = async () => {
  try {
    const response = await tmdbApi.get('/movie/popular');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

// Get popular TV shows
export const getPopularTV = async () => {
  try {
    const response = await tmdbApi.get('/tv/popular');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    return [];
  }
};

// Get top rated movies
export const getTopRatedMovies = async () => {
  try {
    const response = await tmdbApi.get('/movie/top_rated');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

// Get top rated TV shows
export const getTopRatedTV = async () => {
  try {
    const response = await tmdbApi.get('/tv/top_rated');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top rated TV shows:', error);
    return [];
  }
};

// Search movies and TV shows
export const searchMulti = async (query) => {
  try {
    const response = await tmdbApi.get('/search/multi', {
      params: { query }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching:', error);
    return [];
  }
};

// Get movie details
export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Get TV show details
export const getTVDetails = async (tvId) => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching TV details:', error);
    throw error;
  }
};

// Get TV season details
export const getTVSeasonDetails = async (tvId, seasonNumber) => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching season details:', error);
    throw error;
  }
};

// Get movie/TV genres
export const getGenres = async (type = 'movie') => {
  try {
    const response = await tmdbApi.get(`/genre/${type}/list`);
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreId) => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: { with_genres: genreId }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return [];
  }
};

export default api;
