import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('podcast-favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('podcast-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (episode, show, season) => {
    const favorite = {
      id: `${show.id}-${season.id}-${episode.id}`,
      episode,
      show,
      season,
      addedAt: new Date().toISOString()
    };

    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === favorite.id);
      if (exists) return prev; // Already favorited
      return [...prev, favorite];
    });
  };

  const removeFavorite = (favoriteId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
  };

  const isFavorited = (episodeId, seasonId, showId) => {
    return favorites.some(fav => 
      fav.episode.id === episodeId && 
      fav.season.id === seasonId && 
      fav.show.id === showId
    );
  };

  const toggleFavorite = (episode, show, season) => {
    const favoriteId = `${show.id}-${season.id}-${episode.id}`;
    
    if (isFavorited(episode.id, season.id, show.id)) {
      removeFavorite(favoriteId);
    } else {
      addFavorite(episode, show, season);
    }
  };

  // Group favorites by show
  const favoritesByShow = favorites.reduce((groups, favorite) => {
    const showTitle = favorite.show.title;
    if (!groups[showTitle]) {
      groups[showTitle] = [];
    }
    groups[showTitle].push(favorite);
    return groups;
  }, {});

  const value = {
    favorites,
    favoritesByShow,
    addFavorite,
    removeFavorite,
    isFavorited,
    toggleFavorite,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};