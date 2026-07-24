import "./About.css";
import CoordSystem from "../Three/CoordSystem";
import GpsSurvey from "../Three/GpsSurvey";

function About() {
  return (
    <section id="about" className="about">
      <div className="about-bg-anim">
        <CoordSystem />
        <GpsSurvey />
      </div>

      <div className="section-title">
        <h2>About Me</h2>
      </div>

      <div className="about-content">

        <p>
          As a Hydrographic Surveyor intern at <strong>HydroCharting ApS</strong>, I contribute to high-quality hydrographic assessments through sensor mobilization, USBL calibration, and ROV surveying. With hands-on experience in data acquisition using Qinsy, I support the development of precise survey monitoring and comprehensive reporting to aid informed decision-making.
        </p>

        <p>
          I am pursuing an M.Sc. in Geodesy and Geoinformatics at <strong>HafenCity Universität Hamburg</strong>, specializing in hydrography (IHO/FIG/ICA CAT A). My academic and professional journey is complemented by a background in mechanical engineering and certifications in industrial safety and occupational health, fostering a multidisciplinary perspective in hydrographic surveying and geospatial solutions.
        </p>

        <div className="about-highlights">
          <div className="highlight-item">
            <span className="highlight-icon">⚓</span>
            <h4>CAT-A Hydrography</h4>
            <p>IHO / FIG / ICA Category A professional specialization</p>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">🛰️</span>
            <h4>Geoinformatics</h4>
            <p>Spatial analysis & seafloor mapping at HafenCity Uni, Hamburg</p>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">⚙️</span>
            <h4>Mechanical Eng.</h4>
            <p>Solid mechanical background (B.Tech) with industrial forging focus</p>
          </div>
        </div>

      </div>

    </section>
  );
}

export default About;