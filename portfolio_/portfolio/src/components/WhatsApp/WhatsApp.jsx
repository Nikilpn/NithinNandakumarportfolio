import "./WhatsApp.css";

import { FaWhatsapp } from "react-icons/fa";

function WhatsApp() {

  return (

    <a
      href="https://wa.me/4917676950489"
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
    >

      <FaWhatsapp />

    </a>

  );
}

export default WhatsApp;