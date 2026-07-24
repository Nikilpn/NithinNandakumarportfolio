import "./Education.css";
import StarField from "../Three/StarField";

function Education() {
  return (
    <section id="education" className="education">
      <StarField mouseInfluence={false} />
      <div className="section-title">
        <h2>Education</h2>
      </div>

      <div className="education-grid">
        <div className="education-card">
          <div className="education-header">
            <h3>M.Sc. Geodesy & Geoinformatics (Hydrography CAT-A)</h3>
            <span className="education-date">2022 - 2027 (Expected)</span>
          </div>
          <p className="education-institution">HafenCity Universität Hamburg, Germany</p>
          <div className="education-courses">
            <strong>Key Courses:</strong> Hydrographic Data Processing, Advanced Hydrography, Geodetic Data Processing, Bathymetry, Oceanographic Data Processing, Electronic Navigational Charts (ENC), Spatial Data Analysis, Ship Alignment Survey, Kalman Filter, Terrestrial Laser Scanning.
          </div>
        </div>

        <div className="education-card">
          <div className="education-header">
            <h3>B.Tech. Mechanical Engineering</h3>
            <span className="education-date">2014 - 2018</span>
          </div>
          <p className="education-institution">University of Calicut, Kerala, India</p>
          <p className="education-activity">
            <strong>Activities & Projects:</strong> National Service Scheme (NSS) Volunteer. B.Tech thesis project on stabilizing stretchers in emergency ambulances (IRJET certified).
          </p>
        </div>
      </div>
    </section>
  );
}

export default Education;