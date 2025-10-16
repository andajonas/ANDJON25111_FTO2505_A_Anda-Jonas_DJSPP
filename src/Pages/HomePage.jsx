import SearchBar from "../components/SearchBar";
import SortSelect from "../components/SortSelect";
import GenreFilter from "../components/GenreFilter";
import PodcastGrid from "../components/PodcastGrid";
import Pagination from "../components/Pagination";
import styles from "./HomePage.module.css";

/**
 * HomePage Component
 * 
 * Renders the main podcast browsing interface with search, filters,
 * and paginated podcast grid.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {{id: number, name: string}[]} props.genres - Array of genre definitions
 * 
 * @returns {JSX.Element} The home page layout
 */
export default function HomePage({ genres }) {
  return (
    <>
      <section className={styles.controls}>
        <SearchBar />
        <GenreFilter genres={genres} />
        <SortSelect />
      </section>

      <PodcastGrid genres={genres} />
      <Pagination />
    </>
  );
}