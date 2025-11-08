import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
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
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    loadDetails();
  }, [type, id]);

  useEffect(() => {
    if (details) {
      loadVideoSource();
    }
  }, [details, selectedSeason, selectedEpisode, selectedFile]);

  useEffect(() => {
    // Cleanup HLS on unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (videoUrl && videoRef.current && apiSources.length > 0) {
      const video = videoRef.current;
      const isHLS = apiSources[selectedFile]?.type === 'hls' || videoUrl.includes('.m3u8');

      if (isHLS) {
        if (Hls.isSupported()) {
          // Destroy previous HLS instance if exists
          if (hlsRef.current) {
            hlsRef.current.destroy();
          }

          // Create new HLS instance
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          
          hlsRef.current = hls;
          hls.loadSource(videoUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(e => console.log('Autoplay prevented:', e));
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.log('Network error, trying to recover...');
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log('Media error, trying to recover...');
                  hls.recoverMediaError();
                  break;
                default:
                  console.log('Fatal error, cannot recover');
                  hls.destroy();
                  break;
              }
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari native HLS support
          video.src = videoUrl;
          video.addEventListener('loadedmetadata', () => {
            video.play().catch(e => console.log('Autoplay prevented:', e));
          });
        }
      } else {
        // Regular MP4 video
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
        video.src = videoUrl;
      }
    }
  }, [videoUrl, apiSources, selectedFile]);

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
        // Process files and extract actual video URLs
        const processedFiles = apiData.files.map(file => {
          let actualUrl = file.file;
          
          // Check if file.file is a JSON string containing multiple URLs
          if (typeof file.file === 'string' && file.file.trim().startsWith('{')) {
            try {
              const urlsObject = JSON.parse(file.file);
              // Prefer hls1, then hls2, then hls3, then hls4, or first available
              actualUrl = urlsObject.hls1 || urlsObject.hls2 || urlsObject.hls3 || urlsObject.hls4 || Object.values(urlsObject)[0];
            } catch (e) {
              console.log('File is not JSON, using as-is');
            }
          }
          
          return {
            ...file,
            file: actualUrl,
            subtitles: apiData.subtitles || []
          };
        });
        
        setApiSources(processedFiles);
        setVideoUrl(processedFiles[selectedFile]?.file || processedFiles[0]?.file);
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
            <video
              ref={videoRef}
              className="watch__video"
              controls
              controlsList="nodownload"
            >
              {apiSources[selectedFile]?.subtitles?.map((subtitle, index) => (
                <track
                  key={index}
                  kind="subtitles"
                  src={subtitle.url}
                  srcLang={subtitle.lang || 'en'}
                  label={subtitle.lang || 'English'}
                />
              ))}
              Your browser does not support this video.
            </video>
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
