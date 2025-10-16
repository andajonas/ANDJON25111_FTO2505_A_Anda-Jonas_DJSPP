import SearchBar from "../components/SearchBar";
import SortSelect from "../components/SortSelect";
import GenreFilter from "../components/GenreFilter";
import PodcastGrid from "../components/PodcastGrid";
import ShowCarousel from "../components/ShowCarousel/ShowCarousel";
import Pagination from "../components/Pagination";
import styles from "./HomePage.module.css";
import { useAudio } from '../context/AudioContext';

export default function HomePage({ genres, recommendedShows }) {
  const { playEpisode } = useAudio();

  const testAudio = () => {
    const testData = {
      episode: {
        id: 'test-1',
        title: 'Test Episode',
        audio: 'https://www.soundjay.com/button/button-1.mp3'
      },
      show: {
        id: 'test-show',
        title: 'Test Show',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiM0YTkwZTIiLz48L3N2Zz4='
      }
    };
    
    playEpisode(testData.episode, testData.show);
  };

  return (
    <>
      {/* Test Audio Button */}
      <button 
        onClick={testAudio}
        style={{
          position: 'fixed',
          top: '70px',
          right: '20px',
          background: '#4a90e2',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 9999,
          cursor: 'pointer'
        }}
      >
        Test Audio Player
      </button>

      {/* Recommended Shows Carousel */}
      {recommendedShows && recommendedShows.length > 0 && (
        <ShowCarousel shows={recommendedShows} genres={genres} />
      )}

      {/* Search and Filters */}
      <section className={styles.controls}>
        <SearchBar />
        <GenreFilter genres={genres} />
        <SortSelect />
      </section>

      {/* Podcast Grid */}
      <PodcastGrid genres={genres} />
      <Pagination />
    </>
  );
}