import "./Skills.css";
import { skillsData } from "../../data/skills";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../data/translations";

function Skills() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="skills" className="skills">

      <div className="section-title">
        <h2>{t.skills.title}</h2>
      </div>

      <div className="skills-container">

        <div className="skills-section">
          <h3>{t.skills.software}</h3>
          <div className="skills-grid">
            {skillsData.software.map((skill, index) => (
              <div className="skill-card" key={index}>
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="skills-section">
          <h3>{t.skills.equipment}</h3>
          <div className="skills-grid">
            {skillsData.equipment.map((skill, index) => (
              <div className="skill-card" key={index}>
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="skills-section languages-section">
          <h3>{t.skills.languages}</h3>
          <div className="languages-grid">
            {skillsData.languages.map((lang, index) => (
              <div className="lang-card" key={index}>
                <span className="lang-name">{lang.name}</span>
                <span className="lang-level">{lang.level}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}

export default Skills;
