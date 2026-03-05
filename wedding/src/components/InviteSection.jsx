import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from '../styles/InviteSection.module.css';

export default function InviteSection() {
  const { ref: r1, isVisible: v1 } = useScrollReveal();
  const { ref: r2, isVisible: v2 } = useScrollReveal();
  const { ref: r3, isVisible: v3 } = useScrollReveal();

  return (
    <section className={styles.section}>
      <div className={styles.floral} />

      <div className={styles.container}>
        <div
          ref={r1}
          className={`reveal ${v1 ? 'visible' : ''} ${styles.eyebrow}`}
        >
          <span className={styles.leaf}>✦</span>
          <span>Дорогие друзья</span>
          <span className={styles.leaf}>✦</span>
        </div>

        <h2
          ref={r2}
          className={`reveal reveal-delay-2 ${v2 ? 'visible' : ''} ${styles.heading}`}
        >
          Мы рады пригласить вас разделить с нами этот особенный день
        </h2>

        <div className='ornament'>
          <span style={{ fontSize: 18, color: 'var(--gold)' }}>❧</span>
        </div>

        <p
          ref={r3}
          className={`reveal reveal-delay-3 ${v3 ? 'visible' : ''} ${styles.text}`}
        >
          В этот прекрасный день мы соединим наши сердца и жизни в присутствии
          самых близких и дорогих нам людей. Ваше присутствие сделает наш
          праздник по-настоящему незабываемым и наполнит его теплом и радостью.
        </p>
      </div>
    </section>
  );
}
