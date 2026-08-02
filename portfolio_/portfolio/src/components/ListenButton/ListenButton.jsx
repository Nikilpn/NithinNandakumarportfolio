import { useEffect, useRef, useState } from "react";

import { FaVolumeUp, FaPause } from "react-icons/fa";

import "./ListenButton.css";
import { useLanguage } from "../../context/LanguageContext";

const VOICEOVER_EN =
  "Hello and welcome to my portfolio. I am Nithin Nandakumar, a hydrographic surveyor based in Hamburg, Germany. " +
  "I specialize in high-resolution seafloor mapping and hydrographic data acquisition using tools like QINSy, Qimera, and CARIS. " +
  "I am currently pursuing a Master's degree in Geodesy and Geoinformatics, with a focus on Hydrography, at HafenCity University Hamburg, " +
  "and I am completing an internship with HydroCharting in Denmark. " +
  "My work includes multibeam surveys, side scan sonar operations, USBL positioning, and ROV survey support. " +
  "In my projects, I have investigated how water temperature affects multibeam and side scan sonar data quality, " +
  "identified shipwrecks using bathymetry and magnetometer data, and carried out patch test calibrations on the river Elbe. " +
  "I speak fluent English, I am learning German, and I am always open to new opportunities in hydrographic surveying, offshore operations, and GIS analysis. " +
  "Feel free to browse my projects or get in touch. Thank you for listening!";

const VOICEOVER_DE =
  "Hallo und willkommen auf meinem Portfolio. Ich bin Nithin Nandakumar, Hydrograf mit Wohnsitz in Hamburg, Deutschland. " +
  "Ich bin spezialisiert auf hochauflösende Meeresbodenkartierung und hydrografische Datenerfassung mit Werkzeugen wie QINSy, Qimera und CARIS. " +
  "Derzeit studiere ich Geodäsie und Geoinformatik mit Schwerpunkt Hydrografie an der HafenCity Universität Hamburg " +
  "und absolviere ein Praktikum bei HydroCharting in Dänemark. " +
  "Meine Arbeit umfasst Fächerecholot-Vermessungen, Seitensichtsonar-Operationen, USBL-Positionierung und ROV-Vermessung. " +
  "In meinen Projekten habe ich untersucht, wie Wassertemperatur die Datenqualität von Fächerecholot und Seitensichtsonar beeinflusst, " +
  "habe Schiffsunglücke mithilfe von Bathymetrie und Magnetometerdaten identifiziert und Patch-Test-Kalibrierungen auf der Elbe durchgeführt. " +
  "Ich spreche fließend Englisch, lerne Deutsch und bin immer offen für neue Möglichkeiten in der hydrografischen Vermessung, Offshore-Operationen und GIS-Analyse. " +
  "Schau dich gerne in meinen Projekten um oder nimm Kontakt auf. Vielen Dank fürs Zuhören!";

let cachedVoices = [];
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    cachedVoices = window.speechSynthesis.getVoices();
  });
}

function pickVoice(lang) {
  return (
    cachedVoices.find((v) => v.lang.toLowerCase().startsWith(lang)) ||
    cachedVoices.find((v) => v.lang.toLowerCase().includes(lang)) ||
    null
  );
}

function ListenButton() {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const speakingRef = useRef(false);

  const broadcast = (playing) => {
    window.dispatchEvent(
      new CustomEvent("voiceover-state", { detail: { playing } })
    );
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    speakingRef.current = false;
    setIsPlaying(false);
    broadcast(false);
  };

  const speak = (language) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    speakingRef.current = true;
    setIsPlaying(true);
    broadcast(true);

    const text = language === "de" ? VOICEOVER_DE : VOICEOVER_EN;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "de" ? "de-DE" : "en-US";
    const voice = pickVoice(language === "de" ? "de" : "en");
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      speakingRef.current = false;
      setIsPlaying(false);
      broadcast(false);
    };
    utterance.onerror = () => {
      speakingRef.current = false;
      setIsPlaying(false);
      broadcast(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleAudio = () => {
    if (speakingRef.current) {
      stopSpeaking();
    } else {
      speak(lang);
    }
  };

  // Pause the voiceover while the AI assistant is speaking
  useEffect(() => {
    const handleAssistantSpeaking = (e) => {
      if (e.detail?.speaking && speakingRef.current) {
        stopSpeaking();
      }
    };
    window.addEventListener("assistant-speaking", handleAssistantSpeaking);
    return () => {
      window.removeEventListener("assistant-speaking", handleAssistantSpeaking);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button
        className={`listen-float ${isPlaying ? "playing" : ""}`}
        onClick={toggleAudio}
        aria-label="Listen to voiceover"
        title={isPlaying ? "Pause voiceover" : "Listen to me"}
      >
        {isPlaying ? <FaPause /> : <FaVolumeUp />}

        <span className="listen-ring" />
        <span className="listen-ring ring-2" />

        <span
          className={`listen-lang ${lang === "de" ? "active" : ""}`}
          title="English / Deutsch"
        >
          {lang === "en" ? "EN" : "DE"}
        </span>
      </button>
    </>
  );
}

export default ListenButton;
