import { useRef, useCallback } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import FloatingPetals from "./FloatingPetals";
import styles from "../styles/GallerySection.module.css";
import photo1 from "../img/1.JPG";
import photo2 from "../img/2.JPG";
import photo7 from "../img/7.JPG";
import photo4 from "../img/4.JPG";
import photo5 from "../img/5.JPG";
import photo6 from "../img/6.JPG";

const isTouch = window.matchMedia(
  "(hover: none) and (pointer: coarse)",
).matches;

const photos = [
  {
    src: photo2,
  },
  {
    src: photo4,
  },
  {
    src: photo5,
  },
  {
    src: photo1,
  },
  {
    src: photo7,
  },
  {
    src: photo6,
  },
];

export default function GallerySection() {
  const { ref, isVisible } = useScrollReveal(0.08);

  return (
    <section className={styles.section}>
      <FloatingPetals />
      <div
        ref={ref}
        className={`reveal ${isVisible ? "visible" : ""} ${styles.header}`}
      >
        <p className={styles.eyebrow}>Наш день</p>
        {/* <h2 className={styles.heading}>Атмосфера торжества</h2> */}
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
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    innerRef.current.style.transition = "transform 0.1s ease";
    innerRef.current.style.transform = `perspective(700px) rotateY(${x * 11}deg) rotateX(${-y * 11}deg) scale3d(1.03,1.03,1.03)`;
  }, []);

  const onLeave = useCallback(() => {
    if (!innerRef.current) return;
    innerRef.current.style.transition =
      "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    innerRef.current.style.transform = "";
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-scale reveal-delay-${delay} ${isVisible ? "visible" : ""} ${styles.item}`}
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
