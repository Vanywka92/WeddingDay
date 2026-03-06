import { useEffect, useState } from "react";
import styles from "../styles/IntroScreen.module.css";

export default function IntroScreen({ onDone }) {
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t0 = setTimeout(() => setPhase("in"), 80);
    const t1 = setTimeout(() => setPhase("out"), 2800);
    const t2 = setTimeout(() => {
      document.body.style.overflow = "";
      onDone();
    }, 4100);
    return () => {
      [t0, t1, t2].forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  return (
    <div className={`${styles.screen} ${phase === "out" ? styles.exit : ""}`}>
      <div
        className={`${styles.content} ${phase === "in" || phase === "out" ? styles.contentIn : ""}`}
      >
        <div className={styles.names}>
          <span className={styles.initial}>И</span>
          <span className={styles.amp}>&amp;</span>
          <span className={styles.initial}>Ю</span>
        </div>

        <div className={styles.divider} />

        <p className={styles.date}>15 августа 2026</p>
      </div>
    </div>
  );
}
