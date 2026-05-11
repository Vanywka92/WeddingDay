import styles from "../styles/FloatingPetals.module.css";

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

export default function FloatingPetals() {
  return (
    <div className={styles.layer} aria-hidden="true">
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
    </div>
  );
}
