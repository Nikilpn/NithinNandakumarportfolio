import { useState } from "react";
import "./Navbar.css";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../data/translations";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.education, href: "#education" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <header className="navbar">
      <div className="nav-logo">
        <h2>Nithin.P.N</h2>
      </div>

      <button
        className={`nav-toggle ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle Navigation"
      >
        <span className="hamburger"></span>
      </button>

      <nav className={`nav-menu ${isOpen ? "open" : ""}`}>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <button
        className={`nav-lang-btn ${lang === "de" ? "active" : ""}`}
        onClick={toggleLang}
        aria-label={t.nav.toggleLabel}
        title={t.nav.toggleLabel}
      >
        {lang === "en" ? "DE" : "EN"}
      </button>
    </header>
  );
}

export default Navbar;
