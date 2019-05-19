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


export interface ILeadContainer {
  lastUpdated: Date
  Lead: ILead | null

  moveOut: IMoveOutBuilding | null
}

interface State extends ILeadContainer {
  initialAwait: Promise<any> | null
}

interface Props extends RouteComponentProps<{ id?: string }> {

}

class Lead extends Component<Props, State> {
  state: State = {lastUpdated: new Date(), Lead: null, moveOut: null, initialAwait: null}

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
      const  promiseOnline =  this.FetchFromOnline(potentialLeadId)

      this.setState({ initialAwait: promiseOffline })
      const lead = await promiseOnline

      this.setState(lead)


      this.SaveToOffline(potentialLeadId, lead)

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
    const { Lead, initialAwait } = this.state
    const { match } = this.props

    console.log("Hi", Lead, initialAwait)
    return (
      <Loading await={initialAwait}>
        {
          Lead != null ?
            <Route path={`${match.url}/customer`} render={(routeProps) => <Customer {...routeProps} get={() => Promise.resolve(Lead)} save={(data) => Promise.resolve()} />} />
          :
            "No Lead found"
        }
      </Loading>
    )
  }
}

export default Lead
