import * as React from 'react'
import { IMessages, translations as baseTranslations, ITranslationAssortment } from '../i18n'
import { IntlProvider } from 'react-intl'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import deLocale from 'date-fns/locale/de'
import { IText } from '../interfaces/IText';

export type ChangeLanguage = (language: string) => void

interface Props {
  additionalTranlations?: Array<IText>
}

interface State {
  finalMessages: IMessages
  locale: string,
}

interface ContextData {
  changeLanguage: ChangeLanguage,
  locale: string,
  messages: IMessages
}


export interface WithLanguageProps {
  changeLanguage: ChangeLanguage
}


const contextData: ContextData = { changeLanguage: (language: string): boolean => false, locale: "en", messages: baseTranslations.en }
const { Provider, Consumer } = React.createContext(contextData)


class LanguageProvider extends React.Component<Props, State> {
  public state: State = {
    locale: "de",
    finalMessages: baseTranslations["de"],
  }

  componentDidMount() {
    // Determin language

    const localStorageLocale = localStorage.getItem("OFFERY_INTL_LOCALE")

    // @ts-ignore Sets locale acording to local storage
    const determinedLocale = localStorageLocale || navigator.s && navigator.s[0] || navigator.language || navigator.user

    // Get a clean locale WithoutRegionCode
    const cleanLocale = "de"
    // const cleanLocale = determinedLocale.toLowerCase().split(/[_-]+/)[0]

    this.setState({locale: cleanLocale})

    // Call generate function
    this.generateMessagesObject(this.props.additionalTranlations, cleanLocale)
  }


  generateMessagesObject = (additionalTranlations: Array<IText> | undefined, localeKey: string) => {
    // Get only from one language, with many fallbacks
    const messages = baseTranslations[localeKey] || baseTranslations.de

    let extraMessages: IMessages = {}


    if (additionalTranlations) {
      // Transforms array to object by settings keys and fixing translation objects
      //@ts-ignore Copy translations over to extraMessages
      additionalTranlations.map(e => extraMessages[e.TextKey] = e[localeKey.toUpperCase()].replace(/(?:\r\n|\r|\n)/g, '{br}'))
    }
    // Merge translations
    this.setState({ finalMessages: { ...messages, ...extraMessages } })
  }

  // Run this function when new Additions Translations get Added Dynamicly
  componentWillReceiveProps(nextProps: Props) {
    this.generateMessagesObject(nextProps.additionalTranlations, this.state.locale)
  }

  componentDidUpdate(prevProps: Props){
    const { additionalTranlations} = this.props
    if(prevProps.additionalTranlations !== additionalTranlations) {
      this.generateMessagesObject(additionalTranlations, this.state.locale)
    }
  }

  // you must specify what you’re adding to the context
  public changeLanguage = (newLocale: string) => {
    this.generateMessagesObject(this.props.additionalTranlations, newLocale)

    localStorage.setItem("OFFERY_INTL_LOCALE", newLocale)

    this.setState({locale: newLocale})
  }

  public render() {
    const { locale, finalMessages } = this.state
    return (
      <Provider value={{ changeLanguage: this.changeLanguage, locale, messages: finalMessages }}>
        <IntlProvider
          locale={locale}
          messages={finalMessages}
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
            {this.props.children}
          </MuiPickersUtilsProvider>
        </IntlProvider>
      </Provider>
    )
  }
}

function withLanguage<P>(Component: React.ComponentType<P & WithLanguageProps>) {
  function WithRoot(props: Pick<P, Exclude<keyof P, keyof WithLanguageProps>>) {
    // const { changeLanguage, currentLanguage } = this.context

    // const mergedProps = Object.assign({}, props, { changeLanguage, currentLanguage })
    // const mergedProps = props
    return (
      <Consumer>
        {state => (
          // @ts-ignore after updating this no longer wanted to work :(
          <Component {...props} changeLanguage={state.changeLanguage} />
        )}
      </Consumer>
    )
  }

  return WithRoot
}

export { LanguageProvider, withLanguage }
