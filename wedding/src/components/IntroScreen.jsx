import { useEffect, useState, useCallback } from "react";
import styles from "../styles/IntroScreen.module.css";

export default function IntroScreen({ onDone }) {
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
    setTimeout(() => {
      document.body.style.overflow = "";
      onDone();
    }, 750);
  }, [exiting, onDone]);

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
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11V6a2 2 0 0 1 4 0v5" />
            <path d="M13 11V8a2 2 0 0 1 4 0v6a6 6 0 0 1-6 6H9a5 5 0 0 1-5-5v-2a2 2 0 0 1 4 0" />
            <path d="M9 11a2 2 0 0 1 4 0" />
          </svg>
          <span>Для просмотра коснитесь экрана</span>
        </div>
      </div>
    </div>
  );
}
