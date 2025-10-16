import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PodcastProvider } from "./context/PodcastContext";
import { fetchPodcasts } from "./api/fetchPodcasts";
import { genres } from "./data";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ShowDetailPage from "./pages/ShowDetailPage";
import styles from "./App.module.css";

/**
 * Root component of the Podcast Explorer app.
 * Handles data fetching and routing.
 */
export default function App() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPodcasts(setPodcasts, setError, setLoading);
  }, []);

  return (
    <Router>
      <Header />
      
      <PodcastProvider initialPodcasts={podcasts}>
        <main className={styles.main}>
          {loading && (
            <div className={styles.messageContainer}>
              <div className={styles.spinner}></div>
              <p>Loading podcasts...</p>
            </div>
          )}

          {error && (
            <div className={styles.message}>
              <div className={styles.error}>
                Error occurred while fetching podcasts: {error}
              </div>
            </div>
          )}

          {!loading && !error && (
            <Routes>
              <Route path="/" element={<HomePage genres={genres} />} />
              <Route path="/show/:id" element={<ShowDetailPage genres={genres} />} />
            </Routes>
          )}
        </main>
      </PodcastProvider>
    </Router>
  );
}
