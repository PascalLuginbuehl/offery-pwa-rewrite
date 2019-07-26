import * as React from 'react'
import { IPostAddress } from '../../../interfaces/IAddress'
import ValidatedTextField from '../../Validator/ValidatedTextField'
import { IPostMoveOutBuilding } from '../../../interfaces/IBuilding'
import { Grid, InputAdornment } from '@material-ui/core'
import { withResource, WithResourceProps } from '../../../providers/withResource';
import Submit from '../../Validator/Submit';
import IntlTypography from '../../Intl/IntlTypography';
import AddressField from './AddressFields';
import Switch from '../../Validator/Switch'
import ValidatedSelect from '../../Validator/Select/ValidatedSelect';
import { sortMasterThing } from '../../../interfaces/IResource';

interface State extends IPostAddress {

}

interface Props extends WithResourceProps {
  value: IPostMoveOutBuilding
  onChange: (value: any, target: string) => void
  name: string
}

class CommonMoveServiceProps extends React.Component<Props, State> {

  private handleChange = (value: string, target: string) => {
    this.props.onChange(value, target)
  }

  public render() {
    const { resource, onChange } = this.props
    const { Address, RoomAmount, TotalArea, PeopleLivingAmount, BuildingTypeId, EtageId, ElevatorId, BuildingAgeId, MetersToParking, StairsToEntryAmount, HasBasement, HasAttic, HasGarage, HasGarden, HasWinterGarden } = this.props.value

    return (
      <>
        <Grid item xs={12}>
          <IntlTypography variant="h5">MOVE_OUT_BUILDING</IntlTypography>
        </Grid>

          <AddressField
            value={Address}
            name="Address"
            onChange={this.handleChange}
          />

          <ValidatedSelect
            label="BUILDING_TYPE"
            value={BuildingTypeId}
            name="BuildingTypeId"
            onChange={this.handleChange}
            required
            options={resource.BuildingTypes.map(e => ({ label: e.NameTextKey, value: e.BuildingTypeId }))}
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

            options={resource.Etages.sort(sortMasterThing).map(e => ({ label: e.NameTextKey, value: e.EtageId }))}
          />

          <ValidatedSelect
            label="ELEVATOR"
            value={ElevatorId}
            name="ElevatorId"
            onChange={this.handleChange}
            required
            options={resource.Elevators.sort(sortMasterThing).map(e => ({ label: e.NameTextKey, value: e.ElevatorId }))}
          />

          <ValidatedTextField
            label="AMOUNT_PEOPLE_IN_HOUSEHOLD"
            value={PeopleLivingAmount}
            name="PeopleLivingAmount"
            type="number"
            onChange={this.handleChange}
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

          <ValidatedSelect
            label="BUILDING_AGE"
            value={BuildingAgeId}
            name="BuildingAgeId"
            onChange={this.handleChange}
            required

            options={resource.BuildingAges.sort(sortMasterThing).map(e => ({ label: e.NameTextKey, value: e.BuildingAgeId }))}
          />

          <Switch
            label="BASEMENT"
            value={HasBasement}
            name="HasBasement"
            onChange={this.handleChange}
          />

          <Switch
            label="ATTIC"
            value={HasAttic}
            name="HasAttic"
            onChange={this.handleChange}
          />

          <Switch
            label="GARAGE"
            value={HasGarage}
            name="HasGarage"
            onChange={this.handleChange}
          />

          <Switch
            label="GARDEN"
            value={HasGarden}
            name="HasGarden"
            onChange={this.handleChange}
          />

          <Switch
            label="WINTERGARDEN"
            value={HasWinterGarden}
            name="HasWinterGarden"
            onChange={this.handleChange}
          />
      </>
    )
  }
}

export default withResource(CommonMoveServiceProps)
