import { useEffect, useState } from "react";
import styles from "../styles/HeroSection.module.css";

const isTouch = window.matchMedia(
  "(hover: none) and (pointer: coarse)",
).matches;

const PETALS = [
  { size: 11, left: "7%", dur: 12, delay: 0 },
  { size: 9, left: "20%", dur: 15, delay: -4 },
  { size: 14, left: "38%", dur: 11, delay: -8 },
  { size: 6, left: "53%", dur: 14, delay: -2 },
  { size: 16, left: "67%", dur: 13, delay: -6 },
  { size: 12, left: "82%", dur: 16, delay: -10 },
  { size: 7, left: "28%", dur: 10, delay: -13 },
  { size: 10, left: "74%", dur: 12, delay: -3 },
];

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (isTouch) return;
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className={styles.hero}>
      <div
        className={styles.bg}
        style={
          isTouch ? undefined : { transform: `translateY(${scrollY * 0.3}px)` }
        }
      />
      <div className={styles.overlay} />

      {PETALS.map((p, i) => (
        <div
          key={i}
          className={styles.petal}
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className={styles.content}>
        <div className={styles.names}>
          <span className={styles.name}>
            {"Иван".split("").map((ch, i) => (
              <span
                key={i}
                className={styles.letter}
                style={{ animationDelay: `${0.35 + i * 0.08}s` }}
              >
                {ch}
              </span>
            ))}
          </span>
          <span
            className={`${styles.ampersand} ${styles.letter}`}
            style={{ animationDelay: "0.68s" }}
          >
            &amp;
          </span>
          <span className={styles.name}>
            {"Юлия".split("").map((ch, i) => (
              <span
                key={i}
                className={styles.letter}
                style={{ animationDelay: `${0.78 + i * 0.08}s` }}
              >
                {ch}
              </span>
            ))}
          </span>
        </div>

        <div className={styles.dateLine}>
          <span className={styles.dateDecor}>—</span>
          <span className={styles.date}>5 сентября 2026</span>
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
