import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Noise from './Noise';
import CustomCursor from './CustomCursor';
import Preloader from './Preloader';
import Nav from './Nav';
import Hero from './Hero';
import Ticker from './Ticker';
import Manifest from './Manifest';
import Stats from './Stats';
import Mechanics from './Mechanics';
import Program from './Program';
import Speaker from './Speaker';
import Audience from './Audience';
import Partners from './Partners';
import Sponsorship from './Sponsorship';
import Pricing from './Pricing';
import FAQ from './FAQ';
import FinalCTA from './FinalCTA';
import Footer from './Footer';
import RevealAnimations from './RevealAnimations';
import { setLenis } from '@/lib/landingScroll';

gsap.registerPlugin(ScrollTrigger);

export default function LandingApp() {
  const [heroReady, setHeroReady] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!RM) {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenisRef.current = lenis;
      setLenis(lenis);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      lenisRef.current?.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <div className="landing-app">
      <Noise />
      <CustomCursor />
      <Preloader onDone={() => setHeroReady(true)} />
      <Nav />
      <Hero ready={heroReady} />
      <Ticker />
      <Manifest />
      <Stats />
      <Mechanics />
      <Program />
      <Speaker />
      <Audience />
      <Partners />
      <Sponsorship />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
      <RevealAnimations />
    </div>
  );
}