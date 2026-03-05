import { CalendarOutlined, ClockCircleOutlined, SkinOutlined } from '@ant-design/icons';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from '../styles/DetailsSection.module.css';

const cards = [
  {
    icon: <CalendarOutlined />,
    label: 'Дата',
    title: '15 августа 2026',
    subtitle: 'Суббота',
  },
  {
    icon: <ClockCircleOutlined />,
    label: 'Время',
    title: 'Сбор в 17:00',
    subtitle: 'Церемония в 18:00',
  },
  {
    icon: <SkinOutlined />,
    label: 'Дресс-код',
    title: 'Нежные тона',
    subtitle: 'Белый, бежевый, розовый',
  },
];

export default function DetailsSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className={styles.section}>
      <div className={styles.bgImage} />
      <div className={styles.bgOverlay} />

      <div className={styles.container}>
        <div
          ref={ref}
          className={`reveal ${isVisible ? 'visible' : ''} ${styles.header}`}
        >
          <p className={styles.eyebrow}>Детали торжества</p>
          <h2 className={styles.heading}>Важная информация</h2>
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
      className={`reveal reveal-delay-${delay} ${isVisible ? 'visible' : ''} ${styles.card}`}
    >
      <div className={styles.cardIcon}>{card.icon}</div>
      <p className={styles.cardLabel}>{card.label}</p>
      <p className={styles.cardTitle}>{card.title}</p>
      <p className={styles.cardSubtitle}>{card.subtitle}</p>
    </div>
  );
}
