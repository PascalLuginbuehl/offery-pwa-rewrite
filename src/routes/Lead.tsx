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

  handleSubmit() {

  }

  async componentDidMount() {
    const idString = this.props.match.params.id
    const potentialLeadId = parseInt(idString ? idString : "")

    if (!isNaN(potentialLeadId)) {
      const promiseOffline = this.FetchFromOffline(potentialLeadId)
      // this.setState({initialAwait: promiseOffline})

      const offline = await promiseOffline

      // Check if 404 or no connection. Decide on whatever happened
      try {
        const promiseOnline = this.FetchFromOnline(potentialLeadId)

        this.setState({ initialAwait: promiseOnline })
        const lead = await promiseOnline

        this.setState({...lead, leadId: potentialLeadId})

        this.SaveToOffline(potentialLeadId, lead)

      } catch (e) {
        // Does lead even exist in offline cache
        try {
          this.FetchFromOffline(potentialLeadId)
        } catch(e) {

        }
      }
    } else {
      console.log("Is not a leadId", potentialLeadId)
      throw Error("Did not find a lead")
    }
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
  FetchFromOffline = (leadId: number) => {
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
  SaveToApi = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const { Lead, moveOut, leadId } = this.state
      if(Lead && moveOut && leadId) {
        return Promise.all([
          LeadService.saveCustomer(Lead),
          BuildingService.saveMoveOutBuilding(moveOut, leadId),
        ]).then(() => {
          console.log("Test")
        }).catch(e => {
          if(e) { // If offline
            // Check error message
            this.SaveToOffline(leadId, this.state)
          }
        })
      }
    })
  }

  Save = () => {

  }

  public render() {
    const { Lead, moveOut, initialAwait } = this.state
    const { match } = this.props

    return (
        <Wrapper initialLoading={initialAwait}>
          {
            Lead != null ?
            <>
              <Route path={`${match.url}/customer`} render={(routeProps) => <Customer {...routeProps} data={Lead} onChange={(data) => this.handleChange(data, "Lead")} save={this.SaveToApi} />} />
              <Route path={`${match.url}/move-out`} render={(routeProps) => moveOut ? <MoveOutBuilding {...routeProps} data={moveOut} onChange={(data) => this.handleChange(data, "moveOut")} save={this.SaveToApi} /> : "No move out"} />
            </>
            :
              "No Lead found"
          }
        </Wrapper>
    )
  }
}

export default Lead
