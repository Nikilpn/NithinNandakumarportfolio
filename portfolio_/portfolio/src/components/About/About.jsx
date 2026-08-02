import "./About.css";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../data/translations";

function About() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="about" className="about">

      <div className="section-title">
        <h2>{t.about.title}</h2>
      </div>

      <div className="about-content">

        <p>
          {t.about.p1} <strong>{t.about.p1Company}</strong>{t.about.p1Rest}
        </p>

        <p>
          {t.about.p2Start} <strong>{t.about.p2University}</strong>{t.about.p2Rest}
        </p>

        <div className="about-highlights">
          <div className="highlight-item">
            <span className="highlight-icon">⚓</span>
            <h4>{t.about.highlight1Title}</h4>
            <p>{t.about.highlight1Text}</p>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">🛰️</span>
            <h4>{t.about.highlight2Title}</h4>
            <p>{t.about.highlight2Text}</p>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">⚙️</span>
            <h4>{t.about.highlight3Title}</h4>
            <p>{t.about.highlight3Text}</p>
          </div>
        </div>

      </div>

    </section>
  );
}

export default About;
