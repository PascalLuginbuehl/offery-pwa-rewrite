import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, ListSubheader, Collapse } from '@material-ui/core'
import { IPostLead, emptyLead, ILead } from '../interfaces/ILead';
import IntlTypography from '../components/IntlTypography';
import ValidatedDateTimePicker from '../components/Validator/ValidatedDateTimePicker';
import { handleChangeFunction } from '../components/Validator/HandleChangeFunction';
import Wrapper from '../components/Form/Wrapper';
import { get, set } from 'idb-keyval'
import { IMoveOutBuilding } from '../interfaces/IBuilding';
import BuildingService from '../services/BuildingService';
import { RouteComponentProps, Route } from 'react-router';
import LeadService from '../services/LeadService';
import Customer from './Customer';
import Loading from '../components/Loading';
import MoveOutBuilding from './Customer/MoveOutBuilding';
import { FormattedMessage } from 'react-intl';
import NavItem from '../components/Navigation/NavItem';


export interface ILeadContainer {
  lastUpdated: Date
  onlySavedOffline: boolean

  Lead: ILead | null

  moveOut: IMoveOutBuilding | null
}

interface State extends ILeadContainer {
  initialAwait: Promise<any> | null
  leadId: number | null
  loadedFromOffline: boolean
}

interface Props extends RouteComponentProps<{ id?: string }> {
  portal: HTMLDivElement | null
}

class Lead extends Component<Props, State> {
  state: State = { lastUpdated: new Date(), Lead: null, moveOut: null, initialAwait: null, leadId: null, onlySavedOffline: false, loadedFromOffline: true}

  public handleChange = handleChangeFunction<State>(this)

  async componentDidMount() {
    const idString = this.props.match.params.id
    const potentialLeadId = parseInt(idString ? idString : "")

    if (!isNaN(potentialLeadId)) {

      this.setState({initialAwait: this.loadFromOfflineOrOnline(potentialLeadId)})
    } else {
      console.log("Is not a leadId", potentialLeadId)
      throw Error("Did not find a lead")
    }
  }

  loadFromOfflineOrOnline = (potentialLeadId: number): Promise<void> => {
    return new Promise(async(resolve, reject) => {

      const offline = await this.FetchFromOffline(potentialLeadId)
      if (offline && offline.onlySavedOffline) {
        try {
          await this.SaveToApi(potentialLeadId, offline)

          // Removed onlySavedOfflineProperty
          await this.SaveToOffline(potentialLeadId, { ...offline, onlySavedOffline: false })
          this.setState({ ...offline, onlySavedOffline: false, leadId: potentialLeadId, loadedFromOffline: true })
          resolve()
        } catch (e) {
          this.setState({ ...offline, onlySavedOffline: false, leadId: potentialLeadId, loadedFromOffline: true })
          resolve()
        }

      } else {
        const promiseOnline = this.FetchFromOnline(potentialLeadId)

        this.setState({ initialAwait: promiseOnline })
        const lead = await promiseOnline

        this.setState({ ...lead, leadId: potentialLeadId, loadedFromOffline: false })

        await this.SaveToOffline(potentialLeadId, lead)

        resolve()
      }
    })

  }

  // Can NOT CREATE!

  // Only gets called to save into Offline Storage
  FetchFromOnline(leadId: number): Promise<ILeadContainer> {
    return Promise.all([
      LeadService.fetchCustomer(leadId),
      BuildingService.fetchMoveOutBuilding(leadId),
    ]).then(([Lead, moveOut]): ILeadContainer => ({
      lastUpdated: new Date(),
      Lead,
      moveOut,
      onlySavedOffline: false,
    }))
  }

  // Gets Called to Get Data From Offline
  FetchFromOffline = (leadId: number): Promise<ILeadContainer> => {
    return get(leadId)
  }

  // Saves it in Offline Storage
  SaveToOffline = (leadId: number, lead: ILeadContainer) => {
    return set(leadId, lead)
  }

  // Checks if data changed on the API side from first Fetch
  CheckAgainstAPI() {

  }

  // Sends all new Data to the API
  SaveToApi = (leadId: number, container: ILeadContainer): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {

      const { Lead, moveOut } = container
      if(Lead && moveOut && leadId) {
        try {
          await Promise.all([
            LeadService.saveCustomer(Lead),
            BuildingService.saveMoveOutBuilding(moveOut, leadId),
          ])

          console.log("Test")
          resolve()
        } catch(e) {
          console.log("Offline error?", e)
          console.dir(e)
          if (e) { // If offline
            // Check error message
            try {
              await this.SaveToOffline(leadId, { ...container, onlySavedOffline: true })
              this.setState({ onlySavedOffline: true})
              console.log("saved to offline")
              resolve()
            } catch (e) {
              console.log("couldn't save offline", e)
              reject("couldn't save offline")
            }
          }
        }
      }
    })
  }

  Save = (): Promise<void> => {
    const {leadId, initialAwait, ...lead} = this.state
    if(leadId) {

      return this.SaveToApi(leadId, lead)
    }

    return Promise.reject()
  }

  public render() {
    const { Lead, moveOut, initialAwait, onlySavedOffline, loadedFromOffline } = this.state
    const { match, portal } = this.props

    return (
      <>
        <Wrapper initialLoading={initialAwait}>
          {onlySavedOffline ? "Saved in cache, not saved Online!" : null}
          {loadedFromOffline ? "Loaed from cahce" : null}
          {
            Lead != null ?
            <>
              <Route path={`${match.url}/customer`} render={(routeProps) => <Customer {...routeProps} data={Lead} onChange={(data) => this.handleChange(data, "Lead")} save={this.Save} />} />
              <Route path={`${match.url}/move-out`} render={(routeProps) => moveOut ? <MoveOutBuilding {...routeProps} data={moveOut} onChange={(data) => this.handleChange(data, "moveOut")} save={this.Save} /> : "No move out"} />
            </>
            :
              "No Lead found"
          }
        </Wrapper>

        {/* Navigation */}
        {portal ? ReactDOM.createPortal(<>
          <ListSubheader><FormattedMessage id="EDIT_LEAD" /></ListSubheader>

          <NavItem to={`${match.url}/customer`} title="CUSTOMER">
            <Collapse in={true}><NavItem to={`${match.url}/building/move-out`} title="MOVE_OUT_BUILDING" nested /></Collapse>
            {/* {lead ? (
              <>
                <Collapse in={lead.HasMoveOutBuilding}><NavItem to={`${match.url}/building/move-out`} title="MOVE_OUT_BUILDING" nested /></Collapse>
                <Collapse in={lead.HasMoveInBuilding}><NavItem to={`${match.url}/building/move-in`} title="MOVE_IN_BUILDING" nested /></Collapse>
                <Collapse in={lead.HasStorageInBuilding}><NavItem to={`${match.url}/building/storage`} title="STORAGE_BUILDING" nested /></Collapse>
                <Collapse in={lead.HasDisposalOutBuilding}><NavItem to={`${match.url}/building/disposal`} title="DISPOSAL_BUILDING" nested /></Collapse>
                <Collapse in={lead.HasCleaningBuilding}><NavItem to={`${match.url}/building/cleaning`} title="CLEANING_BUILDING" nested /></Collapse>
                <NavItem to={`${match.url}/email-confirmation`} title="EMAIL_CONFIRMATION" nested />
              </>
            ) : null} */}
            {/* */}
          </NavItem>
          <NavItem to={"lead/" + match.params.id + "/service"} title="SERVICES" />
        </>, portal) : null}
      </>
    )
  }
}

export default Lead
