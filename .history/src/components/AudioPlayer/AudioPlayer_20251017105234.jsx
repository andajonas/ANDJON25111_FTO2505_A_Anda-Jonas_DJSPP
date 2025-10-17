import { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import styles from './AudioPlayer.module.css';

export default function AudioPlayer() {
  const { currentEpisode, isPlaying, progress, duration, seek, pause, resume } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentEpisode) return null;

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
            src={currentEpisode.showImage} 
            alt={currentEpisode.showTitle}
            className={styles.episodeImage}
          />
          <div className={styles.episodeDetails}>
            <h4 className={styles.episodeTitle}>{currentEpisode.title}</h4>
            <p className={styles.showTitle}>{currentEpisode.showTitle}</p>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button 
            className={styles.controlButton}
            onClick={handlePlayPause}
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

      {/* Expanded View */}
      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.additionalControls}>
            <button 
              className={styles.secondaryButton}
              onClick={() => seek(Math.max(0, progress - 15))}
            >
              ⏮️ 15s
            </button>
            <button 
              className={styles.secondaryButton}
              onClick={() => seek(Math.min(duration, progress + 30))}
            >
              ⏭️ 30s
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
}
