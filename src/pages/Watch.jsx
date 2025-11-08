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
  const [apiSources, setApiSources] = useState([]);
  const [selectedFile, setSelectedFile] = useState(0);

  useEffect(() => {
    loadDetails();
  }, [type, id]);

  useEffect(() => {
    if (details) {
      loadVideoSource();
    }
  }, [details, selectedSeason, selectedEpisode, selectedFile]);

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
      // Only use your CinePro API
      let apiData;
      if (type === 'movie') {
        apiData = await getMovieSources(id);
      } else {
        apiData = await getTvSources(id, selectedSeason, selectedEpisode);
      }
      
      if (apiData && apiData.files && apiData.files.length > 0) {
        // Store both files and subtitles from API
        const filesWithSubtitles = apiData.files.map(file => ({
          ...file,
          subtitles: apiData.subtitles || []
        }));
        setApiSources(filesWithSubtitles);
        // Your API uses 'file' not 'url'
        setVideoUrl(filesWithSubtitles[selectedFile]?.file || filesWithSubtitles[0]?.file);
      } else {
        // Show message that video is not available
        setApiSources([]);
        setVideoUrl('');
      }
    } catch (error) {
      console.error('Error loading video source:', error);
      setApiSources([]);
      setVideoUrl('');
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
          {videoUrl && apiSources.length > 0 ? (
            apiSources[selectedFile]?.type === 'hls' || videoUrl.includes('.m3u8') ? (
              <video
                className="watch__video"
                controls
                autoPlay
                controlsList="nodownload"
              >
                <source src={videoUrl} type="application/x-mpegURL" />
                {apiSources[selectedFile]?.subtitles?.map((subtitle, index) => (
                  <track
                    key={index}
                    kind="subtitles"
                    src={subtitle.url}
                    srcLang={subtitle.lang || 'en'}
                    label={subtitle.lang || 'English'}
                  />
                ))}
                Your browser does not support HLS playback.
              </video>
            ) : (
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
                    srcLang={subtitle.lang || 'en'}
                    label={subtitle.lang || 'English'}
                  />
                ))}
                Your browser does not support the video tag.
              </video>
            )
          ) : (
            <div className="watch__not-available">
              <div className="watch__not-available-content">
                <h2>🎬 Video Not Available</h2>
                <p>This content is currently not available.</p>
                <p>Please try another movie or TV show.</p>
              </div>
            </div>
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
