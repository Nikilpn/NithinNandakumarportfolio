import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
          <li>
            <a href="#home" onClick={() => setIsOpen(false)}>Home</a>
          </li>

          <li>
            <a href="#about" onClick={() => setIsOpen(false)}>About</a>
          </li>

          <li>
            <a href="#skills" onClick={() => setIsOpen(false)}>Skills</a>
          </li>

          <li>
            <a href="#projects" onClick={() => setIsOpen(false)}>Projects</a>
          </li>

          <li>
            <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;