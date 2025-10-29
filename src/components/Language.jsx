import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import uk from "../../public/uk.jpg";
import france from "../../public/fr.png";

const Language = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [isLoaded, setIsLoaded] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { label: "FR", image: france, code: "fr" },
    { label: "EN", image: uk, code: "en" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Load saved language
    const savedLang = localStorage.getItem("selectedLanguage") || "en";
    setSelectedLang(savedLang);

    document.addEventListener("mousedown", handleClickOutside);

    // Wait for Google Translate to be ready
    const observer = new MutationObserver(() => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo && combo.options.length > 1) {
        setIsLoaded(true);
        observer.disconnect();

        if (savedLang && savedLang !== "en") {
          setTimeout(() => {
            changeLanguage(savedLang, true);
          }, 300);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      observer.disconnect();
    };
  }, []);

  const changeLanguage = (langCode, force = false) => {
    document.body.classList.toggle("translated", langCode !== "en");
  
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      if (force || select.value === langCode) {
        const tempLang = langCode === "en" ? "fr" : "en"; select.value = tempLang;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        setTimeout(() => {
          select.value = langCode;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }, 200);
      } else {
        select.value = langCode;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  };
  

  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang.code);
    localStorage.setItem("selectedLanguage", lang.code);
    setIsOpen(false);

    if (isLoaded) {
      changeLanguage(lang.code, true);
    }
  };

  const selectedLanguage =
    languages.find((l) => l.code === selectedLang) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!isLoaded}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
          isLoaded
            ? "bg-[#18131b] hover:bg-[#353535]"
            : "bg-gray-400 cursor-not-allowed"
        } text-white`}
      >
        {selectedLanguage && (
          <Image
            src={selectedLanguage.image}
            alt={selectedLanguage.label}
            width={24}
            height={24}
            className="rounded-full w-5 h-5"
          />
        )}
        <span className="notranslate uppercase">{selectedLanguage.label}</span>

        {!isLoaded && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 rounded-md shadow-lg border border-gray-200 bg-black">
          {!isLoaded && (
            <div className="px-2 py-1 text-xs text-gray-500 border-b border-gray-100">
              Loading translator...
            </div>
          )}
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang)}
              className={`flex items-center space-x-2 w-32 px-2 py-2 notranslate ${
                !isLoaded ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={!isLoaded}
            >
              <Image
                src={lang.image}
                alt={lang.label}
                width={24}
                height={24}
                className="rounded-full w-6 h-6"
              />
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Language;
