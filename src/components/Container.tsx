import CssBaseline from "@material-ui/core/CssBaseline"
import { createMuiTheme, MuiThemeProvider, responsiveFontSizes } from "@material-ui/core/styles"
import * as React from "react"
// import { HashRouter } from 'react-router-dom'
// import { ResourceProvider } from 'providers/withResource';

import { ResourceProvider } from "../providers/withResource"
import configureStore from "../store"
import { createHashHistory } from "history"
import { ConnectedRouter } from "connected-react-router"
import { Provider } from "react-redux"
import { LanguageChanged, setupI18n } from "../i18n/setupi18next"
import { I18nextProvider } from "react-i18next"


// A theme with custom primary and secondary color.
// It's optional.

let theme = createMuiTheme({
  palette: {
    primary: {
      light: "#18ABE4",
      main: "#1D6A98",
      dark: "#1F4972",
      contrastText: "#FFFFFF",
    },
  },
  overrides: {
    MuiFormControl: { // Name of the component ⚛️ / style sheet
      root: { // Name of the rule
        width: "100%"
      },
    },
    MuiTabs: {
      root: {
        minHeight: "auto"
      }
    },
    MuiTab: {
      root: {
        minHeight: "auto",
        textTransform: "none",
      }
    },
  },
})

theme = responsiveFontSizes(theme)

export default function Container(props: {children: React.ReactNode}){
  const {children} = props

  const history = createHashHistory({
    hashType: "slash",
    getUserConfirmation: (message, callback) => callback(window.confirm(message))
  })

  // Get the application-wide store instance, prepopulating with state from the server where available.
  const store = configureStore(history)

  const i18n = setupI18n()

  return (
    <Provider store={store} >
      <I18nextProvider i18n={i18n}>
        <LanguageChanged />
        <MuiThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <ResourceProvider>
            <ConnectedRouter history={history}>
              {children}
            </ConnectedRouter>

            {/* <HashRouter basename={process.env.PUBLIC_URL}> */}
            {/* <BrowserRouter basename={process.env.PUBLIC_URL}> */}
            {/* <Component {...props} /> */}
            {/* </BrowserRouter> */}
            {/* </HashRouter> */}
          </ResourceProvider>
        </MuiThemeProvider>
      </I18nextProvider>
    </Provider>
  )
}
