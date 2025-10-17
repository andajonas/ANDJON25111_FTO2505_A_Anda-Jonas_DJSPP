import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Listening Progress State
  const [listeningProgress, setListeningProgress] = useState({});

  // Load episode and play
  const playEpisode = (episode, show) => {
    if (currentEpisode?.id === episode.id) {
      // Toggle play/pause for current episode
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // New episode
      setCurrentEpisode({
        ...episode,
        showTitle: show.title,
        showImage: show.image
      });
      setIsPlaying(true);
    }
  };

  // - Progress Tracking
  const updateListeningProgress = (episodeId, progress, duration) => {
    const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
    
    setListeningProgress(prev => ({
      ...prev,
      [episodeId]: {
        progress: progressPercent,
        lastPosition: progress,
        duration,
        lastUpdated: new Date().toISOString(),
        completed: progressPercent >= 95 // Mark as completed if 95% watched
      }
    }));

    // Save to localStorage
    const savedProgress = JSON.parse(localStorage.getItem('podcast-progress') || '{}');
    savedProgress[episodeId] = {
      progress: progressPercent,
      lastPosition: progress,
      duration,
      lastUpdated: new Date().toISOString(),
      completed: progressPercent >= 95
    };
    localStorage.setItem('podcast-progress', JSON.stringify(savedProgress));
  };

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('podcast-progress');
    if (savedProgress) {
      setListeningProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
      
      // Update listening progress when audio plays
      if (currentEpisode) {
        updateListeningProgress(currentEpisode.id, audio.currentTime, audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentEpisode]); //currentEpisode to dependencies

  // Auto-play when currentEpisode changes
  useEffect(() => {
    if (currentEpisode && audioRef.current) {
      // Resume from saved position if available
      const savedProgress = listeningProgress[currentEpisode.id];
      if (savedProgress && !savedProgress.completed) {
        audioRef.current.currentTime = savedProgress.lastPosition || 0;
      }
      
      audioRef.current.src = currentEpisode.audio; // Using placeholder audio
      audioRef.current.play().catch(console.error);
    }
  }, [currentEpisode]);

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  // Reset progress for an episode
  const resetProgress = (episodeId) => {
    const newProgress = { ...listeningProgress };
    delete newProgress[episodeId];
    setListeningProgress(newProgress);
    
    const savedProgress = JSON.parse(localStorage.getItem('podcast-progress') || '{}');
    delete savedProgress[episodeId];
    localStorage.setItem('podcast-progress', JSON.stringify(savedProgress));
  };

  const value = {
    currentEpisode,
    isPlaying,
    progress,
    duration,
    playEpisode,
    seek,
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    },
    resume: () => {
      if (audioRef.current && currentEpisode) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    },
   
    listeningProgress,
    updateListeningProgress,
    resetProgress
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};
