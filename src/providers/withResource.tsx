import * as React from 'react'
import { IResource } from '../interfaces/IResource';
import { ICompany } from '../interfaces/ICompany';
import ResourceService from '../services/ResourceService';
import Loading from '../components/Loading';
import Login from '../components/Login';
// import { get, set } from 'idb-keyval'
import { LanguageProvider } from '../providers/withLanguage'
import SelectCompany from '../components/SelectCompany';
import Wrapper from '../components/Form/Wrapper';

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
      const companyIdString = localStorage.getItem("selectedCompany")
      const companyId = parseInt(companyIdString ? companyIdString : "")

      if (!isNaN(companyId)) {
        const selectedCompany = resource.CurrentCompanies.find(company => company.CompanyId === companyId)

        if (selectedCompany) {
          this.setState({ selectedCompany })
        }
      } else if (resource.CurrentCompanies.length === 1) {
        this.selectCompany(resource.CurrentCompanies[0])
      }

      this.setState({ resource, loggedIn: true })
    }).catch(() => {
      this.setState({
        loggedIn: false,
      })
    })

    this.setState({resourceAwait})
  }


  selectCompany = (selectedCompany: ICompany) => {
    localStorage.setItem("selectedCompany", selectedCompany.CompanyId.toString())

    this.setState({selectedCompany})
  }


  handleLoginSuccess = () => {
    this.componentDidMount()
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

    if(loggedIn && resource) {
      if(selectedCompany) {
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
          <Wrapper initialLoading={resourceAwait}>
            <SelectCompany companies={resource.CurrentCompanies} onSelect={this.selectCompany} />
          </Wrapper>
        )
      }
    } else {
      return (
        <LanguageProvider defaultLocale={locale}>
          <Loading await={resourceAwait} size={80}>
            <Login onLoginSuccess={this.handleLoginSuccess} />
          </Loading>
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
