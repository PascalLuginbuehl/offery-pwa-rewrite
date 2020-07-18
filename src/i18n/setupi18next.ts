import i18next, { i18n } from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import translationEN from "./translation_en.json"
import translationDE from "./translation_de.json"

function checkKeys(t1: {}, t2: {}, name: string, prevKeyPath: string | null) {
  for (const key in t1) {
    const keyPath = prevKeyPath ? `${prevKeyPath}.${key}` : key
    if (!(key in t2)) {
      console.debug(`translation ${name} missing key ${keyPath}`)
      continue
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const sub1 = t1[key], sub2 = t2[key]
    if (typeof sub1 === "string") {
      if (typeof sub2 !== "string") {
        console.debug(`translation ${name} key ${keyPath} value is not string`)
      }
      continue
    }
    checkKeys(sub1, sub2, name, keyPath)
  }
}

export function setupI18n(): i18n {
  if (process.env.NODE_ENV === "development") {
    checkKeys(translationEN, translationDE, "de", null)
    checkKeys(translationDE, translationEN, "en", null)
  }

  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      fallbackLng: "de",

      ns: ["common"],
      defaultNS: "common",

      react: {
        wait: true,
        bindI18n: "languageChanged loaded",
        bindStore: "added removed",
        nsMode: "default",
      },

      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },

      detection: {
        lookupLocalStorage: "OFFERY_INTL_LOCALE",
        caches: ["localStorage"],
        order: ["querystring", "localStorage", "navigator"],
      },

      resources: {
        en: { common: translationEN },
        de: { common: translationDE },
      },

      debug: process.env.NODE_ENV === "development",
    })

  // Keep the language on moment.js in sync with i18next
  // by listening to the change language event.
  i18next.on("languageChanged", newlocale => {
    console.log("languageChanged: ", newlocale)
    // moment.locale(newlocale)
  })

  return i18next
}

export { default as LanguageChanged } from "./LanguageChanged"
export * from "./LanguageChanged"
