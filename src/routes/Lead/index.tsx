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
import { diff } from "deep-object-diff"

interface State {
  container: ILeadContainer | null

  initialAwait: Promise<any> | null

  offline: boolean
}

interface Props extends RouteComponentProps<{ id?: string }>, WithResourceProps {
  portal: HTMLDivElement | null
  closeNavigation: () => void
}

function getContainerDiffKeys(originContainer: ILeadContainer, changesContainer: ILeadContainer): Array<keyof ILeadContainer> {
  return (Object.keys(originContainer) as Array<keyof ILeadContainer>).filter((key) => {
    const field = originContainer[key]

    const test = changesContainer[key]

    if (field === null && test === null) {
      return false
    }

    if (test === null) {
      return true
    }

    if (field === null) {
      return true
    }

    const difference = diff(field, test)
    return Object.keys(difference).length !== 0
  })
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

  public handleChangeAndSave = async (value: any, name: keyof ILeadContainer, savePromise: () => Promise<any>) => {
    const { container, offline } = this.state

    if (container) {
      const { Lead } = container

      if (offline) {
        this.handleChange(value, name)

        const newContainer = {
          ...container,
          [name]: value
        }

        LeadAPI.SaveToChangesToOffline(newContainer)

        return
      }


      try {
        await savePromise()
        this.handleChange(value, name)
        // saveWasSuccessFull, update offlineOrigin and offline
      } catch (e) {
        // Check if it is an offline error
        if (e.message === "Failed to fetch") {
          // Save to offline, not to origin
          try {
            console.log("Saved to offline storage")

            // LeadAPI.SaveToOffline(Lead.LeadId, { ...container, onlySavedOffline: true })

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

  saveDifferences = async (leadId: number, onlineState: ILeadContainer, offlineChanges: ILeadContainer) => {
    const origin = await LeadAPI.FetchFromOfflineOrigin(leadId)

    if (!origin) {
      throw new Error("No Origin was ever defined. Fatal Error")
    }

    // Get differences origin and changes
    // Primitive comparison. extend l8er
    const changes = getContainerDiffKeys(origin, offlineChanges)
    console.log(changes)


    // Get differnces origin and API
    const whileOfflineAPIChanges = getContainerDiffKeys(origin, onlineState)
    console.log(whileOfflineAPIChanges)

    // Send this to API Here
    console.log("sending to API!!! (not implemented)")
  }

  loadLead = async (leadId: number) => {
    let { offline } = this.state
    // const offline = await LeadAPI.FetchFromOffline(potentialLeadId)

    // if (offline && offline.onlySavedOffline) {
    // Save to online and then fetch

    // await this.saveOfflineToOnline(potentialLeadId, offline)
    // } else {

    const possbileChanges = await LeadAPI.FetchFromOfflineChanges(leadId)
    let liveApiContainer = null
    try {
      liveApiContainer = await this.fetchLeadOnline(leadId)

    } catch (e) {
      offline = true
    }

    // Data got changed while was offline
    if (possbileChanges) {

      // Try to save. when still online  load from offline origin
      if (!offline && liveApiContainer) {
        this.saveDifferences(leadId, liveApiContainer, possbileChanges)
      }


      this.setState({ container: possbileChanges })

    } else {
      // No changes, override
      if (liveApiContainer) {
        this.saveLeadToOfflineOrigin(liveApiContainer)
        this.setState({ container: liveApiContainer })
      }
    }
  }

  componentDidMount() {
    const idString = this.props.match.params.id
    const potentialLeadId = parseInt(idString ? idString : "")

    if (idString === "new") {
      // Do nothing if sting new
      return

    } else if (!isNaN(potentialLeadId)) {

      this.setState({ initialAwait: this.loadLead(potentialLeadId)})
    } else {
      console.log("Is not a leadId", potentialLeadId)
    }

  }

  // This saves to Offline and Changes
  saveLeadToOfflineOrigin = (container: ILeadContainer) => {
    LeadAPI.SaveOriginToOffline(container)
  }

  // saveOfflineToOnline = async (potentialLeadId: number, offlineLead: ILeadContainer) => {
  //   try {
  //     // await LeadAPI.SaveToApi(potentialLeadId, offlineLead)

  //     try {
  //       await this.loadFromOnline(potentialLeadId)
  //     } catch (e) {
  //       console.log("Saving success but loading failed")
  //       console.dir(e)

  //       this.setState({ container: offlineLead })
  //     }
  //   } catch (e) {
  //     if (e.message == "Failed to fetch") {
  //       console.log("Still not online to reupload")

  //       this.setState({ container: offlineLead })
  //     }
  //   }
  // }

  fetchLeadOnline = async (potentialLeadId: number): Promise<ILeadContainer> => {
    const lead = await LeadAPI.FetchFromOnline(potentialLeadId)

    return lead
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

  // Not offline relevant functions
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
}

export default withResource(Lead)
