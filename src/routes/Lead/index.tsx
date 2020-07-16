import React, { Component } from "react"
import Wrapper from "../../components/Form/Wrapper"
import { RouteComponentProps, Route } from "react-router"
import LeadService from "../../services/LeadService"
import LeadAPI, { ILeadContainer } from "./LeadAPI"
import { emptyLead,   IPostLead } from "../../interfaces/ILead"
import { withResource, WithResourceProps } from "../../providers/withResource"
import NewCustomer from "./Customer"
import LeadPageOrder from "./CombinedRoutes/LeadPageOrder"
import BuildingRoutes from "./CombinedRoutes/BuildingRoutes"
import ServiceRoutes from "./CombinedRoutes/ServiceRoutes"
import ConditionRoutes from "./CombinedRoutes/ConditionRoutes"
import Navigation from "./CombinedRoutes/Navigation"
import ReactDOM from "react-dom"
import LeadOverview from "./LeadOverview"

import { diff } from "deep-object-diff"
import {   DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions, Button,  CircularProgress, Backdrop, Theme, Breadcrumbs, Link, Typography } from "@material-ui/core"
import IntlTypography from "../../components/Intl/IntlTypography"
import { FormattedMessage } from "react-intl"
import differenceInDays from "date-fns/differenceInDays"
import { withStyles, createStyles, WithStyles } from "@material-ui/styles"
import { red } from "@material-ui/core/colors"

const styles = (theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
})

interface State {
  container: ILeadContainer | null

  initialAwait: Promise<any> | null
  OfflineConflict: {[key: string]: any} | null
  offlineSyncInProgress: boolean
}

interface Props extends RouteComponentProps<{ id?: string }>, WithResourceProps, WithStyles<typeof styles> {
  portal: HTMLDivElement | null

  offline: boolean
  onOfflineChange: (offline: boolean) => void
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

    const ignoreLeadKeys = [
      "Created",
      "Status",
      "FromAddress",
      "ToAddress",
      "StatusHistories",
      "AppointmentReminders",
      "Offers",
      "ConfirmedOrderVerbal",
      "ConfirmedOrder",
      "ConfirmedOffer"
    ]

    // console.log(key)
    // console.log(Object.keys(difference))

    // Special filter for keys that get change magically by the backend
    const differenceKeys = key === "Lead" ? Object.keys(difference).filter(key => ignoreLeadKeys.find(key2 => key == key2) === undefined) : Object.keys(difference)

    return differenceKeys.length !== 0
  })
}

class Lead extends Component<Props, State> {
  state: State = {
    container: null,
    OfflineConflict: null,
    initialAwait: null,
    offlineSyncInProgress: false
  }

  public handleChange = (value: any, target: keyof ILeadContainer) => {
    const { container } = this.state
    if (container) {
      this.setState({ container: { ...container, [target]: value } })
    }
  }

