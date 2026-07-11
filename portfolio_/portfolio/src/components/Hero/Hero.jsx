import "./Hero.css";
import InteractiveShipCanvas from "./InteractiveShipCanvas";

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1>
            Hi, I'm <span>Nithin Nandakumar</span>
          </h1>

          <h2>
            M.Sc. Geodesy & Geoinformatics <span className="separator">|</span> Hydrography (IHO CAT-A)
          </h2>

          <p>
            Specializing in high-resolution seafloor mapping, hydrographic data acquisition (QINSy, Qimera, CARIS), and spatial geodata solutions. Fostering a multidisciplinary perspective between mechanical engineering and geospatial science offshore and onshore.
          </p>

          <div className="hero-buttons">
            <a
              href="/nithin2026.pdf"
              download="Nithin_Nandakumar_CV.pdf"
              className="hero-link"
            >
              <button>
                Download Resume
              </button>
            </a>

            <a
              href="#projects"
              className="hero-link"
            >
              <button className="outline-btn">
                View Projects
              </button>
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <InteractiveShipCanvas />
        </div>
      </div>
    </section>
  );
}

export default Hero;