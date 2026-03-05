import { useState } from 'react';
import { Button } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useScrollReveal } from '../hooks/useScrollReveal';
import RSVPModal from './RSVPModal';
import styles from '../styles/RSVPSection.module.css';

export default function RSVPSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const { ref: r1, isVisible: v1 } = useScrollReveal();
  const { ref: r2, isVisible: v2 } = useScrollReveal();

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
          >
            <Button
              size="large"
              className={styles.rsvpBtn}
              onClick={() => setModalOpen(true)}
              icon={<HeartOutlined />}
            >
              Я приду
            </Button>
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
