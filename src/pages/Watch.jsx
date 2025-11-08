import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getTVDetails, getMovieSources, getTvSources } from '../api/api';
import Header from '../components/Header';
import '../styles/Watch.css';

const Watch = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    loadDetails();
  }, [type, id]);

  useEffect(() => {
    if (details) {
      loadVideoSource();
    }
  }, [details, selectedSeason, selectedEpisode]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      let data;
      if (type === 'movie') {
        data = await getMovieDetails(id);
      } else {
        data = await getTVDetails(id);
      }
      setDetails(data);
    } catch (error) {
      console.error('Error loading details:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVideoSource = async () => {
    try {
      let sources;
      if (type === 'movie') {
        sources = await getMovieSources(id);
      } else {
        sources = await getTvSources(id, selectedSeason, selectedEpisode);
      }
      
      // Try to get the video URL from various possible source formats
      if (sources && sources.sources && sources.sources.length > 0) {
        setVideoUrl(sources.sources[0].url);
      } else if (sources && sources.stream) {
        setVideoUrl(sources.stream);
      } else {
        // Fallback to a demo video or trailer
        setVideoUrl(`https://vidsrc.to/embed/${type}/${id}`);
      }
    } catch (error) {
      console.error('Error loading video source:', error);
      // Fallback to embedded player
      setVideoUrl(`https://vidsrc.to/embed/${type}/${id}`);
    }
  };

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
    setSelectedEpisode(1);
  };

  if (loading) {
    return (
      <div className="watch">
        <Header />
        <div className="watch__loading">Loading...</div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="watch">
        <Header />
        <div className="watch__error">Content not found</div>
      </div>
    );
  }

  return (
    <div className="watch">
      <Header />
      
      <div className="watch__container">
        <button className="watch__back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="watch__player">
          {videoUrl && (
            <iframe
              src={videoUrl}
              className="watch__iframe"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
            />
          )}
        </div>

        <div className="watch__info">
          <h1 className="watch__title">
            {details.title || details.name}
          </h1>
          
          {type === 'tv' && (
            <div className="watch__episode-selector">
              <div className="watch__season-selector">
                <label>Season: </label>
                <select 
                  value={selectedSeason} 
                  onChange={(e) => handleSeasonChange(Number(e.target.value))}
                  className="watch__select"
                >
                  {Array.from({ length: details.number_of_seasons || 1 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Season {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="watch__episode-selector-inner">
                <label>Episode: </label>
                <select 
                  value={selectedEpisode} 
                  onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                  className="watch__select"
                >
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Episode {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="watch__metadata">
            <span className="watch__year">
              {details.release_date?.split('-')[0] || details.first_air_date?.split('-')[0]}
            </span>
            <span className="watch__rating">⭐ {details.vote_average?.toFixed(1)}</span>
            {details.runtime && (
              <span className="watch__runtime">{details.runtime} min</span>
            )}
          </div>

          <p className="watch__overview">{details.overview}</p>

          <div className="watch__genres">
            {details.genres?.map((genre) => (
              <span key={genre.id} className="watch__genre">
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
