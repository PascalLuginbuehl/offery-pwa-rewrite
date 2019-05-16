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
import { RouteComponentProps } from 'react-router';
import LeadService from '../services/LeadService';


interface LeadContainer {
  lastUpdated: Date
  Lead: ILead

  moveOut: IMoveOutBuilding | null
}

interface State extends LeadContainer {

}

interface Props extends RouteComponentProps<{ id?: string }> {

}

class Lead extends Component<Props, State> {
  handleSubmit() {

  }

  componentDidMount() {
    const idString = this.props.match.params.id
    const potentialLeadId = parseInt(idString ? idString : "")

    if (!isNaN(potentialLeadId)) {
      const lead = await this.FetchFromOnline(potentialLeadId)

      this.SaveToOffline(potentialLeadId, lead)
    } else {
      console.log("Is not a leadId", potentialLeadId)
    }
  }

  // Can NOT CREATE!

  // Only gets called to save into Offline Storage
  FetchFromOnline(leadId: number): Promise<LeadContainer> {
    return Promise.all([
      LeadService.fetchCustomer(leadId),
      BuildingService.fetchMoveOutBuilding(leadId),
    ]).then(([Lead, moveOut, moveIn, storageIn, disposalOut, cleaning]): LeadContainer => ({
      lastUpdated: new Date(),
      Lead,
      moveOut,
    })
  }

  // Gets Called to Get Data From Offline
  FetchFromOffline (leadId: number) {
    get(leadId)
  }

  // Saves it in Offline Storage
  SaveToOffline(leadId: number, lead: LeadContainer) {
    set(leadId, lead)
  }

  // Checks if data changed on the API side from first Fetch
  CheckAgainstAPI() {

  }

  // Sends all new Data to the API
  SaveToApi() {

  }


  public handleChange = handleChangeFunction<State>(this)

  public render() {
    const { Customer, VisitDate, MoveDate, PackServiceDate, DisposalDate, StorageDate, CleaningDate, HandOverDate, DeliveryDate, HasCleaningBuilding, HasDisposalOutBuilding, HasMoveInBuilding, HasMoveOutBuilding, HasStorageInBuilding } = this.state

    return (
      <Wrapper initialLoading={Promise.resolve()}>
        <Grid item xs={12}>
          <IntlTypography variant="h5">CUSTOMER</IntlTypography>
        </Grid>

        {/* <CustomerField customer={Customer} onChange={this.handleChange} name="Customer" /> */}

        <ValidatedDateTimePicker
          label="VISITING_DATE"
          name="VisitDate"
          value={VisitDate}
          onChange={this.handleChange}

          required
        />

        <ValidatedDateTimePicker
          label="MOVING_DATE"
          value={MoveDate}
          name="MoveDate"
          onChange={this.handleChange}
        />

        <ValidatedDateTimePicker
          label="PACKINGSERVICE_DATE"
          value={PackServiceDate}
          name="PackServiceDate"
          onChange={this.handleChange}
        />


        <ValidatedDateTimePicker
          label="CARDBOARDBOX_DELIVERY_DATE"
          value={DeliveryDate}
          name="DeliveryDate"
          onChange={this.handleChange}
        />

        <ValidatedDateTimePicker
          label="STORAGE_DATE"
          value={StorageDate}
          name="StorageDate"
          onChange={this.handleChange}
        />

        <ValidatedDateTimePicker
          label="DISPOSAL_DATE"
          value={DisposalDate}
          name="DisposalDate"
          onChange={this.handleChange}
        />

        <ValidatedDateTimePicker
          label="CLEANING_DATE"
          value={CleaningDate}
          name="CleaningDate"
          onChange={this.handleChange}
        />

        <ValidatedDateTimePicker
          label="HANDIN_DATE"
          value={HandOverDate}
          name="HandOverDate"
          onChange={this.handleChange}
        />

        {/* <BigCheckbox name="HasMoveOutBuilding" value={HasMoveOutBuilding} onChange={this.handleChange}>
          MOVE_OUT_BUILDING
        </BigCheckbox>

        <BigCheckbox name="HasMoveInBuilding" value={HasMoveInBuilding} onChange={this.handleChange}>
          MOVE_IN_BUILDING
        </BigCheckbox>

        <BigCheckbox name="HasStorageInBuilding" value={HasStorageInBuilding} onChange={this.handleChange}>
          STORAGE_BUILDING
        </BigCheckbox>

        <BigCheckbox name="HasCleaningBuilding" value={HasCleaningBuilding} onChange={this.handleChange}>
          CLEANING_BUILDING
        </BigCheckbox>

        <BigCheckbox name="HasDisposalOutBuilding" value={HasDisposalOutBuilding} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox> */}


        {/* <NextDial awaitLoading={saveAwait} /> */}
      </Wrapper>
    )
  }
}

export default Lead
