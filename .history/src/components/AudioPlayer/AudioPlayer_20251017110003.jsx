import { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import styles from './AudioPlayer.module.css';

export default function AudioPlayer() {
  const { currentEpisode, isPlaying, progress, duration, seek, pause, resume } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  // 🆕 FOR TESTING: Always show player
  const displayEpisode = currentEpisode || {
    id: 'test',
    title: 'Click play on any episode to start listening',
    showTitle: 'Podcast App',
    showImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNGE5MGUyIi8+CjxwYXRoIGQ9Ik0xNiAxMkgyNFYyOEgxNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
    audio: 'https://www.soundjay.com/button/button-1.mp3'
  };

  console.log('AudioPlayer - Current Episode:', currentEpisode); // 🆕 Debug log

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seek(newTime);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  return (
    <div className={`${styles.audioPlayer} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.playerContent}>
        {/* Episode Info */}
        <div className={styles.episodeInfo}>
          <img 
            src={displayEpisode.showImage} 
            alt={displayEpisode.showTitle}
            className={styles.episodeImage}
          />
          <div className={styles.episodeDetails}>
            <h4 className={styles.episodeTitle}>{displayEpisode.title}</h4>
            <p className={styles.showTitle}>{displayEpisode.showTitle}</p>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button 
            className={styles.controlButton}
            onClick={handlePlayPause}
            disabled={!currentEpisode}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <div className={styles.progressSection}>
            <span className={styles.time}>{formatTime(progress)}</span>
            <div className={styles.progressBar} onClick={handleSeek}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
              />
            </div>
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Expand Toggle */}
        <button 
          className={styles.expandButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>
    </div>
  );
}

