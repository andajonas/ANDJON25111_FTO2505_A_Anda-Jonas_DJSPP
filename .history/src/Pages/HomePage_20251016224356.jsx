import SearchBar from "../components/SearchBar";
import SortSelect from "../components/SortSelect";
import GenreFilter from "../components/GenreFilter";
import PodcastGrid from "../components/PodcastGrid";
import ShowCarousel from "../components/ShowCarousel/ShowCarousel";
import Pagination from "../components/Pagination";
import styles from "./HomePage.module.css";


export default function HomePage({ genres, recommendedShows }) {
  return (
    <>
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
