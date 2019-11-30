import React from "react"
import { Grid, InputAdornment } from "@material-ui/core"
import IntlTypography from "../../Intl/IntlTypography"
import { Field } from "formik"
import FormikSimpleSelect from "../FormikSimpleSelect"
import FormikTextField from "../FormikTextField"
import { IResource } from "../../../interfaces/IResource"
import Switch from "../Switch"
import Address from "./Address"

export default ({ prefix, resource }: { prefix: string; resource: IResource }) => {
  return (
    <>
      <Address prefix={prefix + ".Address"} />
      <Field
        label="BUILDING_TYPE"
        name={`${prefix}.BuildingTypeId`}
        component={FormikSimpleSelect}
        options={resource.BuildingTypes.map(e => ({ label: e.NameTextKey, value: e.BuildingTypeId }))}
      />
      <Field
        label="BUILDING_TYPE_DETAIL"
        name={`${prefix}.BuildingTypeDetailId`}
        component={FormikSimpleSelect}
        options={resource.BuildingTypeDetails.map(e => ({ label: e.NameTextKey, value: e.BuildingTypeDetailId }))}
      />
      <Field label="ROOMS" name={`${prefix}.RoomAmount`} type="number" component={FormikTextField} inputProps={{ step: 0.5, min: 0.5 }} />
      <Field
        label="TOTAL_AREA"
        name={`${prefix}.TotalArea`}
        type="number"
        component={FormikTextField}
        InputProps={{
          startAdornment: <InputAdornment position="start">m&sup2;</InputAdornment>,
        }}
      />
      <Field label="RESTROOM_AMOUNT" name={`${prefix}.RestroomAmount`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} />
      <Field label="BALCONY_TERRASSE" name={`${prefix}.BalconyId`} component={FormikSimpleSelect} options={resource.Balconies.map(e => ({ label: e.NameTextKey, value: e.BalconyId }))} />
      <Field label="FLOOR" name={`${prefix}.FloorTypeId`} component={FormikSimpleSelect} options={resource.FloorTypes.map(e => ({ label: e.NameTextKey, value: e.FloorTypeId }))} />
      <Field
        label="ROLLERBLIND"
        name={`${prefix}.RollerBlindTypeId`}
        component={FormikSimpleSelect}
        options={resource.RollerBlindTypes.map(e => ({ label: e.NameTextKey, value: e.RollerBlindTypeId }))}
      />
      <Field label="AMOUNT_NORMAL_WINDOWS" name={`${prefix}.WindowNormalAmount`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} />

      <Field label="AMOUNT_HIGH_WINDOWS" name={`${prefix}.WindowHighVerticalAmount`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} />

      <Field label="GARAGE" name={`${prefix}.GarageTypeId`} component={FormikSimpleSelect} options={resource.GarageTypes.map(e => ({ label: e.NameTextKey, value: e.GarageTypeId }))} />
      <Field
        label="BUILTIN_WARDROBE"
        name={`${prefix}.BuiltInWardrobeRangeId`}
        component={FormikSimpleSelect}
        options={resource.BuiltInWardrobeRanges.map(e => ({ label: e.NameTextKey, value: e.BuiltInWardrobeRangeId }))}
      />
      <Field
        label="POLLUTION_DEGREE_GENERAL"
        name={`${prefix}.PollutionDegreeId`}
        component={FormikSimpleSelect}
        options={resource.PollutionDegrees.map(e => ({ label: e.NameTextKey, value: e.PollutionDegreeId }))}
      />

      <Field label="BASEMENT" name={`${prefix}.HasBasement`} component={Switch} />
      <Field label="ATTIC" name={`${prefix}.HasAttic`} component={Switch} />
      <Field label="GARDEN" name={`${prefix}.HasGarden`} component={Switch} />
      <Field label="WINTERGARDEN" name={`${prefix}.HasWinterGarden`} component={Switch} />

      <Field label="PETS" name={`${prefix}.HadPets`} component={Switch} />
      <Field label="HARDENED_DIRT" name={`${prefix}.HasHardenedDirt`} component={Switch} />
      <Field label="MOLD_AT_WALL" name={`${prefix}.HasMoldAtWall`} component={Switch} />
      <Field label="MOLD_AT_WINDOW" name={`${prefix}.HasMoldAtWindow`} component={Switch} />
      <Field label="SMOKED" name={`${prefix}.HadSmoked`} component={Switch} />
    </>
  )
}
