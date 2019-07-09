import { Grid, InputAdornment } from '@material-ui/core'
import IntlTypography from '../../components/Intl/IntlTypography'
import * as React from 'react'
import { IPostCleaningBuilding, emptyCleaningBuilding } from '../../interfaces/IBuilding';
import AddressField from '../../components/Form/Bundled/AddressFields';
import { withResource, WithResourceProps } from '../../providers/withResource';
import Submit from '../../components/Validator/Submit';
import ValidatedSelect from '../../components/Validator/Select/ValidatedSelect';
import ValidatedTextField from '../../components/Validator/ValidatedTextField';
import Switch from '../../components/Validator/Switch';
import FormTemplate from './FormTemplate';
import { sortMasterThing } from '../../interfaces/IResource';

interface State {

}

interface Props extends WithResourceProps {
  data: IPostCleaningBuilding | null
  onChange: (data: IPostCleaningBuilding) => void
  save: () => Promise<void>
}

class CleaningBuilding extends FormTemplate<Props, State> {
  private handleChange = (value: string, target: string) => {
    this.props.onChange(Object.assign({}, this.props.data, { [target]: value }))
  }

  public render() {
    const { resource } = this.props

    const data = this.props.data ? this.props.data : emptyCleaningBuilding
    const { Address, RoomAmount, TotalArea, BuildingTypeId, HasBasement, HasAttic, HasGarden, HasWinterGarden, BuildingTypeDetailId, RestroomAmount, BalconyId, FloorTypeId, RollerBlindTypeId, WindowNormalAmount, WindowHightVerticalAmount, GarageTypeId, BuiltinWardrobeRangeId, PollutionDegreeId, HadPets, HasHardenedDirt, HasMoldAtWall, HasMoldAtWindow, HasSmoked } = data


    return (
      <>
        <Grid item xs={12}>
          <IntlTypography variant="h5">CLEANING_BUILDING</IntlTypography>
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

          options={resource.BuildingTypes.sort(sortMasterThing).map(e => ({ label: e.NameTextKey, value: e.BuildingTypeId }))}
          required
        />

        <ValidatedSelect
          label="BUILDING_TYPE_DETAIL"
          value={BuildingTypeDetailId}
          name="BuildingTypeDetailId"
          onChange={this.handleChange}
          required

          options={resource.BuildingTypeDetails.sort(sortMasterThing).map(e => ({ label: e.NameTextKey, value: e.BuildingTypeDetailId }))}
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

        <ValidatedTextField
          label="RESTROOM_AMOUNT"
          value={RestroomAmount}
          name="RestroomAmount"
          type="number"
          onChange={this.handleChange}
        />

        <ValidatedSelect
          label="BALCONY_TERRASSE"
          value={BalconyId}
          name="BalconyId"
          onChange={this.handleChange}
          options={resource.Balconies.sort(sortMasterThing).map(e => ({ label: e.NameTextKey, value: e.BalconyId }))}

          required
        />

        <ValidatedSelect
          label="FLOOR"
          value={FloorTypeId}
          name="FloorTypeId"
          onChange={this.handleChange}
          options={resource.FloorTypes.sort(sortMasterThing).map(e => ({ label: e.NameTextKey, value: e.FloorTypeId }))}

          required
        />

        <ValidatedSelect
          label="ROLLERBLIND"
          value={RollerBlindTypeId}
          name="RollerBlindTypeId"
          onChange={this.handleChange}
          options={resource.RollerBlindTypes.sort(sortMasterThing).map(e => ({ label: e.NameTextKey, value: e.RollerBlindTypeId }))}

          required
        />

        <ValidatedTextField
          label="AMOUNT_NORMAL_WINDOWS"
          value={WindowNormalAmount}
          name="WindowNormalAmount"
          type="number"
          onChange={this.handleChange}
        />

        <ValidatedTextField
          label="AMOUNT_HIGH_WINDOWS"
          value={WindowHightVerticalAmount}
          name="WindowHightVerticalAmount"
          type="number"
          onChange={this.handleChange}
        />

        <ValidatedSelect
          label="GARAGE"
          value={GarageTypeId}
          name="GarageTypeId"
          onChange={this.handleChange}
          options={resource.GarageTypes.sort(sortMasterThing).map(e => ({ label: e.NameTextKey, value: e.GarageTypeId }))}

          required
        />

        <ValidatedSelect
          label="BUILTIN_WARDROBE"
          value={BuiltinWardrobeRangeId}
          name="BuiltinWardrobeRangeId"
          onChange={this.handleChange}
          options={resource.BuiltInWardrobeRanges.sort(sortMasterThing).map(e => ({ label: e.NameTextKey, value: e.BuiltInWardrobeRangeId }))}

          required
        />

        <ValidatedSelect
          label="POLLUTION_DEGREE_GENERAL"
          value={PollutionDegreeId}
          name="PollutionDegreeId"
          onChange={this.handleChange}
          options={resource.PollutionDegrees.sort(sortMasterThing).map(e => ({ label: e.NameTextKey, value: e.PollutionDegreeId }))}

          required
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

        <Switch
          label="PETS"
          value={HadPets}
          name="HadPets"
          onChange={this.handleChange}
        />

        <Switch
          label="HARDENED_DIRT"
          value={HasHardenedDirt}
          name="HasHardenedDirt"
          onChange={this.handleChange}
        />

        <Switch
          label="MOLD_AT_WALL"
          value={HasMoldAtWall}
          name="HasMoldAtWall"
          onChange={this.handleChange}
        />

        <Switch
          label="MOLD_AT_WINDOW"
          value={HasMoldAtWindow}
          name="HasMoldAtWindow"
          onChange={this.handleChange}
        />

        <Switch
          label="SMOKED"
          value={HasSmoked}
          name="HasSmoked"
          onChange={this.handleChange}
        />

        <Submit onSubmit={this.saveFunction} />
     </>
    )
  }
}

export default withResource(CleaningBuilding)
