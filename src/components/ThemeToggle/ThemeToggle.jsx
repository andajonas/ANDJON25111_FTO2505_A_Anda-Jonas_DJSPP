import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className={styles.toggleTrack}>
        <span className={`${styles.toggleThumb} ${theme === 'dark' ? styles.dark : ''}`}>
          {theme === 'light' ? '☀️' : '🌙'}
        </span>
      </span>
    </button>
  );
}