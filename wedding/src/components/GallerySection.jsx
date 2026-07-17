import { useRef, useCallback } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import FloatingPetals from "./FloatingPetals";
import TornEdge from "./TornEdge";
import styles from "../styles/GallerySection.module.css";
import dress from "../img/dress.png";

const palette = [
  { name: "", hex: "rgb(41 70 45 / 99%)" },
  { name: "", hex: "rgb(121 167 113)" },
  { name: "", hex: "rgb(126 154 203)" },
  { name: "", hex: "#c8a96e" },
  { name: "", hex: "#ecdfc8" },
  { name: "", hex: "rgb(66 48 23)" },
  { name: "", hex: "rgb(194 172 191)" },
  { name: "", hex: "rgb(2 2 2)" },
];

export default function GallerySection() {
  const { ref, isVisible } = useScrollReveal(0.08);

  return (
    <section className={styles.section}>
      <TornEdge position="top" color="var(--forest)" />
      <FloatingPetals />
      {/* <img src={dress} alt="Dress" className={styles.dress} /> */}
      <div
        ref={ref}
        className={`reveal ${isVisible ? "visible" : ""} ${styles.header}`}
      >
        <h2 className={styles.eyebrow}>Дресс-код</h2>
        <p className={styles.heading}>
          Мы очень ждем и с удовольствием готовимся к нашему незабываемому дню!
          Поддержите нас вашими улыбками и объятиями, а также красивыми нарядами
          в палитре торжества!
        </p>
      </div>

      <ul className={styles.palette}>
        {palette.map((color, i) => (
          <PaletteSwatch key={color.hex} color={color} delay={(i % 6) + 1} />
        ))}
      </ul>

      <div className={styles.headerWish}>
        <h2 className={styles.eyebrow}>Пожелание</h2>
        <p className={styles.heading}>
          После свадьбы мы уезжаем, поэтому просим не дарить нам цветы, ведь мы
          просто не успеем насладиться их красотой до отъезда!
        </p>
      </div>
    </section>
  );
}

function PaletteSwatch({ color, delay }) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <li
      ref={ref}
      className={`reveal-scale reveal-delay-${delay} ${isVisible ? "visible" : ""} ${styles.swatch}`}
    >
      <span
        className={styles.circle}
        style={{ backgroundColor: color.hex }}
        role="img"
        aria-label={color.name}
      />
      <span className={styles.swatchName}>{color.name}</span>
    </li>
  );
}
