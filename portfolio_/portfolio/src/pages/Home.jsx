import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Skills from "../components/Skills/Skills";
import Experience from "../components/Experience/Experience";
import Projects from "../components/Projects/Projects";
import Education from "../components/Education/Education";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="page-sections">
        <About />
        <div className="skills-experience-wrapper">
          <Skills />
          <Experience />
        </div>
        <Projects />
        <Education />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

export default Home;
