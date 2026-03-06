import { useRef, useCallback } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from '../styles/GallerySection.module.css';

const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&q=85',
    alt: 'Обручальные кольца',
  },
  {
    src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=700&q=85',
    alt: 'Свадебный торт',
  },
  {
    src: 'https://images.unsplash.com/photo-1501901609772-df0848060b33?w=700&q=85',
    alt: 'Цветочное украшение',
  },
  {
    src: 'https://images.unsplash.com/photo-1525772764200-be829a350797?w=700&q=85',
    alt: 'Букет невесты',
  },
];

export default function GallerySection() {
  const { ref, isVisible } = useScrollReveal(0.08);

  return (
    <section className={styles.section}>
      <div
        ref={ref}
        className={`reveal ${isVisible ? 'visible' : ''} ${styles.header}`}
      >
        <p className={styles.eyebrow}>Наш день</p>
        <h2 className={styles.heading}>Атмосфера торжества</h2>
      </div>

      <div className={styles.grid}>
        {photos.map((photo, i) => (
          <GalleryItem key={i} photo={photo} delay={i + 1} />
        ))}
      </div>
    </section>
  );
}

function GalleryItem({ photo, delay }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  const innerRef = useRef(null);

  const onMove = useCallback((e) => {
    if (isTouch || !innerRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    innerRef.current.style.transition = 'transform 0.1s ease';
    innerRef.current.style.transform =
      `perspective(700px) rotateY(${x * 11}deg) rotateX(${-y * 11}deg) scale3d(1.03,1.03,1.03)`;
  }, []);

  const onLeave = useCallback(() => {
    if (!innerRef.current) return;
    innerRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    innerRef.current.style.transform = '';
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-scale reveal-delay-${delay} ${isVisible ? 'visible' : ''} ${styles.item}`}
    >
      <div
        ref={innerRef}
        className={styles.tilt}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <img src={photo.src} alt={photo.alt} className={styles.img} />
        <div className={styles.overlay}>
          <span className={styles.caption}>{photo.alt}</span>
        </div>
      </div>
    </div>
  );
}
