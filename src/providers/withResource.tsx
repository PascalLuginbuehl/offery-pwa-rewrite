import * as React from 'react'
import { IResource } from '../interfaces/IResource';
import { ICompany } from '../interfaces/ICompany';
import ResourceService from '../services/ResourceService';
import Loading from '../components/Loading';
import Login from '../components/Login';
// import { get, set } from 'idb-keyval'
import { LanguageProvider } from '../providers/withLanguage'

interface Props {

}

interface State {
  resource: IResource | null
  selectedCompany: ICompany | null
  resourceAwait: Promise<IResource> | null
  loggedIn: boolean
}

interface ContextData {
  resource: IResource | null
  selectedCompany: ICompany | null
}

export interface WithResourceProps {
  resource: IResource
  selectedCompany: ICompany
}

const contextData: ContextData = { resource: null, selectedCompany: null }
const { Provider, Consumer } = React.createContext(contextData)

export class ResourceProvider extends React.Component<Props, State> {
  public state: State = {
    resource: null,
    selectedCompany: null,
    resourceAwait: null,
    loggedIn: false,
  }

  componentDidMount() {
    const resourceAwait = ResourceService.fetchResourceWithOffline()

    resourceAwait.then((resource) => {
      // Select company
      // if (resource.CurrentCompanies.length > 1) {
      //   const companyIdString = localStorage.getItem("selectedCompany")
      //   const companyId = parseInt(companyIdString ? companyIdString : "")

      //   if (!isNaN(companyId)) {
      //     const selectedCompany = resource.CurrentCompanies.find(company => company.CompanyId === companyId)
      //     if (selectedCompany) {
      //       return this.setState({ selectedCompany, resource })
      //     }
      //   }
      // }

      const selectedCompany = resource.CurrentCompanies[0]
      // localStorage.setItem("selectedCompany", selectedCompany.CompanyId.toString())

      if (selectedCompany) {
        this.setState({ resource, selectedCompany: selectedCompany, loggedIn: true })
      }

    }).catch(() => {
      this.setState({
        loggedIn: false,
      })
    })

    return resourceAwait
  }


  handleLoginSuccess = () => {
    this.setState({ loggedIn: true, resourceAwait: this.componentDidMount()})
  }

  public render() {
    const { resource, selectedCompany, resourceAwait, loggedIn } = this.state

    // setLocale(newLocale) {
    //   localStorage.setItem("PIKETT_TOOL_MOBILE_LOCALE", newLocale)

    //   this.setState(this.getLocaleItems(newLocale))
    // }

    // @ts-ignore Sets locale acording to local storage
    const locale = localStorage.getItem("PIKETT_TOOL_MOBILE_LOCALE") || navigator.s && navigator.s[0] || navigator.language || navigator.user


    // this.state = this.getLocaleItems(newLocale)
    // window.changeThis =
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.

    const texts = resource ? resource.Texts : []

    if(loggedIn) {
      return (
      <LanguageProvider defaultLocale={locale} additionalTranlations={texts}>
        <Loading await={resourceAwait} size={80}>
          <Provider value={{ resource, selectedCompany }}>
            {this.props.children}
          </Provider>
        </Loading>
      </LanguageProvider>
    )
    } else {
      return (
        <LanguageProvider defaultLocale={locale}>
          <Login onLoginSuccess={this.handleLoginSuccess} />
        </LanguageProvider>
        )
      }
    }
  }

function withResource<P>(Component: React.ComponentType<P & WithResourceProps>) {
  function WithRoot(props: Pick<P, Exclude<keyof P, keyof WithResourceProps>>) {
    return (
      <Consumer>
        {state =>
          // @ts-ignore
          <Component {...props} resource={state.resource} selectedCompany={state.selectedCompany} />
        }
      </Consumer>
    )
  }

  return WithRoot
}

export { withResource }
