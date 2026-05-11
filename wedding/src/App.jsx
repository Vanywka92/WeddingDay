import { useState, useCallback } from "react";
import HeroSection from "./components/HeroSection";
import InviteSection from "./components/InviteSection";
import SaveTheDateSection from "./components/SaveTheDateSection";
import CountdownSection from "./components/CountdownSection";
import DetailsSection from "./components/DetailsSection";
import LocationSection from "./components/LocationSection";
import GallerySection from "./components/GallerySection";
import RSVPSection from "./components/RSVPSection";
import ScrollProgress from "./components/ScrollProgress";
import IntroScreen from "./components/IntroScreen";
import CursorTrail from "./components/CursorTrail";

export default function App() {
  const [intro, setIntro] = useState(true);
  const onIntroDone = useCallback(() => setIntro(false), []);

  return (
    <>
      <CursorTrail />
      <ScrollProgress />
      {intro && <IntroScreen onDone={onIntroDone} />}
      <main>
        <HeroSection />
        {/* <InviteSection /> */}
        <SaveTheDateSection />
        <LocationSection />
        <DetailsSection />
        <GallerySection />
        <CountdownSection />
        <RSVPSection />
      </main>
    </>
  );
}
