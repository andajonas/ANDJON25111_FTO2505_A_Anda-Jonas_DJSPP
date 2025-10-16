import { useState } from "react";
import styles from "./SeasonNavigation.module.css";

/**
 * SeasonNavigation Component
 * 
 * Provides an accordion-style interface for browsing podcast seasons and episodes.
 * Users can expand/collapse seasons to view episode details.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.seasons - Array of season objects with episodes
 * 
 * @returns {JSX.Element} The season navigation interface
 */
export default function SeasonNavigation({ seasons }) {
  const [expandedSeason, setExpandedSeason] = useState(null);

  /**
   * Toggles the expanded state for a season
   * @param {number} seasonIndex - The index of the season to toggle
   */
  const toggleSeason = (seasonIndex) => {
    setExpandedSeason(expandedSeason === seasonIndex ? null : seasonIndex);
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
                    />
                  </div>
                  
                  <div className={styles.episodeInfo}>
                    <h4>
                      Episode {epIndex + 1}: {episode.title}
                    </h4>
                    <p className={styles.episodeDescription}>
                      {shortenDescription(episode.description)}
                    </p>
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