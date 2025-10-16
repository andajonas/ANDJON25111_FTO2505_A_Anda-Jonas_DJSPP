import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useAudio } from "../context/AudioContext";
import styles from "./SeasonNavigation.module.css";

/**
 * SeasonNavigation Component
 * 
 * Provides an accordion-style interface for browsing podcast seasons and episodes.
 * Users can expand/collapse seasons to view episode details with play and favorite functionality.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.seasons - Array of season objects with episodes
 * @param {Object} props.show - The show object containing show details
 * 
 * @returns {JSX.Element} The season navigation interface
 */
export default function SeasonNavigation({ seasons, show }) {
  const [expandedSeason, setExpandedSeason] = useState(null);
  const { isFavorited, toggleFavorite } = useFavorites();
  const { playEpisode } = useAudio();

  /**
   * Toggles the expanded state for a season
   * @param {number} seasonIndex - The index of the season to toggle
   */
  const toggleSeason = (seasonIndex) => {
    setExpandedSeason(expandedSeason === seasonIndex ? null : seasonIndex);
  };

  /**
   * Handles playing an episode
   * @param {Object} episode - The episode to play
   * @param {Object} season - The season containing the episode
   */
  const handlePlayEpisode = (episode, season) => {
    playEpisode(episode, show);
  };

  /**
   * Handles toggling favorite status for an episode
   * @param {Object} episode - The episode to favorite/unfavorite
   * @param {Object} season - The season containing the episode
   * @param {Event} e - The click event
   */
  const handleToggleFavorite = (episode, season, e) => {
    e.stopPropagation(); // Prevent expanding season
    toggleFavorite(episode, show, season);
  };

  /**
   * Shortens episode description to a maximum length
   * @param {string} description - The full episode description
   * @param {number} maxLength - Maximum length before truncation
   * @returns {string} Shortened description
   */
  const shortenDescription = (description, maxLength = 150) => {
    if (!description || description.length <= maxLength) {
      return description || "No description available.";
    }
    return description.substring(0, maxLength) + "...";
  };

  if (!seasons || seasons.length === 0) {
    return (
      <div className={styles.noSeasons}>
        <p>No seasons available for this show.</p>
      </div>
    );
  }

  return (
    <div className={styles.seasonNavigation}>
      <h2>Seasons ({seasons.length})</h2>
      
      {seasons.map((season, index) => (
        <div key={season.id} className={styles.season}>
          <button 
            className={styles.seasonHeader}
            onClick={() => toggleSeason(index)}
            aria-expanded={expandedSeason === index}
          >
            <div className={styles.seasonTitle}>
              <h3>Season {season.title || index + 1}</h3>
              <span className={styles.episodeCount}>
                {season.episodes ? season.episodes.length : 0} episodes
              </span>
            </div>
            <span className={styles.expandIcon}>
              {expandedSeason === index ? "−" : "+"}
            </span>
          </button>

          {expandedSeason === index && (
            <div className={styles.episodes}>
              {season.episodes && season.episodes.map((episode, epIndex) => (
                <div key={episode.id} className={styles.episode}>
                  <div className={styles.episodeImage}>
                    <img 
                      src={episode.image || season.image} 
                      alt={episode.title}
                      onClick={() => handlePlayEpisode(episode, season)}
                    />
                  </div>
                  
                  <div className={styles.episodeInfo}>
                    <h4 onClick={() => handlePlayEpisode(episode, season)}>
                      Episode {epIndex + 1}: {episode.title}
                    </h4>
                    <p className={styles.episodeDescription}>
                      {shortenDescription(episode.description)}
                    </p>
                    
                    <div className={styles.episodeActions}>
                      <button 
                        className={styles.playButton}
                        onClick={() => handlePlayEpisode(episode, season)}
                      >
                        ▶ Play
                      </button>
                      
                      <button 
                        className={`${styles.favoriteButton} ${
                          isFavorited(episode.id, season.id, show.id) ? styles.favorited : ''
                        }`}
                        onClick={(e) => handleToggleFavorite(episode, season, e)}
                        title={isFavorited(episode.id, season.id, show.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {isFavorited(episode.id, season.id, show.id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}