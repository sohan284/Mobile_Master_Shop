import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import uk from "../../public/uk.jpg";
import france from "../../public/fr.png";

const Language = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  const [isLoaded, setIsLoaded] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
      { label: "FR", image: france, code: "fr" },
    { label: "EN", image: uk, code: "en" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Load saved language from localStorage
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang) {
      setSelectedLang(savedLang);
    }

    // Check if Google Translate is loaded and initialized
    const checkGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        setTimeout(() => {
          setIsLoaded(true);
          
          // Only apply translation if saved language is Polish
          if (savedLang === "PL") {
            changeLanguage("pl");
          }
          // If English (or default), do nothing - site is already in English
        }, 500);
      } else {
        setTimeout(checkGoogleTranslate, 100);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    checkGoogleTranslate();
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (languageCode) => {
    const tryTranslate = () => {
      // First check if Google Translate is loaded
      if (!window.google || !window.google.translate) {
        setTimeout(tryTranslate, 100);
        return;
      }

      // Wait for the translate element to be fully initialized
      const translateElement = document.querySelector('#google_translate_element');
      if (!translateElement) {
        setTimeout(tryTranslate, 100);
        return;
      }

      // Try to find the Google Translate select element
      let select = document.querySelector(".goog-te-combo");
      
      // If not found, try to find it in iframes
      if (!select) {
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
          try {
            if (iframe.contentDocument) {
              const iframeSelect = iframe.contentDocument.querySelector("select");
              if (iframeSelect && iframeSelect.options.length > 0) {
                select = iframeSelect;
                break;
              }
            }
          } catch (e) {
            // Cross-origin iframe, skip
          }
        }
      }

      if (select) {
        // Set the value and trigger change
        select.value = languageCode;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        
        // Also try to trigger the click event on the option
        const option = select.querySelector(`option[value="${languageCode}"]`);
        if (option) {
          option.selected = true;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      } else {
        // If still not found, try again after a delay
        setTimeout(tryTranslate, 200);
      }
    };
  
    tryTranslate(); 
  };

  const selectedLanguage = languages.find(
    (lang) => lang.label === selectedLang
  );

  const handleLanguageSelect = (lang) => {
    if (!isLoaded) {
      setSelectedLang(lang.label);
      localStorage.setItem("selectedLanguage", lang.label);
      setIsOpen(false);
      return;
    }
    
    setSelectedLang(lang.label);
    localStorage.setItem("selectedLanguage", lang.label);
    setIsOpen(false);
    changeLanguage(lang.code); 
  };

  return (
    <div className="" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
          isLoaded 
            ? "bg-[#18131b] hover:bg-[#353535]" 
            : "bg-gray-400 cursor-not-allowed"
        } text-white`}
        disabled={!isLoaded}
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
        <span className="notranslate">{selectedLang}</span>
        {!isLoaded && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 rounded-md shadow-lg border border-gray-200">
          {!isLoaded && (
            <div className="px-2 py-1 text-xs text-gray-500 border-b border-gray-100">
              Loading translator...
            </div>
          )}
          {languages.map((lang) => (
            <button
              key={lang.label}
              onClick={() => handleLanguageSelect(lang)}
              className={`flex items-center space-x-2 w-32 px-2 py-2 cursor-pointer notranslate ${
                !isLoaded ? "opacity-50" : ""
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