import { useState } from "react";

import LoadingScreen from "./components/loading-page/LoadingScreen";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { ThemeProvider } from "./context/ThemeContext";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Projects from "./components/Projects/Projects";
import Experience from "./components/Experience/Experience";
import Achievements from "./components/Achievements/Achievements";
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
    <ThemeProvider>
      {/* Navbar is a sibling of #app-content, not a child — it must stay
          outside the monochrome filter so its accent color and active
          link stay alive in Monochrome mode (see index.css). */}
      <Navbar />
      <div id="app-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
