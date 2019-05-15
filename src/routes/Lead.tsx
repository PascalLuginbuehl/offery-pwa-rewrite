import React, { Component } from 'react';
import { Grid } from '@material-ui/core'
import { IPostLead, emptyLead, ILead } from '../interfaces/ILead';
import IntlTypography from '../components/IntlTypography';
import ValidatedDateTimePicker from '../components/Validator/ValidatedDateTimePicker';
import { handleChangeFunction } from '../components/Validator/HandleChangeFunction';
import Wrapper from '../components/Form/Wrapper';
import { get } from 'idb-keyval'

interface State extends IPostLead {

}

interface Props {

}

interface LeadContainer {
  lastUpdated: Date
  Lead: ILead
}

// Can NOT CREATE!

// Only gets called to save into Offline Storage
FetchFromOnline() {

}

// Gets Called to Get Data From Offline
FetchFromOffline () {

}

// Saves it in Offline Storage
SaveToOffline() {

}

// Checks if data changed on the API side from first Fetch
CheckAgainstAPI() {

}

// Sends all new Data to the API
SaveToApi() {

}



class Lead extends Component<Props, State> {
  state = emptyLead

  handleSubmit() {

  }

  getData() {
    // Storing all Information here

    get()
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
