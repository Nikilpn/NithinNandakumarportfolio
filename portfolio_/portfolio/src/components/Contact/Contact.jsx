import "./Contact.css";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../data/translations";

function Contact() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="contact" className="contact">
      <div className="section-title">
        <h2>{t.contact.title}</h2>
      </div>

      <div className="contact-container">

        <div className="contact-card">

          <h3>{t.contact.cardTitle}</h3>

          <p>
            {t.contact.description}
          </p>

          <div className="contact-details">

            <div className="contact-item">
              <h4>{t.contact.email}</h4>
              <a href="mailto:nithinnandakumar066@gmail.com">
                nithinnandakumar066@gmail.com
              </a>
            </div>

            <div className="contact-item">
              <h4>{t.contact.phone}</h4>
              <a href="tel:+4917676950489">
                +49 176 76950489
              </a>
            </div>

            <div className="contact-item">
              <h4>{t.contact.location}</h4>
              <p>{t.contact.locationValue}</p>
            </div>

            <div className="contact-item">
              <h4>{t.contact.linkedin}</h4>
              <a
                href="https://www.linkedin.com/in/nithin-nandakumar-hydro21061996"
                target="_blank"
                rel="noreferrer"
              >
                nithin-nandakumar-hydro21061996
              </a>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Contact;
