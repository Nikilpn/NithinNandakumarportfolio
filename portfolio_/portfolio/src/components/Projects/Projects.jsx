import "./Projects.css";
import DigitalTwin from "../Three/DigitalTwin";
import { projectsData } from "../../data/projects";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../data/translations";

function Projects() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="projects" className="projects">
      <DigitalTwin />

      <div className="section-title">
        <h2>{t.projects.title}</h2>
      </div>

      <div className="projects-grid">

        {projectsData[lang].map((project, index) => (

          <div className="project-card" key={index}>

            <div className="project-meta">
              <span className="project-institution">{project.institution}</span>
              <span className="project-period">{project.period}</span>
            </div>

            <h3>{project.title}</h3>

            <p className="project-description">{project.description}</p>

            {project.highlights && (
              <ul className="project-bullet-highlights">
                {project.highlights.map((highlight, hIdx) => (
                  <li key={hIdx}>{highlight}</li>
                ))}
              </ul>
            )}

            <div className="project-tools">
              {project.tools.map((tool, tIdx) => (
                <span className="tool-tag" key={tIdx}>{tool}</span>
              ))}
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Projects;
