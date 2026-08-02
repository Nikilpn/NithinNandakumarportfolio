import "./Hero.css";
import InteractiveShipCanvas from "./InteractiveShipCanvas";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../data/translations";

function Hero() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1>
            {t.hero.greeting} <span>Nithin Nandakumar</span>
          </h1>

          <h2>
            {t.hero.subtitle}
          </h2>

          <p>
            {t.hero.description}
          </p>

          <div className="hero-buttons">
            <a
              href="/nithin2026.pdf"
              download="Nithin_Nandakumar_CV.pdf"
              className="hero-link"
            >
              <button>
                {t.hero.downloadResume}
              </button>
            </a>

            <a
              href="#projects"
              className="hero-link"
            >
              <button className="outline-btn">
                {t.hero.viewProjects}
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
