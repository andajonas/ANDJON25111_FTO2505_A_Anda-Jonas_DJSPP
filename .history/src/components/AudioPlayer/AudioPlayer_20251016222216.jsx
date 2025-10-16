import { useState, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import styles from './AudioPlayer.module.css';

export default function AudioPlayer() {
  const { currentEpisode, isPlaying, progress, duration, seek, pause, resume } = useAudio();


  const [isExpanded, setIsExpanded] = useState(false);
// 🆕 TEMPORARY: Test if player renders
  const displayEpisode = currentEpisode || {
    id: 'test',
    title: 'Click play on any episode to start listening',
    showTitle: 'Podcast App',
    showImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNGE5MGUyIi8+CjxwYXRoIGQ9Ik0xNiAxMkgyNFYyOEgxNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
    audio: 'https://www.soundjay.com/button/button-1.mp3'
  };

  if (!currentEpisode) {
    return (
      <div className={styles.audioPlayer}>
        <div className={styles.playerContent}>
          <div className={styles.episodeInfo}>
            <div className={styles.episodeDetails}>
              <h4 className={styles.episodeTitle}>Ready to listen</h4>
              <p className={styles.showTitle}>Click play on any episode</p>
            </div>
          </div>
          <div className={styles.controls}>
            <button className={styles.controlButton} disabled>
              ▶️
            </button>
          </div>
        </div>
      </div>
    );
  }
  // Confirm before leaving during playback
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPlaying && currentEpisode) {
        e.preventDefault();
        e.returnValue = 'You are currently listening to a podcast. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isPlaying, currentEpisode]);

  if (!currentEpisode) return null;

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
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
            onClick={isPlaying ? pause : resume}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <div className={styles.progressSection}>
            <span className={styles.time}>{formatTime(progress)}</span>
            <div className={styles.progressBar} onClick={handleSeek}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${(progress / duration) * 100}%` }}
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
          {/* Additional controls can go here */}
          <div className={styles.additionalControls}>
            <button className={styles.secondaryButton}>⏮️ 15s</button>
            <button className={styles.secondaryButton}>⏭️ 30s</button>
            <button className={styles.secondaryButton}>❤️</button>
          </div>
        </div>
      )}
    </div>
  );
}