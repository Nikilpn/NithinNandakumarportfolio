// src/components/Footer/Footer.jsx

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <h2 className="footer-logo">Nithin Nandakumar</h2>

        <p className="footer-text">
          M.Sc. Geodesy and Geoinformatics | Hydrography Specialization (IHO CAT-A)
        </p>

        <div className="footer-links">
          <a
            href="https://www.linkedin.com/in/nithin-nandakumar-hydro21061996"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>

          <a href="mailto:nithinnandakumar066@gmail.com">
            Email
          </a>
        </div>

        <p className="footer-copy">
          © 2026 Nithin Nandakumar. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;