import { Messages, translations } from '../i18n'
import * as React from 'react'
import { IntlProvider } from 'react-intl'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import * as deLocale from 'date-fns/locale/de'
import { IText } from '../interfaces/IText';

export type ChangeLanguage = (language: string) => void

interface Props {
  defaultLocale: string
  additionalTranlations?: Array<IText>
}

interface State {
  // messages: TranslationAssortment | null
  messages: Messages,
  locale: string,
}
interface ContextData {
  changeLanguage: ChangeLanguage,
  locale: string,
  messages: Messages
}

export interface WithLanguageProps {
  changeLanguage: ChangeLanguage
}



const contextData: ContextData = { changeLanguage: (language: string): boolean => false, locale: "en", messages: translations.en }
const { Provider, Consumer } = React.createContext(contextData)

class LanguageProvider extends React.Component<Props, State> {
  public state: State = {
    locale: "de",
    messages: translations.en,
  }

  constructor(props: Props) {
    super(props)

    const { defaultLocale: locale } = props

    // DO some better locale management
    const WithoutRegionCode = locale.toLowerCase().split(/[_-]+/)[0]


    // const messages = translations[WithoutRegionCode] || translations[locale] || translations.en
    const messages = translations.de

    let extraMessages: Messages = {}
    if(props.additionalTranlations) {
      //@ts-ignore
      props.additionalTranlations.map(e => extraMessages[e.TextKey] = e["de".toUpperCase()].replace(/(?:\r\n|\r|\n)/g, '{br}'))
    }

    this.state.locale = WithoutRegionCode

    this.state.messages = { ...messages, ...extraMessages}
  }


  componentWillReceiveProps(props: Props) {
    let extraMessages: Messages = {}
    if(props.additionalTranlations) {
      // Makes newline visible
      //@ts-ignore
      props.additionalTranlations.map(e => extraMessages[e.TextKey] = e["de".toUpperCase().replace(/(?:\r\n|\r|\n)/g, '{br}')])
    }

    const messages = translations.de

    this.setState({messages: { ...extraMessages, ...messages,  }})
  }

  // you must specify what you’re adding to the context
  public changeLanguage = (language: string) => {
    this.setState({ messages: translations[language] })
  }

  public render() {
     const { locale, messages } = this.state
    // `Children.only` enables us not to add a <div /> for nothing
    // return React.Children.only()

    return (
      <Provider value={{ changeLanguage: this.changeLanguage, locale, messages }}>
        <IntlProvider
          locale={locale}
          messages={messages}
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
