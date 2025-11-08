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
  const [selectedSource, setSelectedSource] = useState(0);
  const [apiSources, setApiSources] = useState([]);
  const [selectedFile, setSelectedFile] = useState(0);
  const [useApiSource, setUseApiSource] = useState(true);

  useEffect(() => {
    loadDetails();
  }, [type, id]);

  useEffect(() => {
    if (details) {
      loadVideoSource();
    }
  }, [details, selectedSeason, selectedEpisode, selectedSource, useApiSource, selectedFile]);

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

  const getStreamingSources = () => {
    if (type === 'tv') {
      return [
        { name: 'VidSrc Pro', url: `https://vidsrc.xyz/embed/${type}/${id}/${selectedSeason}/${selectedEpisode}` },
        { name: 'VidSrc', url: `https://vidsrc.in/embed/${type}/${id}/${selectedSeason}-${selectedEpisode}` },
        { name: 'Embed', url: `https://www.2embed.cc/embedtv/${id}&s=${selectedSeason}&e=${selectedEpisode}` },
        { name: 'SuperEmbed', url: `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}` },
      ];
    } else {
      return [
        { name: 'VidSrc Pro', url: `https://vidsrc.xyz/embed/${type}/${id}` },
        { name: 'VidSrc', url: `https://vidsrc.in/embed/${type}/${id}` },
        { name: 'Embed', url: `https://www.2embed.cc/embed/${id}` },
        { name: 'SuperEmbed', url: `https://multiembed.mov/?video_id=${id}&tmdb=1` },
      ];
    }
  };

  const loadVideoSource = async () => {
    try {
      if (useApiSource) {
        // Try to get sources from the backend API first
        let apiData;
        if (type === 'movie') {
          apiData = await getMovieSources(id);
        } else {
          apiData = await getTvSources(id, selectedSeason, selectedEpisode);
        }
        
        if (apiData && apiData.files && apiData.files.length > 0) {
          setApiSources(apiData.files);
          setVideoUrl(apiData.files[selectedFile]?.url || apiData.files[0]?.url);
          return;
        }
      }
      
      // Fallback to embedded sources
      const sources = getStreamingSources();
      setVideoUrl(sources[selectedSource].url);
    } catch (error) {
      console.error('Error loading video source:', error);
      // Fallback to embedded sources on error
      const sources = getStreamingSources();
      setVideoUrl(sources[selectedSource].url);
    }
  };

  const handleSourceChange = (index) => {
    setSelectedSource(index);
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
            apiSources.length > 0 ? (
              <video
                className="watch__video"
                controls
                autoPlay
                controlsList="nodownload"
              >
                <source src={videoUrl} type="video/mp4" />
                {apiSources[selectedFile]?.subtitles?.map((subtitle, index) => (
                  <track
                    key={index}
                    kind="subtitles"
                    src={subtitle.url}
                    srcLang={subtitle.lang}
                    label={subtitle.lang}
                  />
                ))}
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={videoUrl}
                className="watch__iframe"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
              />
            )
          )}
        </div>

        {apiSources.length > 1 && (
          <div className="watch__source-selector">
            <label className="watch__source-label">Quality / File:</label>
            <div className="watch__source-buttons">
              {apiSources.map((file, index) => (
                <button
                  key={index}
                  className={`watch__source-btn ${selectedFile === index ? 'active' : ''}`}
                  onClick={() => setSelectedFile(index)}
                >
                  {file.quality || `File ${index + 1}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {apiSources.length === 0 && (
          <div className="watch__source-selector">
            <label className="watch__source-label">Video Source (Switch if ads appear):</label>
            <div className="watch__source-buttons">
              {getStreamingSources().map((source, index) => (
                <button
                  key={index}
                  className={`watch__source-btn ${selectedSource === index ? 'active' : ''}`}
                  onClick={() => handleSourceChange(index)}
                >
                  {source.name}
                </button>
              ))}
            </div>
          </div>
        )}

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
