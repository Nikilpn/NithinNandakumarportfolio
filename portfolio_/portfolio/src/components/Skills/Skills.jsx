import "./Skills.css";
import { skillsData } from "../../data/skills";
import ParticlesCanvas from "./ParticlesCanvas";

function Skills() {
  return (
    <section id="skills" className="skills">
      <ParticlesCanvas />

      <div className="section-title">
        <h2>Skills</h2>
      </div>

      <div className="skills-container">

        <div className="skills-section">
          <h3>Software & Data Processing Systems</h3>
          <div className="skills-grid">
            {skillsData.software.map((skill, index) => (
              <div className="skill-card" key={index}>
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="skills-section">
          <h3>Acoustic Sensors & Field Equipment</h3>
          <div className="skills-grid">
            {skillsData.equipment.map((skill, index) => (
              <div className="skill-card" key={index}>
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="skills-section languages-section">
          <h3>Languages</h3>
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