  public handleChangeAndSave = async (value: any, name: keyof ILeadContainer, savePromise: () => Promise<any>) => {
    const { container } = this.state
    const { offline } = this.props

    if (container) {
      const { Lead } = container

      if (offline) {
        this.handleChange(value, name)

        const newContainer = {
          ...container,
          [name]: value
        }

        await LeadAPI.SaveToChangesToOffline(newContainer)

        return
      }

      try {
        // TODO get Repsone and save into container here
        // else this will stay outdated : (

        // Save instantly
        const response = await savePromise()
        this.handleChange(response, name)

        // saveWasSuccessFull, update offlineOrigin and offline
        await LeadAPI.SaveOriginToOffline({...container, [name]: response})

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

    return
  }

  componentDidUpdate(prevProps: Props) {
    // Close Navigation on Navigate

    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.componentDidMount()
    }

    if (this.props.offline !== prevProps.offline) {
      if (!this.props.offline && this.state.container) {
        this.loadLead(this.state.container.Lead.LeadId)
      }
    }
  }

  saveDifferencesToOnline = async (leadId: number, onlineState: ILeadContainer, offlineChanges: ILeadContainer, overrideOnline?: boolean) => {
    let offlineOrigin = await LeadAPI.FetchFromOfflineOrigin(leadId)

    if (!offlineOrigin) {
      throw new Error("No Origin was ever defined. Fatal Error")
    }

    // This makes so everything in changes that is not online gets overwritten
    if (overrideOnline) {
      offlineOrigin = onlineState
      console.log("I will now override the online store")
    }

    this.setState({ offlineSyncInProgress: true })

    // only compare keys that are relevant. No Server keys
    // var IMyTable: Array<keyof IMyTable> = ["id", "title", "createdAt", "isDeleted"];

    // Get differences origin and changes
    // Primitive comparison. extend l8er
    const changesWhileOffline = getContainerDiffKeys(offlineOrigin, offlineChanges)
    console.log(getContainerDiffKeys)

    // Get differnces origin and API
    const whileOfflineAPIChanges = getContainerDiffKeys(offlineOrigin, onlineState)
    console.log(offlineOrigin, onlineState)

    // FInd instances in which offline also deffered from last cache
    const bothChangedSameAPI = whileOfflineAPIChanges.filter(apiOffline => changesWhileOffline.findIndex(e => apiOffline === e) !== -1)

    if (bothChangedSameAPI.length > 0) {

      this.setState({ OfflineConflict:
        {
          // @ts-ignore offlineOrigin cannnot be null
          offlineOrigin: bothChangedSameAPI.map(key => offlineOrigin[key]),
          onlineState: bothChangedSameAPI.map(key => onlineState[key]),
          offlineChanges: bothChangedSameAPI.map(key => offlineChanges[key]),
        }
      })

      this.setState({ offlineSyncInProgress: false })
      throw "Offline Changed"
    }

    // Send this to API Here
    const { Lead, moveService, packService, storageService, disposalService, cleaningService, inventory, materialOrder, buildings } = offlineChanges
    const changeArray: {[key in keyof ILeadContainer]: () => Promise<any>} = {
      lastUpdated: () => Promise.resolve(),
      Lead: () => LeadAPI.SaveLead(offlineChanges.Lead),
      materialOrder: () => LeadAPI.SaveMaterialOrderService(leadId, materialOrder),
      inventory: () => LeadAPI.SaveInventoryService(leadId, inventory),
      moveService: () => LeadAPI.SaveMoveService(leadId, moveService),
      packService: () => LeadAPI.SavePackService(leadId, packService),
      storageService: () => LeadAPI.SaveStorageService(leadId, storageService),
      disposalService: () => LeadAPI.SaveDisposalService(leadId, disposalService),
      cleaningService: () => LeadAPI.SaveCleaningService(leadId, cleaningService),
      buildings: () => LeadAPI.SaveBuildings(leadId, buildings)
    }

    try {
      const { container } = this.state
      if (!container) {
        throw new Error("Container not defined yet. Quite random :(")
      }

      const containerClone = { ...container }

      const sleep = (promise: any, index: number) => new Promise((resolve, reject) => {
        const wait = setTimeout(() => {
          //@ts-ignore
          promise().then(e => resolve(e)).catch(e => reject(e))
        }, 500 * index)
      })

      await Promise.all(
        changesWhileOffline.map((key, index) => sleep(changeArray[key], index)
          .then((e) => {
            //@ts-ignore
            containerClone[key] = e
          })
        )
      )

      console.log("oldContainer/offlineContainer", container)
      console.log("overriddenContainer", containerClone)

      console.log("changesWhileOffline", changesWhileOffline)
      console.log("whileOfflineAPIChanges", whileOfflineAPIChanges)

      // CLear changes
      await LeadAPI.RemoveChangesFromOffline(leadId)

      // Updating for offline origin with current container
      await LeadAPI.SaveOriginToOffline(containerClone)
      this.setState({ container: containerClone, offlineSyncInProgress: false})

    } catch (e) {

      // TODO: add more Error handling here
      console.log(e)
      this.setState({ offlineSyncInProgress: false })

      throw new Error("Could not save")
    }

    return
  }

  overrideWithOfflineChanges = async () => {
    const leadId = this.state.container?.Lead.LeadId

    if (!leadId) {
      throw new Error("No lead id")
    }

    const offlineChanges = await LeadAPI.FetchFromOfflineChanges(leadId)

    if (!offlineChanges) {
      throw new Error("No offlineChanges left :(")
    }

    const onlineAPIContainer = await this.fetchLeadOnline(leadId)

    await this.saveDifferencesToOnline(leadId, onlineAPIContainer, offlineChanges, true)

    this.setState({ OfflineConflict: null })
  }

  dontOverrideOnlineWithOfflineChanges = async () => {
    const leadId = this.state.container?.Lead.LeadId

    if (!leadId) {
      throw new Error("No lead id")
    }

    // CLear changes
    await LeadAPI.RemoveChangesFromOffline(leadId)

    // COntainer set to null for reainizliationzt
    this.setState({ OfflineConflict: null, container: null })

    await this.loadLead(leadId)
  }

  loadLead = async (leadId: number) => {
    const offlineChanges = await LeadAPI.FetchFromOfflineChanges(leadId)
    let onlineAPIContainer = null

    let { offline } = this.props

    try {
      onlineAPIContainer = await this.fetchLeadOnline(leadId)
    } catch (e) {
      offline = true
      this.props.onOfflineChange(true)
    }

    // Data got changed while was offline
    if (offlineChanges) {

      // Try to save. when still online  load from offline origin
      if (!offline && onlineAPIContainer) {
        try {
          // Only set when succeeds
          await this.saveDifferencesToOnline(leadId, onlineAPIContainer, offlineChanges)
          this.setState({ container: offlineChanges })
        } catch (e) {
          this.setState({ container: offlineChanges })
        }
      }

      // #FIXME include onliune state
    } else {
      // No changes, override
      if (onlineAPIContainer) {
        await LeadAPI.SaveOriginToOffline(onlineAPIContainer)
        this.setState({ container: onlineAPIContainer })
        console.log("Updated Container")
      } else {
        if (offline) {
          const offlineOrigin = await LeadAPI.FetchFromOfflineOrigin(leadId)

          if (offlineOrigin) {
            differenceInDays(offlineOrigin.lastUpdated, new Date())
            this.setState({ container: offlineOrigin })
          }
        }

      }
    }

    return
  }

  componentDidMount() {

    // const offlineString = localStorage.getItem("offline")
    // let offline = false
    // if (offlineString) {
    // offline = JSON.parse(offlineString)
    // }

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

  fetchLeadOnline = async (potentialLeadId: number): Promise<ILeadContainer> => {
    const lead = await LeadAPI.FetchFromOnline(potentialLeadId)

    return lead
  }

  public render() {
    const { initialAwait, container } = this.state
    const { match, portal } = this.props

    return (
      <>
        <Wrapper initialLoading={initialAwait}>
          {this.renderLead()}
        </Wrapper>
        {portal && container ? ReactDOM.createPortal(<Navigation leadContainer={container} matchUrl={match.url} portal={portal} />, portal) : null}
      </>
    )
  }

  renderLead = () => {
    const { match, portal, offline, classes } = this.props
    const { container, offlineSyncInProgress } = this.state

    // Create New Lead
    if (match.params.id === "new" && container === null) {
      return (
        <NewCustomer
          lead={emptyLead}
          onChangeAndSave={lead => {
            return this.createLead(lead)
          }}
          nextPage={this.redirectToNextPage("/customer")}
        />
      )
    } else if (container) {
      return (
        <>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/getting-started/installation/">
              Lead
            </Link>
            <Typography color="textPrimary">{container.Lead.Customer.Firstname} {container.Lead.Customer.Lastname}</Typography>
          </Breadcrumbs>

          <Backdrop className={classes.backdrop} open={offlineSyncInProgress}>
            <div style={{textAlign: "center"}}>
              <IntlTypography variant="h4" style={{color: "white"}}>OFFLINE_SYNC_IN_PROGRESS</IntlTypography>
              <br />
              <CircularProgress color="inherit" />
            </div>
          </Backdrop>

          {/* Move-Out */}
          <Route
            exact
            path={`${match.url}/`}
            render={routeProps => (
              <LeadOverview
                {...routeProps}
                offline={offline}
                leadContainer={container}
                handleChangeAndSave={this.handleChangeAndSave}
              />
            )}
          />

          <BuildingRoutes
            offline={offline}
            handleChange={this.handleChange}
            leadContainer={container}
            matchUrl={match.url}
            handleChangeAndSave={this.handleChangeAndSave}
            redirectToNextPage={this.redirectToNextPage}
          />

          <ServiceRoutes leadContainer={container} matchUrl={match.url} handleChangeAndSave={this.handleChangeAndSave} redirectToNextPage={this.redirectToNextPage} />

          <ConditionRoutes
            offline={offline}
            handleChange={this.handleChange}
            getNextPage={this.getNextPage}
            leadContainer={container}
            matchUrl={match.url}
            handleChangeAndSave={this.handleChangeAndSave}
            redirectToNextPage={this.redirectToNextPage}
          />

          <Dialog
            open={!!this.state.OfflineConflict}
            onClose={() => this.setState({OfflineConflict: null})}
          >
            <DialogTitle>
              <FormattedMessage id="CONFLICTS_WHILE_SAVING" />
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <FormattedMessage id="CONFLICTS_WHILE_SAVING_SELECTVERSION" />
              </DialogContentText>
              <details>
                {JSON.stringify(this.state.OfflineConflict)}
              </details>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.dontOverrideOnlineWithOfflineChanges()} style={{color: red[500]}}>
                <FormattedMessage id="REMOVE_OFFLINE_CHANGES" />
              </Button>
              <Button onClick={() => this.overrideWithOfflineChanges()} color="primary">
                <FormattedMessage id="OVERRIDE" />
              </Button>
            </DialogActions>
          </Dialog>
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

      // Set Container lead tempo
      await this.loadLead(lead.LeadId)

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
      const order = LeadPageOrder(container)

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

export default withStyles(styles)(withResource(Lead))
