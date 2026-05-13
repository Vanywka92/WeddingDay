import { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import TornEdge from './TornEdge';
import styles from '../styles/CountdownSection.module.css';

const WEDDING = new Date('2026-08-15T17:00:00+03:00');

function pad(n) {
  return String(n).padStart(2, '0');
}

function getTimeLeft() {
  const diff = Math.max(0, WEDDING - Date.now());
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  };
}

function pluralLabel(n, forms) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

const LABELS = [
  ['день', 'дня', 'дней'],
  ['час', 'часа', 'часов'],
  ['минута', 'минуты', 'минут'],
  ['секунда', 'секунды', 'секунд'],
];

export default function CountdownSection() {
  const [time, setTime] = useState(getTimeLeft);
  const { ref: hRef, isVisible: hVis } = useScrollReveal(0.1);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: time.days,    labels: LABELS[0], delay: 1 },
    { value: time.hours,   labels: LABELS[1], delay: 2 },
    { value: time.minutes, labels: LABELS[2], delay: 3 },
    { value: time.seconds, labels: LABELS[3], delay: 4 },
  ];

  return (
    <section className={styles.section}>
      <TornEdge position="top" color="var(--white)" />
      <div
        ref={hRef}
        className={`reveal-blur ${hVis ? 'visible' : ''} ${styles.header}`}
      >
        <span className={styles.leaf}>✦</span>
        <h2>До торжества осталось</h2>
        <span className={styles.leaf}>✦</span>
      </div>

      <div className={styles.units}>
        {units.map((u, i) => (
          <CountUnit key={i} unit={u} visible={hVis} />
        ))}
      </div>
    </section>
  );
}

function CountUnit({ unit, visible }) {
  const { ref, isVisible } = useScrollReveal(0.12);
  const combined = visible || isVisible;

  return (
    <div
      ref={ref}
      className={`reveal-scale reveal-delay-${unit.delay} ${combined ? 'visible' : ''} ${styles.unit}`}
    >
      <div className={styles.valueWrap}>
        <span className={styles.value} key={unit.value}>
          {pad(unit.value)}
        </span>
      </div>
      <span className={styles.label}>
        {pluralLabel(unit.value, unit.labels)}
      </span>
    </div>
  );
}
