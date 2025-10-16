import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

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

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
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
  }, []);

  // Auto-play when currentEpisode changes
  useEffect(() => {
    if (currentEpisode && audioRef.current) {
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
    }
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