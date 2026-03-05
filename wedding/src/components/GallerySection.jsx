import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from '../styles/GallerySection.module.css';

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

  return (
    <div
      ref={ref}
      className={`reveal reveal-delay-${delay} ${isVisible ? 'visible' : ''} ${styles.item}`}
    >
      <img src={photo.src} alt={photo.alt} className={styles.img} />
    </div>
  );
}
