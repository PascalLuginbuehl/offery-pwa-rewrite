import React, { Component } from 'react';
import { Grid } from '@material-ui/core'
import { IPostLead, emptyLead, ILead } from '../interfaces/ILead';
import IntlTypography from '../components/IntlTypography';
import ValidatedDateTimePicker from '../components/Validator/ValidatedDateTimePicker';
import { handleChangeFunction } from '../components/Validator/HandleChangeFunction';
import Wrapper from '../components/Form/Wrapper';
import { get } from 'idb-keyval'
import { RouteComponentProps } from 'react-router';
import { ILeadContainer } from './Lead';

interface State extends IPostLead {
  initialAwait: Promise<any> | null
}

interface Props extends RouteComponentProps {
  get: () => Promise<IPostLead>
  save: (data: IPostLead) => Promise<void>
}

class Customer extends Component<Props, State> {
  state: State = {
    initialAwait: null,
    ...emptyLead
  }

  handleSubmit() {

  }

  async componentDidMount() {
    const { get } = this.props
    const initialAwait = get()

    this.setState({ initialAwait, ...emptyLead})

    const Lead = await initialAwait
    this.setState(Lead)
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

export default Customer
