
import { Grid, InputAdornment } from '@material-ui/core'
import IntlTypography from '../../components/Intl/IntlTypography'
import * as React from 'react'
import AddressField from '../../components/Form/Bundled/AddressFields';
import { withResource, WithResourceProps } from '../../providers/withResource';
import Submit from '../../components/Validator/Submit';
import ValidatedSelect from '../../components/Validator/Select/ValidatedSelect'
import ValidatedTextField from '../../components/Validator/ValidatedTextField'
import { IPostStorageBuilding } from '../../interfaces/IBuilding'
import StorageCompanyField from '../../components/Form/Bundled/StorageCompanyField';

interface State {

}

interface Props extends WithResourceProps {
  data: IPostStorageBuilding
  onChange: (data: IPostStorageBuilding) => void
  save: () => Promise<void>
}

class StorageBuilding extends React.Component<Props, State> {
  private handleChange = (value: string, target: string) => {
    this.props.onChange(Object.assign({}, this.props.data, { [target]: value }))
  }

  public render() {
    const { resource } = this.props
    const { Address, RoomAmount, TotalArea, EtageId, ElevatorId, MetersToParking, StairsToEntryAmount, StorageCompany } = this.props.data


    return (
      <>
        <Grid item xs={12}>
          <IntlTypography variant="h5">STORAGE_BUILDING</IntlTypography>
        </Grid>

        <StorageCompanyField
          value={StorageCompany}
          name="StorageCompany"
          onChange={this.handleChange}
        />

        <AddressField
          value={Address}
          name="Address"
          onChange={this.handleChange}
        />

        <ValidatedTextField
          label="ROOMS"
          value={RoomAmount}
          name="RoomAmount"
          type="number"
          onChange={this.handleChange}
        />

        <ValidatedTextField
          label="TOTAL_AREA"
          value={TotalArea}
          name="TotalArea"
          type="number"
          onChange={this.handleChange}

          // Small start thingy
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                m&sup2;
              </InputAdornment>
            ),
          }}
        />

        <ValidatedSelect
          label="ETAGE"
          value={EtageId}
          name="EtageId"
          onChange={this.handleChange}
          required
          options={resource.Etages.map(e => ({...e, id: e.EtageId }))}
        />

        <ValidatedSelect
          label="ELEVATOR"
          value={ElevatorId}
          name="ElevatorId"
          onChange={this.handleChange}
          required
          options={resource.Elevators.map(e => ({ ...e, id: e.ElevatorId }))}
        />

        <ValidatedTextField
          label="AMOUNT_STAIRS_TO_ENTRY"
          value={StairsToEntryAmount}
          name="StairsToEntryAmount"
          type="number"
          onChange={this.handleChange}
        />

        <ValidatedTextField
          label="METER_TO_PARKING"
          value={MetersToParking}
          name="MetersToParking"
          type="number"
          onChange={this.handleChange}
        />

        <Submit onSubmit={this.props.save} />
     </>
    )
  }
}

export default withResource(StorageBuilding)