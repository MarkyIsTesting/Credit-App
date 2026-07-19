import { createContext, useContext, useEffect, useState } from "react";
import { translations as baseTranslations, DEFAULT_LANG, LANGUAGES } from "@/i18n/translations";
import { authTranslations } from "@/i18n/authTranslations";

// Merge base translations with auth/dashboard translations
const translations = Object.fromEntries(
  Object.keys(baseTranslations).map((code) => {
    const base = baseTranslations[code] || {};
    const extra = authTranslations[code] || {};
    return [
      code,
      {
        ...base,
        ...extra,
        // Deep-merge `nav` (avoid overwriting the entire block)
        nav: { ...(base.nav || {}), ...(extra.nav || {}) },
      },
    ];
  })
);

const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LANG;
    const stored = window.localStorage.getItem("ek_lang");
    if (stored && translations[stored]) return stored;
    return DEFAULT_LANG;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ek_lang", lang);
      document.documentElement.setAttribute("lang", lang);
    }
  }, [lang]);

  const setLang = (l) => {
    if (translations[l]) setLangState(l);
  };

  // t returns a value (string / array / object) by dot-path
  const t = (path) => {
    const dict = translations[lang] || translations[DEFAULT_LANG];
    const parts = path.split(".");
    let cur = dict;
    for (const p of parts) {
      if (cur == null) return path;
      cur = cur[p];
    }
    return cur == null ? path : cur;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
