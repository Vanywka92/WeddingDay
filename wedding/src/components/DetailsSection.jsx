import { useScrollReveal } from "../hooks/useScrollReveal";
import FloatingPetals from "./FloatingPetals";
import TornEdge from "./TornEdge";
import styles from "../styles/DetailsSection.module.css";
import bokal from "../img/bokal.png";
import guest from "../img/guest.png";
import cake from "../img/cake.png";
import fireworks from "../img/fireworks.png";

const cards = [
  {
    icon: <img src={guest} alt="guest" className={styles.cardIcon} />,
    label: "16:30",
    title: "Сбор гостей",
  },
  {
    icon: <img src={bokal} alt="bokal" className={styles.cardIcon} />,
    label: "17:00",
    title: "Праздничный банкет",
  },
  {
    icon: <img src={cake} alt="cake" className={styles.cardIcon} />,
    label: "21:00",
    title: "Подача свадебного торта",
  },
  {
    icon: <img src={fireworks} alt="fireworks" className={styles.cardIcon} />,
    label: "23:00",
    title: "Финал вечера",
  },
];

export default function DetailsSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className={styles.section}>
      <div className={styles.bgImage} />
      <div className={styles.bgOverlay} />
      <TornEdge position="top" color="var(--ivory)" />
      <FloatingPetals />

      <div className={styles.container}>
        <div
          ref={ref}
          className={`reveal-blur ${isVisible ? "visible" : ""} ${styles.header}`}
        >
          <h1 className={styles.eyebrow}>Программа дня</h1>
        </div>

        <div className={styles.cards}>
          {cards.map((card, i) => (
            <DetailCard key={i} card={card} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailCard({ card, delay }) {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <div
      ref={ref}
      className={`reveal-scale reveal-delay-${delay} ${isVisible ? "visible" : ""} ${styles.card}`}
    >
      <div className={styles.cardIcon}>{card.icon}</div>
      <p className={styles.cardTitle}>{card.label}</p>
      <p className={styles.cardTitle}>{card.title}</p>
    </div>
  );
}
