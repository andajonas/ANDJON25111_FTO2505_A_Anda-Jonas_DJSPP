import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ShowCarousel.module.css';

export default function ShowCarousel({ shows, genres }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to enable/disable buttons
  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  // Initialize scroll buttons and add resize listener
  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [shows]);

  // Update scroll buttons when scrolling
  useEffect(() => {
    const carousel = scrollRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', updateScrollButtons);
      return () => carousel.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      if (direction === 'left') {
        // If at start or near start, scroll to end (loop)
        if (scrollLeft <= 10) {
          scrollRef.current.scrollTo({
            left: scrollWidth - clientWidth,
            behavior: 'smooth'
          });
        } else {
          scrollRef.current.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
          });
        }
      } else {
        // If at end or near end, scroll to start (loop)
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          scrollRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  // Auto-scroll for infinite loop (optional)
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      scroll('right');
    }, 5000); // Scroll every 5 seconds

    return () => clearInterval(interval);
  }, [autoScroll, shows]);

  const handleShowClick = (showId) => {
    navigate(`/show/${showId}`);
  };

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setAutoScroll(false);
  const handleMouseLeave = () => setAutoScroll(true);

  if (!shows || shows.length === 0) {
    return null;
  }

  return (
    <section 
      className={styles.carouselSection}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.carouselHeader}>
        <h2>Recommended Shows</h2>
        <div className={styles.carouselControls}>
          <button 
            onClick={() => scroll('left')} 
            className={styles.navButton}
            disabled={!canScrollLeft && shows.length > 0}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button 
            onClick={() => scroll('right')} 
            className={styles.navButton}
            disabled={!canScrollRight && shows.length > 0}
            aria-label="Scroll right"
          >
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
                  {show.genres.length > 2 && (
                    <span className={styles.moreTag}>+{show.genres.length - 2} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicators */}
      <div className={styles.scrollIndicators}>
        {shows.length > 0 && (
          <>
            <span className={styles.indicatorText}>
              Scroll horizontally or use arrows to browse
            </span>
            <div className={styles.dots}>
              {[1, 2, 3].map((dot) => (
                <span key={dot} className={styles.dot}>•</span>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}