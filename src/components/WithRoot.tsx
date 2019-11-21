
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import * as React from 'react'
// import { HashRouter } from 'react-router-dom'
// import { ResourceProvider } from 'providers/withResource';
import { HashRouter } from 'react-router-dom';
import { ResourceProvider } from '../providers/withResource';

// A theme with custom primary and secondary color.
// It's optional.

const theme = createMuiTheme({
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

// import * as enLocale from 'date-fns/locale/en-US'
function withRoot<P>(Component: React.ComponentType<P>) {
  function WithRoot(props: P) {
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <ResourceProvider>
          <HashRouter>
            <Component {...props} />
          </HashRouter>

          {/* <HashRouter basename={process.env.PUBLIC_URL}> */}
          {/* <BrowserRouter basename={process.env.PUBLIC_URL}> */}
            {/* <Component {...props} /> */}
          {/* </BrowserRouter> */}
          {/* </HashRouter> */}
        </ResourceProvider>
      </MuiThemeProvider>
    )
  }

  return WithRoot
}

export default withRoot
