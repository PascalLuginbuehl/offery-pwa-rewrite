import { Grid, InputAdornment } from '@material-ui/core'
import * as React from 'react'
import { IPostMoveOutBuilding, emptyMoveOutBuilding } from '../../interfaces/IBuilding';
import { withResource, WithResourceProps } from '../../providers/withResource';
import ValidatedTextField from '../../components/Validator/ValidatedTextField';
import Submit from '../../components/Validator/Submit';
import IntlTypography from '../../components/IntlTypography';
import AddressField from '../../components/Form/Bundled/AddressFields';
import Switch from '../../components/Validator/Switch'
import ValidatedSelect from '../../components/Validator/ValidatedSelect';

interface State {

}

interface Props extends WithResourceProps {
  data: IPostMoveOutBuilding
  onChange: (data: IPostMoveOutBuilding) => void
  save: () => Promise<void>
}

class MoveOutBuilding extends React.Component<Props, State> {
  private handleChange = (value: string, target: string) => {
    this.props.onChange(Object.assign({}, this.props.data, { [target]: value }))
  }

  public render() {
    const { resource } = this.props
    const { Address, RoomAmount, TotalArea, PeopleLivingAmount, BuildingTypeId, EtageId, ElevatorId, BuildingAgeId, MetersToParking, StairsToEntryAmount, HasBasement, HasAttic, HasGarage, HasGarden, HasWinterGarden } = this.props.data

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
          options={resource.BuildingTypes}
          translatedLabel

          toOptions={(option) => ({ label: option.NameTextKey, value: option.BuildingTypeId })}
          toValue={value => resource.BuildingTypes.find(elevator => value.value == elevator.BuildingTypeId)}
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
          options={resource.Etages}
          translatedLabel

          toOptions={(option) => ({ label: option.NameTextKey, value: option.EtageId })}
          toValue={value => resource.Etages.find(elevator => value.value == elevator.EtageId)}
        />

        <ValidatedSelect
          label="ELEVATOR"
          value={ElevatorId}
          name="ElevatorId"
          onChange={this.handleChange}
          required
          options={resource.Elevators}
          translatedLabel

          toOptions={(option) => ({ label: option.NameTextKey, value: option.ElevatorId })}
          toValue={value => resource.Elevators.find(elevator => value.value == elevator.ElevatorId)}
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
          options={resource.BuildingAges}
          translatedLabel

          toOptions={(option) => ({ label: option.NameTextKey, value: option.BuildingAgeId })}
          toValue={value => resource.BuildingAges.find(elevator => value.value == elevator.BuildingAgeId)}
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

        <Submit onSubmit={() => Promise.resolve()}  />
     </>
    )
  }
}

export default withResource(MoveOutBuilding)
