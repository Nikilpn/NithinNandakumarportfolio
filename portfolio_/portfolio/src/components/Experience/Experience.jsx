import "./Experience.css";

import { experienceData } from "../../data/experience";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../data/translations";

function Experience() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="experience" className="experience">

      <div className="section-title">
        <h2>{t.experience.title}</h2>
      </div>

      <div className="experience-timeline">

        {experienceData[lang].map((job, index) => (

          <div className="experience-card" key={index}>

            <div className="experience-header">
              <h3>{job.role}</h3>
              <span className="experience-duration">{job.period} ({job.duration})</span>
            </div>

            <div className="experience-sub">
              <h4>{job.company}</h4>
              <span className="experience-location">{job.location}</span>
            </div>

            <ul className="experience-highlights">
              {job.highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Experience;
