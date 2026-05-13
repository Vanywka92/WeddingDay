import { useEffect, useRef, useState } from "react";
import styles from "../styles/MusicPlayer.module.css";
import cover from "../img/1.webp";
import Garland from "./Garland";

const TRACK_SRC = "/music.mp3";
const TRACK_TITLE = "Иван & Юлия · 15.08.2026";
const TRACK_ARTIST_IDLE = "Нажмите, чтобы включить музыку";
const TRACK_ARTIST_PLAYING = "Мот - Намек на нас";

const formatTime = (t) => {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onError = () => setError(true);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => setError(true));
    } else {
      audio.pause();
    }
  };

  const skip = (delta) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Math.max(0, Math.min((audio.duration || 0) - 0.1, audio.currentTime + delta));
    audio.currentTime = next;
  };

  const seek = (e) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
  };

  const progress = duration ? (current / duration) * 100 : 0;
  const subtitle = error
    ? "Не удалось загрузить трек"
    : playing
      ? TRACK_ARTIST_PLAYING
      : TRACK_ARTIST_IDLE;

  return (
    <section className={styles.section} aria-label="Музыкальный плеер">
      <Garland />
      <div className={styles.card}>
        <div className={styles.gloss} aria-hidden="true" />
        <div className={styles.bokeh} aria-hidden="true" />

        <header className={styles.head}>
          <button
            type="button"
            className={`${styles.iconBtn} ${liked ? styles.liked : ""}`}
            onClick={() => setLiked((v) => !v)}
            aria-label={liked ? "Убрать из любимых" : "В любимые"}
            aria-pressed={liked}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 21s-7.5-4.7-9.6-9.2C1 8.5 3.2 5 6.6 5c1.9 0 3.5 1 4.4 2.5h2c.9-1.5 2.5-2.5 4.4-2.5 3.4 0 5.6 3.5 4.2 6.8C19.5 16.3 12 21 12 21z"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Меню"
            tabIndex={-1}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className={styles.coverWrap}>
          <div className={`${styles.cover} ${playing ? styles.coverSpin : ""}`}>
            <img src={cover} alt="" loading="lazy" decoding="async" />
            {/* <span className={styles.coverDot} aria-hidden="true" /> */}
          </div>
        </div>

        <div className={styles.meta}>
          <h3 className={styles.title}>{TRACK_TITLE}</h3>
          <p className={`${styles.subtitle} ${playing ? styles.subtitlePlaying : ""}`}>
            {subtitle}
          </p>
        </div>

        <div className={styles.progressRow}>
          <span className={styles.time}>{formatTime(current)}</span>
          <div
            ref={progressRef}
            className={styles.progressTrack}
            onClick={seek}
            role="slider"
            aria-label="Позиция воспроизведения"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration) || 0}
            aria-valuenow={Math.floor(current)}
            tabIndex={0}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
            <div
              className={styles.progressThumb}
              style={{ left: `${progress}%` }}
            />
          </div>
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.ctrl}
            onClick={() => skip(-10)}
            aria-label="Назад на 10 секунд"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 6L4 12L11 18V13L20 18V6L11 11V6Z" fill="currentColor" />
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.playBtn} ${playing ? styles.playBtnOn : ""}`}
            onClick={toggle}
            aria-label={playing ? "Пауза" : "Воспроизвести"}
            aria-pressed={playing}
            disabled={error}
          >
            {playing ? (
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
                <rect x="14" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5.5L19 12L8 18.5V5.5Z" fill="currentColor" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className={styles.ctrl}
            onClick={() => skip(10)}
            aria-label="Вперёд на 10 секунд"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13 6L20 12L13 18V13L4 18V6L13 11V6Z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <audio ref={audioRef} src={TRACK_SRC} loop preload="none" />
      </div>
    </section>
  );
}
