import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Skills from "../components/Skills/Skills";
import Experience from "../components/Experience/Experience";
import Projects from "../components/Projects/Projects";
import Education from "../components/Education/Education";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import PointCloud from "../components/Three/PointCloud";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <div className="skills-experience-wrapper">
        <PointCloud />
        <Skills />
        <Experience />
      </div>
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </>
  );
}

export default Home;
