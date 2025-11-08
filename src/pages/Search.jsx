import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import MovieRow from '../components/MovieRow';
import { searchMulti } from '../api/api';
import '../styles/Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const data = await searchMulti(query);
      setResults(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => results;

  return (
    <div className="search">
      <Header />
      <div className="search__content">
        <h1 className="search__title">
          {query ? `Search results for "${query}"` : 'Search'}
        </h1>
        
        {loading ? (
          <div className="search__loading">Searching...</div>
        ) : results.length > 0 ? (
          <MovieRow 
            title={`Found ${results.length} results`} 
            fetchData={fetchResults}
          />
        ) : query ? (
          <div className="search__no-results">
            No results found for "{query}"
          </div>
        ) : (
          <div className="search__empty">
            Use the search bar to find movies and TV shows
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
