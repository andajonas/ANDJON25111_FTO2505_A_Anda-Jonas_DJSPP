import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import SeasonNavigation from "../components/SeasonNavigation";
import styles from "./ShowDetailPage.module.css";

/**
 * ShowDetailPage Component
 * 
 * Displays comprehensive details for a specific podcast show including
 * title, description, image, genres, and season navigation.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {{id: number, name: string}[]} props.genres - Array of genre definitions
 * 
 * @returns {JSX.Element} The show detail page
 */
export default function ShowDetailPage({ genres }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false); // 🆕 ADD THIS LINE

  useEffect(() => {
    /**
     * Fetches detailed show data from the API
     */
    const fetchShowData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        
        if (!res.ok) {
          throw new Error(`Show not found (Status: ${res.status})`);
        }
        
        const data = await res.json();
        setShow(data);
      } catch (err) {
        console.error("Failed to fetch show details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShowData();
  }, [id]);

  // 🆕 ADD THIS FUNCTION
  const handleImageError = () => {
    setImageError(true);
  };

  // 🆕 ADD THIS - Fallback image URL
  const showImageUrl = imageError 
    ? `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#4a90e2"/>
          <text x="50%" y="50%" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dy=".3em">${show?.title || 'Podcast'}</text>
        </svg>
      `)}`
    : show?.image;

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.messageContainer}>
        <div className={styles.spinner}></div>
        <p>Loading show details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.messageContainer}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={handleBackClick} className={styles.backButton}>
            ← Back to Shows
          </button>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className={styles.messageContainer}>
        <div className={styles.error}>
          <p>Show not found.</p>
          <button onClick={handleBackClick} className={styles.backButton}>
            ← Back to Shows
          </button>
        </div>
      </div>
    );
  }

  // Safely handle genres 
  const genreSpans = (show.genres || []).map((genreId) => {
    const match = genres.find((genre) => genre.id === genreId);
    return (
      <span key={genreId} className={styles.tag}>
        {match ? match.title : `Unknown (${genreId})`}
      </span>
    );
  });

  return (
    <div className={styles.showDetail}>
      <button onClick={handleBackClick} className={styles.backButton}>
        ← Back to Shows
      </button>

      <div className={styles.showHeader}>
        {/* 🆕 UPDATE THIS IMAGE TAG */}
        <img 
          src={showImageUrl} 
          alt={show.title} 
          className={styles.showImage}
          onError={handleImageError} // 🆕 ADD THIS
        />
        
        <div className={styles.showInfo}>
          <h1>{show.title}</h1>
          <div className={styles.tags}>
            {genreSpans.length > 0 ? genreSpans : <span>No genres listed</span>}
          </div>
          <p className={styles.updated}>
            Updated {formatDate(show.updated)}
          </p>
          <p className={styles.description}>{show.description}</p>
        </div>
      </div>

      <SeasonNavigation seasons={show.seasons} show={show} />
    </div>
  );
}
}