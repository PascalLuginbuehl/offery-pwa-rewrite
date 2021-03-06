// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import translations from "-!csv-loader!./translations.csv" // eslint-disable-line import/no-webpack-loader-syntax

// Get all language Keys
const langs = translations[0]

// Remove beginning with language keys
translations.shift()

// Remove ending with newLine
translations.pop()
export interface IMessages { [keyWord: string]: string }
export interface ITranslationAssortment { [lang: string]: IMessages }

// Creates new Object with all translations
const sortedTranslations: ITranslationAssortment = Object.assign({}, ...langs.map((langKey: string, i: number) => {
  return { [langKey]: Object.assign({}, ...translations.map((words: string[]) => ({ [words[0]]: words[i] }))) }
}))

export { sortedTranslations as translations }
