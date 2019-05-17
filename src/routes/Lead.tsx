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


export interface ILeadContainer {
  lastUpdated: Date
  Lead: ILead

  moveOut: IMoveOutBuilding | null
}

interface State extends ILeadContainer {

}

interface Props extends RouteComponentProps<{ id?: string }> {

}

class Lead extends Component<Props, State> {
  handleSubmit() {

  }

  async componentDidMount() {
    const idString = this.props.match.params.id
    const potentialLeadId = parseInt(idString ? idString : "")

    if (!isNaN(potentialLeadId)) {
      await this.FetchFromOffline(potentialLeadId)

      // Check if 404 or no connection. Decide on whatever happened
      const lead = await this.FetchFromOnline(potentialLeadId)

      this.SaveToOffline(potentialLeadId, lead)
    } else {
      console.log("Is not a leadId", potentialLeadId)
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
  SaveToApi() {

  }


  public handleChange = handleChangeFunction<State>(this)

  public render() {
    // const {  } = this.state

    return (
      <Route path="/customer/" render={(routeProps) => <Customer {...routeProps} />} />
    )
  }
}

export default Lead
