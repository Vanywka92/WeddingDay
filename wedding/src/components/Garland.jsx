import styles from "../styles/Garland.module.css";
import garlandImg from "../img/garland.png";

// Координаты лампочек в процентах от размеров КОНТЕЙНЕРА (после кадрирования),
// а не от исходной картинки. Подобраны под обрезку aspect-ratio: 4/1 + top:-180%.
const BULBS = [
  { x: 8, y: 12 },
  { x: 18, y: 13 },
  { x: 30, y: 25 },
  { x: 42, y: 23 },
  { x: 53, y: 30 },
  { x: 64, y: 14 },
  { x: 74, y: 35 },
  { x: 82, y: 21 },
  { x: 88, y: 33 },
];

export default function Garland() {
  return (
    <div className={styles.garland} aria-hidden="true">
      <img src={garlandImg} alt="" className={styles.image} draggable="false" />
      <div className={styles.bulbs}>
        {BULBS.map((b, i) => (
          <span
            key={i}
            className={styles.bulb}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              animationDelay: `${((i * 0.41) % 2.6).toFixed(2)}s`,
              animationDuration: `${(1.8 + ((i * 0.19) % 1.5)).toFixed(2)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
