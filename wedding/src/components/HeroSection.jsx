import { useEffect, useState } from 'react';
import styles from '../styles/HeroSection.module.css';

const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (isTouch) return;
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className={styles.hero}>
      <div
        className={styles.bg}
        style={isTouch ? undefined : { transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <p className={`${styles.label} ${styles.fadeIn}`}>Приглашение на свадьбу</p>

        <div className={styles.names}>
          <span className={styles.name}>Иван</span>
          <span className={styles.ampersand}>&amp;</span>
          <span className={styles.name}>Юлия</span>
        </div>

        <div className={styles.dateLine}>
          <span className={styles.dateDecor}>—</span>
          <span className={styles.date}>15 августа 2026</span>
          <span className={styles.dateDecor}>—</span>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <div className={styles.scrollLine} />
        <span>прокрутите вниз</span>
      </div>
    </section>
  );
}
