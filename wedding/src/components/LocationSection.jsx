import {
  EnvironmentOutlined,
  CarOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useScrollReveal } from "../hooks/useScrollReveal";
import styles from "../styles/LocationSection.module.css";
import locationImg from "../img/location.jpg";

export default function LocationSection() {
  const { ref: r1, isVisible: v1 } = useScrollReveal();
  const { ref: r2, isVisible: v2 } = useScrollReveal();
  const { ref: r3, isVisible: v3 } = useScrollReveal();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.imageCol}>
          <div
            ref={r1}
            className={`reveal ${v1 ? "visible" : ""} ${styles.imageWrap}`}
          >
            <img
              src={locationImg}
              alt="Место проведения"
              className={styles.image}
            />
            <div className={styles.imageBadge}>
              <span className={styles.badgeText}>Место торжества</span>
            </div>
          </div>
        </div>

        <div className={styles.textCol}>
          <p
            ref={r2}
            className={`reveal ${v2 ? "visible" : ""} ${styles.eyebrow}`}
          >
            Место проведения
          </p>

          <h2
            className={`reveal reveal-delay-1 ${v2 ? "visible" : ""} ${styles.venueName}`}
          >
            Ресторан «Эко Парк»
          </h2>

          <div
            ref={r3}
            className={`reveal reveal-delay-2 ${v3 ? "visible" : ""} ${styles.details}`}
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
            className={`reveal reveal-delay-3 ${v3 ? "visible" : ""} ${styles.mapLink}`}
          >
            Открыть на карте →
          </a>
        </div>
      </div>
    </section>
  );
}
