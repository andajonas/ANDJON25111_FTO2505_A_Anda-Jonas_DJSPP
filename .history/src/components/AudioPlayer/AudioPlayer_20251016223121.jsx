import { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import styles from './AudioPlayer.module.css';

export default function AudioPlayer() {
  const { currentEpisode, isPlaying, progress, duration, seek, pause, resume } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  // 🆕 FOR TESTING: Always show player with default content
  const displayEpisode = currentEpisode || {
    id: 'test',
    title: 'No episode playing - Click "Test Audio Player"',
    showTitle: 'Podcast App',
    showImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNGE5MGUyIi8+CjxwYXRoIGQ9Ik0xNiAxMkgyNFYyOEgxNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
    audio: 'https://www.soundjay.com/button/button-1.mp3'
  };

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

      {/* Expanded View - Only show when expanded AND there's a real episode */}
      {isExpanded && currentEpisode && (
        <div className={styles.expandedContent}>
          <div className={styles.additionalControls}>
            <button 
              className={styles.secondaryButton}
              onClick={() => seek(Math.max(0, progress - 15))}
              disabled={!currentEpisode}
            >
              ⏮️ 15s
            </button>
            <button 
              className={styles.secondaryButton}
              onClick={() => seek(Math.min(duration, progress + 30))}
              disabled={!currentEpisode}
            >
              ⏭️ 30s
            </button>
          </div>
        </div>
      )}
    </div>
  );
}