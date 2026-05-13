import { useEffect, useRef, useState } from "react";
import {
  EnvironmentOutlined,
  CarOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useScrollReveal } from "../hooks/useScrollReveal";
import TornEdge from "./TornEdge";
import styles from "../styles/LocationSection.module.css";
import locationImg from "../img/location.webp";

const isTouch = window.matchMedia(
  "(hover: none) and (pointer: coarse)",
).matches;

export default function LocationSection() {
  const { ref: r1, isVisible: v1 } = useScrollReveal();
  const { ref: r2, isVisible: v2 } = useScrollReveal();
  const { ref: r3, isVisible: v3 } = useScrollReveal();
  const wrapRef = useRef(null);
  const [imgY, setImgY] = useState(0);

  useEffect(() => {
    if (isTouch) return;
    const update = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setImgY(center * 0.13);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section className={styles.section}>
      <TornEdge position="top" color="var(--forest)" />
      <div className={styles.inner}>
        <div className={styles.imageCol}>
          <div
            ref={(el) => {
              r1.current = el;
              wrapRef.current = el;
            }}
            className={`reveal-left ${v1 ? "visible" : ""} ${styles.imageWrap}`}
          >
            <h3
              ref={r2}
              className={`reveal-right ${v2 ? "visible" : ""} ${styles.eyebrow}`}
            >
              Место проведения
            </h3>
            <img
              src={locationImg}
              alt="Место проведения"
              className={styles.image}
              loading="lazy"
              decoding="async"
              style={
                isTouch ? undefined : { transform: `translateY(${imgY}px)` }
              }
            />
          </div>
        </div>

        <div className={styles.textCol}>
          <h2
            className={`reveal-right reveal-delay-1 ${v2 ? "visible" : ""} ${styles.venueName}`}
          >
            Ресторан «Эко Парк»
          </h2>

          <div
            ref={r3}
            className={`reveal-right reveal-delay-2 ${v3 ? "visible" : ""} ${styles.details}`}
          >
            <div className={styles.detailRow}>
              <EnvironmentOutlined className={styles.detailIcon} />
              <div>
                <p className={styles.detailTitle}>Адрес</p>
                <p className={styles.detailValue}>Сити Чесс, Элиста</p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <CarOutlined className={styles.detailIcon} />
              <div>
                <p className={styles.detailTitle}>Парковка</p>
                <p className={styles.detailValue}>
                  Бесплатная парковка на территории
                </p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <PhoneOutlined className={styles.detailIcon} />
              <div>
                <p className={styles.detailTitle}>Координатор</p>
                <p className={styles.detailValue}>+7 (961) 844-02-22</p>
              </div>
            </div>
          </div>

          <a
            href="https://yandex.com/maps/-/CPumrBKQ"
            target="_blank"
            rel="noopener noreferrer"
            className={`reveal-right reveal-delay-3 ${v3 ? "visible" : ""} ${styles.mapLink}`}
          >
            Открыть на карте →
          </a>
        </div>
      </div>
    </section>
  );
}
