import { useState, useRef, useCallback } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import RSVPModal from './RSVPModal';
import styles from '../styles/RSVPSection.module.css';

const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

export default function RSVPSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const { ref: r1, isVisible: v1 } = useScrollReveal();
  const { ref: r2, isVisible: v2 } = useScrollReveal();
  const magnetRef = useRef(null);

  const onMagnetMove = useCallback((e) => {
    if (isTouch || !magnetRef.current) return;
    const rect = magnetRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.32;
    const dy = (e.clientY - cy) * 0.32;
    magnetRef.current.style.transition = 'transform 0.15s ease';
    magnetRef.current.style.transform  = `translate(${dx}px, ${dy}px)`;
  }, []);

  const onMagnetLeave = useCallback(() => {
    if (!magnetRef.current) return;
    magnetRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    magnetRef.current.style.transform  = '';
  }, []);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.overlay} />

        <div className={styles.content}>
          <div
            ref={r1}
            className={`reveal ${v1 ? 'visible' : ''} ${styles.header}`}
          >
            <p className={styles.eyebrow}>
              <span className={styles.heart}>♡</span>
              Подтверждение участия
              <span className={styles.heart}>♡</span>
            </p>
            <h2 className={styles.heading}>
              Ваше присутствие — лучший подарок
            </h2>
            <p className={styles.subtext}>
              Пожалуйста, подтвердите своё участие до <strong>1 июля 2026</strong>
            </p>
          </div>

          <div
            ref={r2}
            className={`reveal reveal-delay-2 ${v2 ? 'visible' : ''}`}
            onMouseMove={onMagnetMove}
            onMouseLeave={onMagnetLeave}
          >
            <div ref={magnetRef} style={{ display: 'inline-block' }}>
              <button
                className={styles.rsvpBtn}
                onClick={() => setModalOpen(true)}
              >
                <span className={styles.rsvpBtnText}>Я приду</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.footerNames}>Иван &amp; Юлия</p>
        <p className={styles.footerDate}>15 августа 2026</p>
        <p className={styles.footerNote}>С любовью ждём вас ♡</p>
      </footer>

      <RSVPModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
