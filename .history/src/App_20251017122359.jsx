import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PodcastProvider } from "./context/PodcastContext";
import { AudioProvider } from "./context/AudioContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeContext";
import { fetchPodcasts } from "./api/fetchPodcasts";
import { genres } from "./data";
import Header from "./components/Header";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import HomePage from "./Pages/HomePage";
import ShowDetailPage from "./Pages/ShowDetailPage";
import FavoritesPage from "./Pages/FavoritesPage/FavoritesPage";
import styles from "./App.module.css";

export default function App() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPodcasts(setPodcasts, setError, setLoading);
  }, []);

  // Get recommended shows (first 10 for carousel)
  const recommendedShows = podcasts.slice(0, 10);

  return (
    <ThemeProvider>
      <AudioProvider>
        <FavoritesProvider>
          <Router>
            <div className={styles.app}>
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
                      <Route 
                        path="/" 
                        element={
                          <HomePage 
                            genres={genres} 
                            recommendedShows={recommendedShows}
                          />
                        } 
                      />
                      <Route 
                        path="/show/:id" 
                        element={<ShowDetailPage genres={genres} />} 
                      />
                      <Route 
                        path="/favorites" 
                        element={<FavoritesPage />} 
                      />
                    </Routes>
                  )}
                </main>
              </PodcastProvider>

              <AudioPlayer />
            </div>
          </Router>
        </FavoritesProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}