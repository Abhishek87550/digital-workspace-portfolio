import { useState } from "react";

import LoadingScreen from "./components/loading-page/LoadingScreen";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { ThemeProvider } from "./context/ThemeContext";

import StarfieldBackground from "./components/StarfieldBackground";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Projects from "./components/Projects/Projects";
import Achievements from "./components/Achievements/Achievements";
import Resume from "./components/Resume/Resume";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

function App() {
  const [loadingFinished, setLoadingFinished] = useState(false);

  // Smooth scroll and global scroll reveals
  useSmoothScroll();
  useScrollReveal(loadingFinished);

  if (!loadingFinished) {
    return (
      <LoadingScreen
        onFinish={() => setLoadingFinished(true)}
      />
    );
  }

  return (
    <ThemeProvider>
      <StarfieldBackground />
      <Navbar />
      <div id="app-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Resume />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
