import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__left">
        <h1 className="header__logo" onClick={() => navigate('/')}>
          CINEPRO
        </h1>
        <nav className="header__nav">
          <a href="/" className="header__nav-link">Home</a>
          <a href="/browse/movies" className="header__nav-link">Movies</a>
          <a href="/browse/tv" className="header__nav-link">TV Shows</a>
          <a href="/browse/trending" className="header__nav-link">Trending</a>
        </nav>
      </div>
      
      <div className="header__right">
        {showSearch ? (
          <form onSubmit={handleSearch} className="header__search-form">
            <input
              type="text"
              className="header__search-input"
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              onBlur={() => !searchQuery && setShowSearch(false)}
            />
          </form>
        ) : (
          <button 
            className="header__icon-btn" 
            onClick={() => setShowSearch(true)}
            aria-label="Search"
          >
            🔍
          </button>
        )}
        <button className="header__icon-btn" aria-label="Notifications">
          🔔
        </button>
        <div className="header__profile">
          <img 
            src="https://i.pravatar.cc/40" 
            alt="Profile" 
            className="header__profile-img"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
