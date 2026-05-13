import { useEffect, useState, useCallback } from "react";
import styles from "../styles/IntroScreen.module.css";

export default function IntroScreen({ onStart, onDone }) {
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setReady(true), 100);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  const handleTap = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    onStart?.();
    setTimeout(() => {
      document.body.style.overflow = "";
      onDone();
    }, 1100);
  }, [exiting, onStart, onDone]);

  return (
    <div
      className={`${styles.screen} ${exiting ? styles.exit : ""}`}
      onClick={handleTap}
    >
      <div className={styles.bg} />
      <div className={styles.overlay} />

      <div className={`${styles.content} ${ready ? styles.contentIn : ""}`}>
        <p className={styles.received}>ВЫ ПОЛУЧИЛИ</p>
        <p className={styles.invite}>Приглашение</p>

        <div className={styles.tap}>
          <svg
            className={styles.tapIcon}
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 18V5.5a2.5 2.5 0 0 1 5 0V14" />
            <path d="M16 11a2 2 0 0 1 4 0v4" />
            <path d="M20 12a2 2 0 0 1 4 0v4" />
            <path d="M24 13.5a2 2 0 0 1 4 0V21a8 8 0 0 1-8 8h-3.2a6 6 0 0 1-4.6-2.15L4.6 19.3a2 2 0 0 1 3-2.6L11 20" />
          </svg>
          <span>Для просмотра коснитесь экрана</span>
        </div>
      </div>
    </div>
  );
}
