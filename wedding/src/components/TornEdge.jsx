import styles from "../styles/TornEdge.module.css";

const PATH =
  "M0,0 L1200,0 L1200,100 " +
  "Q1100,30 900,45 T600,35 T300,50 T0,38 Z";

export default function TornEdge({ color = "var(--forest)", position = "top" }) {
  return (
    <svg
      className={`${styles.torn} ${styles[position]}`}
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path fill={color} d={PATH} />
    </svg>
  );
}
