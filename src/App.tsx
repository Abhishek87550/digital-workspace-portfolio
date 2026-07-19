import { useState } from "react";

import LoadingScreen from "./components/loading-page/LoadingScreen";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

function App() {
  const [loadingFinished, setLoadingFinished] = useState(false);

  // Smooth scroll only needs to run once the real page (past the loading
  // screen) is mounted — the loading screen itself doesn't scroll.
  useSmoothScroll();

  if (!loadingFinished) {
    return (
      <LoadingScreen
        onFinish={() => setLoadingFinished(true)}
      />
    );
  }

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}

export default App;