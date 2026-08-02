// src/components/Footer/Footer.jsx

import "./Footer.css";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../data/translations";

function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <footer className="footer">
      <div className="footer-container">

        <h2 className="footer-logo">{t.footer.title}</h2>

        <p className="footer-text">
          {t.footer.subtitle}
        </p>

        <div className="footer-links">
          <a
            href="https://www.linkedin.com/in/nithin-nandakumar-hydro21061996"
            target="_blank"
            rel="noreferrer"
          >
            {t.footer.linkedin}
          </a>

          <a href="mailto:nithinnandakumar066@gmail.com">
            {t.footer.email}
          </a>
        </div>

        <p className="footer-copy">
          {t.footer.rights}
        </p>

      </div>
    </footer>
  );
}

export default Footer;
