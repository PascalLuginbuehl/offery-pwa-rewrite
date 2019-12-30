import React, { Component } from "react"
import Wrapper from "../../components/Form/Wrapper"
import { RouteComponentProps, Route, Redirect } from "react-router"
import LeadService from "../../services/LeadService"
import LeadAPI, { ILeadContainer } from "./LeadAPI"
import { emptyLead, ILead, IPutLead, IPostLead } from "../../interfaces/ILead"
import { withResource, WithResourceProps } from "../../providers/withResource"
import NewCustomer from "./Customer"
import LeadPageOrder from "./CombinedRoutes/LeadPageOrder"
import BuildingRoutes from "./CombinedRoutes/BuildingRoutes"
import ServiceRoutes from "./CombinedRoutes/ServiceRoutes"
import ConditionRoutes from "./CombinedRoutes/ConditionRoutes"
import Navigation from "./CombinedRoutes/Navigation"
import ReactDOM from "react-dom"
import LeadOverview from "./LeadOverview"
import IntlTooltip from "../../components/Intl/IntlTooltip"
import CloudUploadIcon from "@material-ui/icons/CloudUpload"
import OfflinePinIcon from "@material-ui/icons/OfflinePin"

interface State {
  container: ILeadContainer | null

  initialAwait: Promise<any> | null

  offline: boolean
}

interface Props extends RouteComponentProps<{ id?: string }>, WithResourceProps {
  portal: HTMLDivElement | null
  closeNavigation: () => void
}

class Lead extends Component<Props, State> {
  state: State = {
    container: null,

    initialAwait: null,

    offline: false,
  }

  public handleChange = (value: any, target: keyof ILeadContainer) => {
    const { container } = this.state
    if (container) {
      this.setState({ container: { ...container, [target]: value } })
    }
  }

