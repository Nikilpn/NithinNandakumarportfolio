import "./Contact.css";

function Contact() {
  return (
    <section id="contact" className="contact">

      <div className="section-title">
        <h2>Contact Me</h2>
      </div>

      <div className="contact-container">

        <div className="contact-card">

          <h3>Get In Touch</h3>

          <p>
            I am actively seeking new opportunities in hydrographic surveying, offshore operations, GIS data analysis, or thesis collaborations. Let's connect!
          </p>

          <div className="contact-details">

            <div className="contact-item">
              <h4>Email</h4>
              <a href="mailto:nithinnandakumar066@gmail.com">
                nithinnandakumar066@gmail.com
              </a>
            </div>

            <div className="contact-item">
              <h4>Phone</h4>
              <a href="tel:+4917676950489">
                +49 176 76950489
              </a>
            </div>

            <div className="contact-item">
              <h4>Location</h4>
              <p>Wiesendamm 135, 22303, Hamburg, Germany</p>
            </div>

            <div className="contact-item">
              <h4>LinkedIn</h4>
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