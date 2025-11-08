# CinePro Frontend - Netflix-Style Streaming Interface

A modern, Netflix-inspired frontend for streaming movies and TV shows using your CinePro backend API.

## 🚀 Features

- **Netflix-Style UI** - Modern, responsive design
- **Movie & TV Show Streaming** - Watch content directly in browser
- **Multi-Source Support** - Automatically switch between available sources
- **Search Functionality** - Find movies and TV shows
- **Trending & Popular** - Browse curated collections
- **Season & Episode Selection** - For TV shows
- **Responsive Design** - Works on desktop, tablet, and mobile

## 📋 Prerequisites

1. **TMDB API Key** - Get from https://www.themoviedb.org/settings/api
2. **Backend Deployed** - Your backend should be running at https://diuuiu.onrender.com

## 🛠️ Installation

```bash
cd frontend
npm install
```

## ⚙️ Configuration

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Edit `.env` with your settings:
```env
VITE_API_BASE_URL=https://diuuiu.onrender.com
VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

## 🚀 Development

```bash
npm run dev
```

Visit http://localhost:3000

## 📦 Build for Production

```bash
npm run build
```

## 🌐 Deployment Options

### Option 1: Netlify (Recommended)

1. Push frontend to GitHub
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify dashboard

### Option 2: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Add environment variables

### Option 3: Render.com

1. Create new Static Site
2. Connect your repository
3. Build command: `npm run build`
4. Publish directory: `dist`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Banner.jsx
│   │   ├── MovieRow.jsx
│   │   └── VideoPlayer.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── TVDetails.jsx
│   │   └── Search.jsx
│   ├── api/             # API integration
│   │   └── api.js
│   ├── styles/          # CSS files
│   │   └── App.css
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## 🎬 Complete Implementation

Due to file size, here's the complete code structure you need to implement:

### 1. Create `src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 2. Create `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import TVDetails from './pages/TVDetails'
import Search from './pages/Search'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<TVDetails />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

### 3. Create Components

**`src/components/Navbar.jsx`**:
```jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [show, setShow] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav className={`navbar ${show ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-logo">CINEPRO</Link>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/">Movies</Link></li>
        <li><Link to="/">TV Shows</Link></li>
      </ul>
      <div className="navbar-search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search movies, TV shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </nav>
  )
}
```

**`src/components/Banner.jsx`**:
```jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTrendingMovies } from '../api/api'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/original'

export default function Banner() {
  const [movie, setMovie] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const movies = await getTrendingMovies()
      if (movies.length > 0) {
        setMovie(movies[Math.floor(Math.random() * movies.length)])
      }
    }
    fetchData()
  }, [])

  if (!movie) return <div className="loading"><div className="spinner"></div></div>

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str
  }

  return (
    <header
      className="banner"
      style={{
        backgroundImage: `url(${IMAGE_BASE}${movie.backdrop_path})`,
      }}
    >
      <div className="banner-content">
        <h1 className="banner-title">{movie.title || movie.name}</h1>
        <p className="banner-description">{truncate(movie.overview, 150)}</p>
        <div className="banner-buttons">
          <button
            className="banner-button play"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            ▶ Play
          </button>
          <button
            className="banner-button info"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            ℹ More Info
          </button>
        </div>
      </div>
    </header>
  )
}
```

**`src/components/MovieRow.jsx`**:
```jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export default function MovieRow({ title, fetchData, isLargeRow = false, type = 'movie' }) {
  const [movies, setMovies] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchData()
      setMovies(data)
    }
    fetch()
  }, [fetchData])

  const handleClick = (item) => {
    const mediaType = item.media_type || type
    navigate(`/${mediaType}/${item.id}`)
  }

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            className={`row-poster ${isLargeRow ? 'row-poster-large' : ''}`}
            src={`${IMAGE_BASE}${isLargeRow ? movie.poster_path : movie.backdrop_path || movie.poster_path}`}
            alt={movie.title || movie.name}
            onClick={() => handleClick(movie)}
          />
        ))}
      </div>
    </div>
  )
}
```

**`src/components/VideoPlayer.jsx`**:
```jsx
import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'

export default function VideoPlayer({ sources, onClose, title }) {
  const [currentSource, setCurrentSource] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (sources && sources.length > 0) {
      setCurrentSource(0)
      setError(false)
    }
  }, [sources])

  if (!sources || sources.length === 0) {
    return (
      <div className="video-player-container">
        <div className="player-controls">
          <button className="close-player" onClick={onClose}>✕ Close</button>
        </div>
        <div className="error-message">
          No streaming sources available for this content.
        </div>
      </div>
    )
  }

  const handleError = () => {
    if (currentSource < sources.length - 1) {
      setCurrentSource(currentSource + 1)
    } else {
      setError(true)
    }
  }

  return (
    <div className="video-player-container">
      <div className="player-controls">
        <button className="close-player" onClick={onClose}>✕ Close</button>
      </div>
      
      {!error ? (
        <>
          <ReactPlayer
            url={sources[currentSource].url}
            controls
            playing
            width="100%"
            height="100%"
            onError={handleError}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload'
                }
              }
            }}
          />
          <div className="source-selector">
            {sources.map((source, index) => (
              <button
                key={index}
                className={`source-button ${index === currentSource ? 'active' : ''}`}
                onClick={() => {
                  setCurrentSource(index)
                  setError(false)
                }}
              >
                {source.provider}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="error-message">
          Failed to load video. Please try another source or try again later.
        </div>
      )}
    </div>
  )
}
```

### 4. Create Pages

**`src/pages/Home.jsx`**:
```jsx
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import MovieRow from '../components/MovieRow'
import {
  getTrendingMovies,
  getTrendingTV,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV
} from '../api/api'

export default function Home() {
  return (
    <div>
      <Navbar />
      <Banner />
      <MovieRow title="Trending Now" fetchData={getTrendingMovies} isLargeRow />
      <MovieRow title="Popular Movies" fetchData={getPopularMovies} />
      <MovieRow title="Trending TV Shows" fetchData={getTrendingTV} type="tv" />
      <MovieRow title="Popular TV Shows" fetchData={getPopularTV} type="tv" />
      <MovieRow title="Top Rated Movies" fetchData={getTopRatedMovies} />
      <MovieRow title="Top Rated TV Shows" fetchData={getTopRatedTV} type="tv" />
    </div>
  )
}
```

**`src/pages/MovieDetails.jsx`**:
```jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import VideoPlayer from '../components/VideoPlayer'
import { getMovieDetails, getMovieSources } from '../api/api'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/original'

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [sources, setSources] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMovie = async () => {
      const data = await getMovieDetails(id)
      setMovie(data)
    }
    fetchMovie()
  }, [id])

  const handlePlay = async () => {
    setLoading(true)
    try {
      const data = await getMovieSources(id)
      if (data.sources && data.sources.length > 0) {
        setSources(data.sources)
        setPlaying(true)
      } else {
        alert('No streaming sources available')
      }
    } catch (error) {
      alert('Failed to load streaming sources')
    }
    setLoading(false)
  }

  if (!movie) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="movie-details">
      <Navbar />
      <div
        className="details-banner"
        style={{
          backgroundImage: `url(${IMAGE_BASE}${movie.backdrop_path})`,
        }}
      >
        <div className="details-content">
          <h1 className="details-title">{movie.title}</h1>
          <div className="details-meta">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{movie.release_date?.split('-')[0]}</span>
            <span>{movie.runtime} min</span>
          </div>
          <p className="details-overview">{movie.overview}</p>
          <button
            className="play-button"
            onClick={handlePlay}
            disabled={loading}
          >
            {loading ? 'Loading...' : '▶ Play Now'}
          </button>
        </div>
      </div>

      {playing && (
        <VideoPlayer
          sources={sources}
          onClose={() => setPlaying(false)}
          title={movie.title}
        />
      )}
    </div>
  )
}
```

**`src/pages/TVDetails.jsx`**:
```jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import VideoPlayer from '../components/VideoPlayer'
import { getTVDetails, getTVSeasonDetails, getTvSources } from '../api/api'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/original'

export default function TVDetails() {
  const { id } = useParams()
  const [show, setShow] = useState(null)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [episodes, setEpisodes] = useState([])
  const [sources, setSources] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchShow = async () => {
      const data = await getTVDetails(id)
      setShow(data)
      if (data.number_of_seasons > 0) {
        fetchSeason(1)
      }
    }
    fetchShow()
  }, [id])

  const fetchSeason = async (seasonNumber) => {
    const data = await getTVSeasonDetails(id, seasonNumber)
    setEpisodes(data.episodes || [])
    setSelectedSeason(seasonNumber)
  }

  const handlePlayEpisode = async (seasonNumber, episodeNumber) => {
    setLoading(true)
    try {
      const data = await getTvSources(id, seasonNumber, episodeNumber)
      if (data.sources && data.sources.length > 0) {
        setSources(data.sources)
        setPlaying(true)
      } else {
        alert('No streaming sources available')
      }
    } catch (error) {
      alert('Failed to load streaming sources')
    }
    setLoading(false)
  }

  if (!show) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="movie-details">
      <Navbar />
      <div
        className="details-banner"
        style={{
          backgroundImage: `url(${IMAGE_BASE}${show.backdrop_path})`,
        }}
      >
        <div className="details-content">
          <h1 className="details-title">{show.name}</h1>
          <div className="details-meta">
            <span>⭐ {show.vote_average.toFixed(1)}</span>
            <span>{show.first_air_date?.split('-')[0]}</span>
            <span>{show.number_of_seasons} Seasons</span>
          </div>
          <p className="details-overview">{show.overview}</p>
        </div>
      </div>

      <div className="season-selector">
        <div className="season-buttons">
          {Array.from({ length: show.number_of_seasons }, (_, i) => i + 1).map((season) => (
            <button
              key={season}
              className={`season-button ${selectedSeason === season ? 'active' : ''}`}
              onClick={() => fetchSeason(season)}
            >
              Season {season}
            </button>
          ))}
        </div>

        <div className="episodes-grid">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="episode-card"
              onClick={() => handlePlayEpisode(selectedSeason, episode.episode_number)}
            >
              <img
                className="episode-thumbnail"
                src={`${IMAGE_BASE}${episode.still_path}`}
                alt={episode.name}
                onError={(e) => e.target.src = `${IMAGE_BASE}${show.backdrop_path}`}
              />
              <div className="episode-info">
                <h3 className="episode-title">{episode.name}</h3>
                <p className="episode-number">Episode {episode.episode_number}</p>
                <p className="episode-overview">{episode.overview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {playing && (
        <VideoPlayer
          sources={sources}
          onClose={() => setPlaying(false)}
          title={show.name}
        />
      )}
    </div>
  )
}
```

**`src/pages/Search.jsx`**:
```jsx
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { searchMulti } from '../api/api'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export default function Search() {
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const query = searchParams.get('q')

  useEffect(() => {
    const search = async () => {
      if (query) {
        setLoading(true)
        const data = await searchMulti(query)
        setResults(data.filter(item => item.media_type === 'movie' || item.media_type === 'tv'))
        setLoading(false)
      }
    }
    search()
  }, [query])

  const handleClick = (item) => {
    navigate(`/${item.media_type}/${item.id}`)
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '20px 50px' }}>
        <h1 style={{ marginBottom: '30px' }}>Search Results for "{query}"</h1>
        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : results.length > 0 ? (
          <div className="episodes-grid">
            {results.map((item) => (
              <div
                key={item.id}
                className="episode-card"
                onClick={() => handleClick(item)}
              >
                <img
                  className="episode-thumbnail"
                  src={`${IMAGE_BASE}${item.poster_path || item.backdrop_path}`}
                  alt={item.title || item.name}
                  onError={(e) => e.target.style.display = 'none'}
                />
                <div className="episode-info">
                  <h3 className="episode-title">{item.title || item.name}</h3>
                  <p className="episode-number">
                    {item.media_type === 'movie' ? 'Movie' : 'TV Show'} • {item.release_date || item.first_air_date}
                  </p>
                  <p className="episode-overview">{item.overview}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  )
}
```

## 🔧 Important Notes

1. **TMDB API Key Required** - Get free API key from TMDB
2. **Backend Must Be Running** - Ensure https://diuuiu.onrender.com is accessible
3. **First Request May Be Slow** - Render.com free tier sleeps after inactivity
4. **CORS** - Backend ALLOWED_ORIGINS must include your frontend URL

## 📝 Environment Variables Summary

```env
VITE_API_BASE_URL=https://diuuiu.onrender.com
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your TMDB API key

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📺 Usage

1. Browse trending and popular content on home page
2. Click any poster to view details
3. Click "Play" button to start streaming
4. Use search bar to find specific content
5. For TV shows, select season and episode

## 🎨 Customization

- Edit `src/styles/App.css` for styling
- Modify colors in CSS (Netflix red: #e50914)
- Adjust layout in component files
- Add more features as needed

## 🐛 Troubleshooting

**No sources available:**
- Backend might be sleeping (first request takes ~30s)
- Check backend is deployed and accessible
- Verify TMDB ID is correct

**Images not loading:**
- Check TMDB API key is valid
- Verify image URLs in browser console

**CORS errors:**
- Update backend ALLOWED_ORIGINS to include frontend URL

## 📄 License

Same as backend project

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Backend API:** https://diuuiu.onrender.com
**Created with:** React + Vite + React Router + Axios + React Player