  public handleChangeAndSave = async (value: any, name: keyof ILeadContainer, savePromise: Promise<any>) => {
    const { container } = this.state

    if (container) {
      const { Lead } = container

      try {
        await savePromise
        this.handleChange(value, name)
        // saveWasSuccessFull, update offlineOrigin and offline
      } catch (e) {
        // Check if it is an offline error
        if (e.message === "Failed to fetch") {
          // Save to offline, not to origin
          try {
            console.log("Saved to offline storage")

            LeadAPI.SaveToOffline(Lead.LeadId, { ...container, onlySavedOffline: true })

            // this.setState({ onlySavedOffline: true })

            return
          } catch (e) {
            console.log("Couldn't save offline", e)
            throw { message: "Couldn't save offline", error: e }
          }
        } else {
          console.log("Error while saving:", e)
          throw e
        }
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Close Navigation on Navigate

    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.componentDidMount()
    }

    if (this.props.location !== prevProps.location) {
      this.props.closeNavigation()
    }
  }

  componentDidMount() {
    const fetch = async () => {
      const idString = this.props.match.params.id
      const potentialLeadId = parseInt(idString ? idString : "")

      if (idString === "new") {
        // Do nothing if sting new
        return
      } else if (!isNaN(potentialLeadId)) {
        const offline = await LeadAPI.FetchFromOffline(potentialLeadId)

        if (offline && offline.onlySavedOffline) {
          // Save to online and then fetch

          await this.saveOfflineToOnline(potentialLeadId, offline)
        } else {
          await this.loadFromOnline(potentialLeadId)

          this.setState({})
        }
      } else {
        console.log("Is not a leadId", potentialLeadId)
      }
    }

    this.setState({ initialAwait: fetch() })
  }

  saveOfflineToOnline = async (potentialLeadId: number, offlineLead: ILeadContainer) => {
    try {
      // await LeadAPI.SaveToApi(potentialLeadId, offlineLead)

      try {
        await this.loadFromOnline(potentialLeadId)
      } catch (e) {
        console.log("Saving success but loading failed")
        console.dir(e)

        this.setState({ container: offlineLead })
      }
    } catch (e) {
      if (e.message == "Failed to fetch") {
        console.log("Still not online to reupload")

        this.setState({ container: offlineLead })
      }
    }
  }

  loadFromOnline = async (potentialLeadId: number) => {
    const promiseOnline = LeadAPI.FetchFromOnline(potentialLeadId)

    const lead = await promiseOnline

    this.setState({ container: lead })

    await LeadAPI.SaveToOffline(potentialLeadId, lead)
    return
  }

  redirectToNextPage = (currentPage: string) => (stringAddition = "") => {
    const { container } = this.state
    if (container) {
      const { Lead } = container

      const { history } = this.props

      const nextPage = this.getNextPage(currentPage)

      // Quickfix due to TS Lint error
      history.push("/lead/" + Lead.LeadId + nextPage + stringAddition)
    }
  }

  getNextPage = (current: string): string => {
    const { container } = this.state

    // Check if lead is even defined
    if (container) {
      const order = LeadPageOrder(container.Lead, container.Lead.Services)

      let lastPage = { name: "" }
      for (let index = 0; index < order.length; index++) {
        const potentialNextPage = order[index]

        if (lastPage.name === current) {
          if (potentialNextPage.active) {
            return potentialNextPage.name
          }
        } else {
          lastPage = potentialNextPage
        }
      }
    }

    return ""
  }

  createLead = async (createLead: IPostLead) => {
    try {
      // Save new Lead
      const lead = await LeadService.createCustomer(createLead, this.props.selectedCompany.CompanyId)

      // Navigate to page
      // Get Next page not correctyl implemented. Temporary. Needs to set leadId data First.
      this.props.history.replace("/lead/" + lead.LeadId + this.getNextPage("/building"))

      return
    } catch (e) {
      console.dir(e)
      throw e
    }
  }

  public render() {
    const { initialAwait, container, offline } = this.state
    const { match, portal } = this.props

    return (
      <>
        <Wrapper initialLoading={initialAwait}>

          {
            offline ?
              <CloudUploadIcon color="error" onClick={() => this.setState({ offline: !offline })} />
              :
              <OfflinePinIcon color="primary" onClick={() => this.setState({ offline: !offline })}/>
          }


          {this.renderLead()}
        </Wrapper>
        {portal && container ? ReactDOM.createPortal(<Navigation leadContainer={container} matchUrl={match.url} portal={portal} />, portal) : null}
      </>
    )
  }

  renderLead = () => {
    const { match, portal } = this.props
    const { container } = this.state

    console.log(portal)

    // Create New Lead
    if (match.params.id === "new" && container === null) {
      return (
        <NewCustomer
          lead={emptyLead}
          onChangeAndSave={lead => {
            return this.createLead(lead)
          }}
          nextPage={this.redirectToNextPage("/building")}
        />
      )
    } else if (container) {
      return (
        <>
          {/* Move-Out */}
          <Route
            exact
            path={`${match.url}/`}
            render={routeProps => (
              <LeadOverview
                {...routeProps}
                lead={container.Lead}
              />
            )}
          />

          <BuildingRoutes
            handleChange={this.handleChange}
            leadContainer={container}
            matchUrl={match.url}
            handleChangeAndSave={this.handleChangeAndSave}
            redirectToNextPage={this.redirectToNextPage}
          />

          <ServiceRoutes leadContainer={container} matchUrl={match.url} handleChangeAndSave={this.handleChangeAndSave} redirectToNextPage={this.redirectToNextPage} />

          <ConditionRoutes
            handleChange={this.handleChange}
            getNextPage={this.getNextPage}
            leadContainer={container}
            matchUrl={match.url}
            handleChangeAndSave={this.handleChangeAndSave}
            redirectToNextPage={this.redirectToNextPage}
          />
        </>
      )
    } else {
      return "No Lead found"
    }
  }
}

export default withResource(Lead)
