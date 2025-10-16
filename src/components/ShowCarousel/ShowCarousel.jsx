import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ShowCarousel.module.css';

export default function ShowCarousel({ shows, genres }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleShowClick = (showId) => {
    navigate(`/show/${showId}`);
  };

  if (!shows || shows.length === 0) {
    return null;
  }

  return (
    <section className={styles.carouselSection}>
      <div className={styles.carouselHeader}>
        <h2>Recommended Shows</h2>
        <div className={styles.carouselControls}>
          <button onClick={() => scroll('left')} className={styles.navButton}>
            ‹
          </button>
          <button onClick={() => scroll('right')} className={styles.navButton}>
            ›
          </button>
        </div>
      </div>

      <div className={styles.carouselContainer} ref={scrollRef}>
        <div className={styles.carousel}>
          {shows.map(show => (
            <div 
              key={show.id} 
              className={styles.carouselItem}
              onClick={() => handleShowClick(show.id)}
            >
              <img 
                src={show.image} 
                alt={show.title}
                className={styles.carouselImage}
              />
              <div className={styles.carouselContent}>
                <h3 className={styles.carouselTitle}>{show.title}</h3>
                <div className={styles.carouselTags}>
                  {show.genres.slice(0, 2).map(genreId => {
                    const genre = genres.find(g => g.id === genreId);
                    return genre ? (
                      <span key={genreId} className={styles.carouselTag}>
                        {genre.title}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}