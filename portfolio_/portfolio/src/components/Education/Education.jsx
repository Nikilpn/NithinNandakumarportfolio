import "./Education.css";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../data/translations";

function Education() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="education" className="education">
      <div className="section-title">
        <h2>{t.education.title}</h2>
      </div>

      <div className="education-grid">
        <div className="education-card">
          <div className="education-header">
            <h3>{t.education.mscDegree}</h3>
            <span className="education-date">{t.education.mscDate}</span>
          </div>
          <p className="education-institution">{t.education.mscInstitution}</p>
          <div className="education-courses">
            <strong>{t.education.keyCourses}</strong> {t.education.mscCourses}
          </div>
        </div>

        <div className="education-card">
          <div className="education-header">
            <h3>{t.education.btechDegree}</h3>
            <span className="education-date">{t.education.btechDate}</span>
          </div>
          <p className="education-institution">{t.education.btechInstitution}</p>
          <p className="education-activity">
            <strong>{t.education.activities}</strong> {t.education.btechActivity}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Education;
