import React, { Component } from 'react';
import { Grid } from '@material-ui/core'
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


export interface ILeadContainer {
  lastUpdated: Date
  onlySavedOffline: boolean

  Lead: ILead | null

  moveOut: IMoveOutBuilding | null
}

interface State extends ILeadContainer {
  initialAwait: Promise<any> | null
  leadId: number | null
}

interface Props extends RouteComponentProps<{ id?: string }> {

}

class Lead extends Component<Props, State> {
  state: State = { lastUpdated: new Date(), Lead: null, moveOut: null, initialAwait: null, leadId: null, onlySavedOffline: false}

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
          this.setState({ ...offline, onlySavedOffline: false, leadId: potentialLeadId })
          resolve()
        } catch (e) {
          this.setState({ ...offline, onlySavedOffline: false, leadId: potentialLeadId })
          resolve()
        }

      } else {
        const promiseOnline = this.FetchFromOnline(potentialLeadId)

        this.setState({ initialAwait: promiseOnline })
        const lead = await promiseOnline

        this.setState({ ...lead, leadId: potentialLeadId })

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
      onlySavedOffline: false
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
    const { Lead, moveOut, initialAwait } = this.state
    const { match } = this.props

    return (
        <Wrapper initialLoading={initialAwait}>
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
    )
  }
}

export default Lead
