import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle/ThemeToggle';
import styles from './Header.module.css';

export default function Header() {
  const { favoritesCount } = useFavorites();
  const { theme } = useTheme();

  return (
    <header className={styles.appHeader}>
      <Link to="/" className={styles.logo}>
        <h1>🎙️ Podcast App</h1>
      </Link>
      
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>Home</Link>
        <Link to="/favorites" className={styles.navLink}>
          Favorites
          {favoritesCount > 0 && (
            <span className={styles.favoritesBadge}>{favoritesCount}</span>
          )}
        </Link>
        {/* THEME TOGGLE */}
        <ThemeToggle />
      </nav>
    </header>
  );
}