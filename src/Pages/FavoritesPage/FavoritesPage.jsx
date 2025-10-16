import { useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { useAudio } from '../../context/AudioContext';
import { formatDate } from '../../utils/formatDate';
import styles from './FavoritesPage.module.css';

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'title-asc', label: 'Title A-Z' },
  { key: 'title-desc', label: 'Title Z-A' }
];

export default function FavoritesPage() {
  const { favoritesByShow, removeFavorite } = useFavorites();
  const { playEpisode } = useAudio();
  const [sortBy, setSortBy] = useState('newest');

  const getSortedFavorites = (favorites) => {
    return [...favorites].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedAt) - new Date(a.addedAt);
        case 'oldest':
          return new Date(a.addedAt) - new Date(b.addedAt);
        case 'title-asc':
          return a.episode.title.localeCompare(b.episode.title);
        case 'title-desc':
          return b.episode.title.localeCompare(a.episode.title);
        default:
          return 0;
      }
    });
  };

  if (Object.keys(favoritesByShow).length === 0) {
    return (
      <div className={styles.favoritesPage}>
        <div className={styles.header}>
          <h1>My Favorites</h1>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyHeart}>🤍</div>
          <h2>No favorites yet</h2>
          <p>Start adding episodes to your favorites while browsing shows!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.header}>
        <h1>My Favorites</h1>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.sortSelect}
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.favoritesList}>
        {Object.entries(favoritesByShow).map(([showTitle, favorites]) => (
          <div key={showTitle} className={styles.showGroup}>
            <h2 className={styles.showTitle}>{showTitle}</h2>
            <div className={styles.episodesGrid}>
              {getSortedFavorites(favorites).map(favorite => (
                <div key={favorite.id} className={styles.favoriteCard}>
                  <img 
                    src={favorite.episode.image || favorite.show.image} 
                    alt={favorite.episode.title}
                    className={styles.episodeImage}
                    onClick={() => playEpisode(favorite.episode, favorite.show)}
                  />
                  
                  <div className={styles.episodeInfo}>
                    <h3 onClick={() => playEpisode(favorite.episode, favorite.show)}>
                      {favorite.episode.title}
                    </h3>
                    <p className={styles.seasonInfo}>
                      Season {favorite.season.title || '1'}, Episode {favorite.episode.episode || 'Unknown'}
                    </p>
                    <p className={styles.addedDate}>
                      Added {formatDate(favorite.addedAt)}
                    </p>
                    
                    <div className={styles.actions}>
                      <button 
                        className={styles.playButton}
                        onClick={() => playEpisode(favorite.episode, favorite.show)}
                      >
                        ▶ Play
                      </button>
                      <button 
                        className={styles.removeButton}
                        onClick={() => removeFavorite(favorite.id)}
                        title="Remove from favorites"
                      >
                        ❌ Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}