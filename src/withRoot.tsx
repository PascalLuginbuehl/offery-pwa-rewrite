
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import * as React from 'react'
// import { HashRouter } from 'react-router-dom'
// import { ResourceProvider } from 'providers/withResource';
import { HashRouter } from 'react-router-dom';
import { ResourceProvider } from './providers/withResource';

// A theme with custom primary and secondary color.
// It's optional.

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },

  overrides: {
    MuiFormControl: { // Name of the component ⚛️ / style sheet
      root: { // Name of the rule
        width: "100%"
      },
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
