const knowledgeBase = {
  greeting: [
    "Hi! I'm Nova, Nithin's AI assistant. Ask me about his skills, projects, experience, education, or how to get in touch — in English or German!",
    "Hello! Welcome to Nithin's portfolio. I can tell you about his hydrographic survey work, his M.Sc., or his projects. Try asking 'what projects has Nithin done?'",
    "Hallo! Ich bin Nova, Nithins KI-Assistent. Frag mich auf Englisch oder Deutsch nach seinen Fähigkeiten, Projekten, Erfahrungen oder Kontaktdaten!"
  ],
  greetingDe: [
    "Hallo! Ich bin Nova, Nithins KI-Assistent. Frag mich auf Englisch oder Deutsch zu seinen Fähigkeiten, Projekten, Erfahrungen oder Kontaktdaten!",
    "Servus! Willkommen in Nithins Portfolio. Ich kann dir von seiner hydrografischen Arbeit, seinem Studium und seinen Projekten erzählen. Frag mich einfach!"
  ],

  topics: {
    skills: [
      "skills",
      "technologies",
      "tech stack",
      "what do you know",
      "stacks",
      "languages",
      "programming",
      "fähigkeiten",
      "kompetenzen",
      "kenntnisse",
      "software"
    ],
    projects: [
      "projects",
      "project",
      "portfolio",
      "work",
      "built",
      "developed",
      "created",
      "applications",
      "projekte",
      "projekt"
    ],
    experience: [
      "experience",
      "intern",
      "internship",
      "job",
      "work experience",
      "worked",
      "erfahrung",
      "praktikum",
      "berufserfahrung"
    ],
    education: [
      "education",
      "study",
      "studied",
      "degree",
      "bca",
      "btech",
      "b.tech",
      "college",
      "university",
      "qualification",
      "academics",
      "ausbildung",
      "studium",
      "universität"
    ],
    contact: [
      "contact",
      "email",
      "phone",
      "reach",
      "hire",
      "get in touch",
      "whatsapp",
      "github",
      "linkedin",
      "kontakt",
      "erreichen"
    ],
    about: [
      "about",
      "who is",
      "who are you",
      "nithin",
      "developer",
      "über",
      "wer ist"
    ]
  },

  responses: {
    skills:
      "Nithin is a hydrographic surveyor skilled in MBES and single-beam echo sounders, side scan sonar, USBL positioning, and ROV surveying. His software toolbox includes QINSy, Qimera, CARIS HIPS & SIPS, Fledermaus, FMGT, QGIS, ArcGIS Pro, Hypack, and Innomar ISE. He also works with Python for geospatial data analysis.",
    skillsDe:
      "Nithin ist Hydrograf mit Erfahrung in Fächerecholot und Einstrahl-Echolot, Seitensichtsonar, USBL-Positionierung und ROV-Vermessung. Zu seiner Software-Ausstattung gehören QINSy, Qimera, CARIS HIPS & SIPS, Fledermaus, FMGT, QGIS, ArcGIS Pro, Hypack und Innomar ISE. Außerdem arbeitet er mit Python für die Analyse von Geodaten.",
    projects:
      "Nithin's key projects include a sensitivity analysis of MBES and side scan sonar for water temperature changes, shipwreck identification and 3D bathymetric visualization in German waters, an Elbe River MBES patch test and calibration campaign, and a self-stabilizing stretcher design for emergency ambulances (IRJET certified). You can browse all of them in the Projects section!",
    projectsDe:
      "Zu Nithins wichtigsten Projekten gehören eine Sensitivitätsanalyse von Fächerecholot und Seitensichtsonar bei Wassertemperaturänderungen, die Identifikation eines Schiffsunglücks mit 3D-Bathymetrie-Visualisierung in deutschen Gewässern, eine Patch-Test- und Kalibrierungskampagne für das Fächerecholot auf der Elbe sowie ein selbststabilisierender Krankentrage-Entwurf für Notfallambulanzen (IRJET-zertifiziert). Alle Projekte findest du im Bereich Projekte!",
    experience:
      "Nithin is currently a Hydrographic Surveyor Intern at HydroCharting ApS in Denmark, conducting offshore multibeam surveys, ROV surveys along submarine cable trenches, and data processing with QINSy, Qimera, and Fledermaus. Before that he worked as a Junior Engineer at Edvisor Engineering and completed internships at Steel and Industrial Forgings Ltd in Kerala, India.",
    experienceDe:
      "Nithin ist derzeit Hydrografie-Praktikant bei HydroCharting ApS in Dänemark und führt Offshore-Mehrstrahlvermessungen, ROV-Vermessungen entlang von Unterwasser-Kabelgräben und Datenverarbeitung mit QINSy, Qimera und Fledermaus durch. Davor arbeitete er als Junior Engineer bei Edvisor Engineering und absolvierte Praktika bei Steel and Industrial Forgings Ltd in Kerala, Indien.",
    education:
      "Nithin is pursuing an M.Sc. in Geodesy and Geoinformatics with a focus on Hydrography (IHO/FIG/ICA CAT-A) at HafenCity Universität Hamburg, Germany. He holds a B.Tech in Mechanical Engineering from the University of Calicut, Kerala, India, and speaks English fluently while learning German (B1).",
    educationDe:
      "Nithin studiert Geodäsie und Geoinformatik mit Schwerpunkt Hydrografie (IHO/FIG/ICA CAT-A) an der HafenCity Universität Hamburg, Deutschland. Er hat einen B.Tech in Maschinenbau von der University of Calicut, Kerala, Indien, spricht fließend Englisch und lernt derzeit Deutsch (B1).",
    contact:
      "You can reach Nithin via email at nithinnandakumar066@gmail.com, call or WhatsApp him at +49 176 76950489, or connect on LinkedIn at nithin-nandakumar-hydro21061996. He's based in Hamburg, Germany, and is actively seeking opportunities in hydrographic surveying, offshore operations, GIS data analysis, and thesis collaborations!",
    contactDe:
      "Du kannst Nithin per E-Mail unter nithinnandakumar066@gmail.com erreichen, telefonisch oder per WhatsApp unter +49 176 76950489, oder auf LinkedIn unter nithin-nandakumar-hydro21061996. Er lebt in Hamburg, Deutschland, und sucht aktiv Möglichkeiten in der hydrografischen Vermessung, Offshore-Operationen, GIS-Datenanalyse und Masterarbeit-Kooperationen!",
    about:
      "Nithin Nandakumar is a hydrographic surveyor based in Hamburg, Germany, currently interning at HydroCharting ApS in Denmark. He specializes in high-resolution seafloor mapping, hydrographic data acquisition with QINSy, Qimera, and CARIS, and spatial geodata solutions — combining his mechanical engineering background with geospatial science.",
    aboutDe:
      "Nithin Nandakumar ist Hydrograf mit Wohnsitz in Hamburg, Deutschland, und absolviert derzeit ein Praktikum bei HydroCharting ApS in Dänemark. Er ist spezialisiert auf hochauflösende Meeresbodenkartierung, hydrografische Datenerfassung mit QINSy, Qimera und CARIS sowie räumliche Geodatenlösungen — und verbindet seinen Maschinenbau-Hintergrund mit der Geowissenschaft."
  },

  fallback:
    "I'm not sure about that one. Try asking about his skills, projects, experience, education, contact details, or ask 'wer ist Nithin' for German!",
  fallbackDe:
    "Das weiß ich leider nicht genau. Frag mich zu seinen Fähigkeiten, Projekten, Erfahrungen, seiner Ausbildung oder Kontaktdaten — oder auf Englisch, wenn du möchtest!"
};

export default knowledgeBase;
