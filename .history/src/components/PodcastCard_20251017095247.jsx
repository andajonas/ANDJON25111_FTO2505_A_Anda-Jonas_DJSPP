import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import styles from './PodcastCard.module.css';

export default function PodcastCard({ podcast, genres }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const genreSpans = podcast.genres.map((id) => {
    const match = genres.find((genre) => genre.id === id);
    return (
      <span key={id} className={styles.tag}>
        {match ? match.title : `Unknown (${id})`}
      </span>
    );
  });

  const handleClick = () => {
    navigate(`/show/${podcast.id}`);
  };

  // Fallback placeholder image
  const imageUrl = imageError 
    ? `data:image/svg+xml;base64,${btoa(`
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#4a90e2"/>
          <text x="50%" y="50%" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dy=".3em">${podcast.title}</text>
        </svg>
      `)}`
    : podcast.image;

  return (
    <div className={styles.card} onClick={handleClick}>
      <img 
        src={imageUrl} 
        alt={podcast.title}
        className={styles.image}
        onError={handleImageError}
        loading="lazy"
      />
      <h3>{podcast.title}</h3>
      <p className={styles.seasons}>{podcast.seasons} seasons</p>
      <div className={styles.tags}>{genreSpans}</div>
      <p className={styles.updatedText}>
        Updated {formatDate(podcast.updated)}
      </p>
    </div>
  );
}
