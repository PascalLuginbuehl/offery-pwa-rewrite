import { Grid, InputAdornment } from '@material-ui/core'
import IntlTypography from '../../components/Intl/IntlTypography'
import * as React from 'react'
import { IPostCleaningBuilding, emptyCleaningBuilding } from '../../interfaces/IBuilding';
import AddressField from '../../components/Form/Bundled/AddressFields';
import { withResource, WithResourceProps } from '../../providers/withResource';
import Submit from '../../components/Validator/Submit';
import { ValidatedSelect } from '../../components/Validator/Select/ValidatedSelect';
import { ValidatedTextField } from '../../components/Validator/ValidatedTextField';
import ValidatedSelectTo from '../../components/Validator/Select/ValidatedSelectTo';

interface State {

}

interface Props extends WithResourceProps {
  data: IPostCleaningBuilding
  onChange: (data: IPostCleaningBuilding) => void
  save: () => Promise<void>
}

class CleaningBuilding extends React.Component<Props, State> {
  private handleChange = (value: string, target: string) => {
    this.props.onChange(Object.assign({}, this.props.data, { [target]: value }))
  }

  public render() {
    const { resource } = this.props
    const { Address, RoomAmount, TotalArea, BuildingTypeId, HasBasement, HasAttic, HasGarden, HasWinterGarden, BuildingTypeDetailId, RestroomAmount, BalconyId, FloorTypeId, RollerBlindTypeId, WindowNormalAmount, WindowHightVerticalAmount, GarageTypeId, BuiltinWardrobeRangeId, PollutionDegreeId, HadPets, HasHardenedDirt, HasMoldAtWall, HasMoldAtWindow, HasSmoked } = this.props.data


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

        <ValidatedSelectTo
          label="BUILDING_TYPE"
          value={BuildingTypeId}
          name="BuildingTypeId"
          onChange={this.handleChange}
          options={resource.BuildingTypes}

          keyName={"BuildingTypeId"}
          required
        />

        <ValidatedSelect
          label="BUILDING_TYPE_DETAIL"
          value={BuildingTypeDetailId}
          name="BuildingTypeDetailId"
          onChange={this.handleChange}
          required
          options={resource.BuildingTypeDetails.map(e => ({ ...e, id: e.BuildingTypeDetailId }))}
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
          options={resource.Balconies.map(e => ({ ...e, id: e.BalconyId }))}

          required
        />

        <ValidatedSelect
          label="FLOOR"
          value={FloorTypeId}
          name="FloorTypeId"
          onChange={this.handleChange}
          options={resource.FloorTypes.map(e => ({ ...e, id: e.FloorTypeId }))}

          required
        />

        <ValidatedSelect
          label="ROLLERBLIND"
          value={RollerBlindTypeId}
          name="RollerBlindTypeId"
          onChange={this.handleChange}
          options={resource.RollerBlindTypes.map(e => ({ ...e, id: e.RollerBlindTypeId }))}

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
          options={resource.GarageTypes.map(e => ({ ...e, id: e.GarageTypeId }))}

          required
        />

        <ValidatedSelect
          label="BUILTIN_WARDROBE"
          value={BuiltinWardrobeRangeId}
          name="BuiltinWardrobeRangeId"
          onChange={this.handleChange}
          options={resource.BuiltInWardrobeRanges.map(e => ({ ...e, id: e.BuiltInWardrobeRangeId }))}

          required
        />

        <ValidatedSelect
          label="POLLUTION_DEGREE_GENERAL"
          value={PollutionDegreeId}
          name="PollutionDegreeId"
          onChange={this.handleChange}
          options={resource.PollutionDegrees.map(e => ({ ...e, id: e.PollutionDegreeId }))}

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

        <Submit onSubmit={this.props.save} />
     </>
    )
  }
}

export default withResource(CleaningBuilding)
