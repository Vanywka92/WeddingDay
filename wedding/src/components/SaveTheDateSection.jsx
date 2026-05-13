import { useMemo } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import FloatingPetals from "./FloatingPetals";
import styles from "../styles/SaveTheDateSection.module.css";

const WEDDING_DAY = 15;
const WEDDING_MONTH = 8; // August
const WEDDING_YEAR = 2026;

const MONTH_NAME = "Август";
const WEEKDAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

function buildCalendar(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const offset = firstDay === 0 ? 6 : firstDay - 1; // shift to Mon-start
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function SaveTheDateSection() {
  const { ref: r1, isVisible: v1 } = useScrollReveal();
  const { ref: r2, isVisible: v2 } = useScrollReveal();
  const { ref: r3, isVisible: v3 } = useScrollReveal();
  const { ref: r4, isVisible: v4 } = useScrollReveal();
  const { ref: r5, isVisible: v5 } = useScrollReveal();

  const cells = useMemo(() => buildCalendar(WEDDING_YEAR, WEDDING_MONTH), []);

  return (
    <section className={styles.section}>
      <FloatingPetals />

      <div className={styles.container}>
        {/* Eyebrow */}
        <div
          ref={r1}
          className={`reveal-scale ${v1 ? "visible" : ""} ${styles.eyebrow}`}
        >
          <span className={styles.leaf}>✦</span>
          <h3>Дорогие близкие и друзья!</h3>
          <span className={styles.leaf}>✦</span>
        </div>

        {/* Heading */}
        <h2
          ref={r2}
          className={`reveal reveal-delay-2 line-draw ${v2 ? "visible" : ""} ${styles.heading}`}
        >
          Save the date
        </h2>

        {/* Body text */}
        <p
          ref={r3}
          className={`reveal-blur reveal-delay-3 ${v3 ? "visible" : ""} ${styles.text}`}
        >
          Это официальное приглашение на нашу свадьбу! А получили вы его потому,
          что мы очень хотим видеть вас в этот день рядом с нами.
        </p>

        <div className="ornament">
          <span style={{ fontSize: 18, color: "var(--gold)" }}>❧</span>
        </div>

        {/* Big date digits */}
        <div
          ref={r4}
          className={`reveal ${v4 ? "visible" : ""} ${styles.bigDate}`}
        >
          <span
            className={`reveal-left reveal-delay-1 ${v4 ? "visible" : ""} ${styles.bigNum}`}
          >
            {String(WEDDING_DAY).padStart(2, "0")}
          </span>
          <span className={styles.bigDot}>·</span>
          <span className={`reveal ${v4 ? "visible" : ""} ${styles.bigNum}`}>
            {String(WEDDING_MONTH).padStart(2, "0")}
          </span>
          <span className={styles.bigDot}>·</span>
          <span
            className={`reveal-right reveal-delay-1 ${v4 ? "visible" : ""} ${styles.bigNum}`}
          >
            {String(WEDDING_YEAR).slice(2)}
          </span>
        </div>

        {/* Calendar */}
        <div
          ref={r5}
          className={`reveal reveal-delay-4 ${v5 ? "visible" : ""} ${styles.calendarCard}`}
        >
          <div className={styles.monthLabel}>
            {MONTH_NAME} {WEDDING_YEAR}
          </div>

          <div className={styles.grid}>
            {WEEKDAYS.map((d) => (
              <span
                key={d}
                className={`${styles.cell} ${styles.weekdayHeader} ${d === "сб" || d === "вс" ? styles.weekend : ""}`}
              >
                {d}
              </span>
            ))}
            {cells.map((day, i) => {
              const isWedding = day === WEDDING_DAY;
              const col = (i % 7) + 1;
              const isWeekend = col === 6 || col === 7;
              return (
                <span
                  key={i}
                  className={`${styles.cell} ${isWedding ? styles.weddingDay : ""} ${isWeekend && day ? styles.weekend : ""}`}
                >
                  {day ?? ""}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
