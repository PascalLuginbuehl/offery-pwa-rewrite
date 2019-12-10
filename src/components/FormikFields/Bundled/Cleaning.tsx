import React from "react"
import { Field } from "formik"
import FormikSimpleSelect from "../FormikSimpleSelect"
import FormikTextField from "../FormikTextField"
import { IResource } from "../../../interfaces/IResource"
import Switch from "../Switch"
import Address from "./Address"
import FormikGroups from "./Groups";
import FormikNumberEndAdornmentText from "../Numbers/FormikNumberEndAdornmentText";
import BuildingCopy, { CombinedBuildings, IBuildingCopy } from "./BuildingCopy";
import { emptyCleaningBuilding } from "../../../interfaces/IBuilding";

export default ({ prefix, resource, buildingOptions }: { prefix: string; resource: IResource; buildingOptions: IBuildingCopy }) => {
  return (
    <>
      <BuildingCopy getKeysFromBuilding={emptyCleaningBuilding} prefix={prefix} buildings={buildingOptions} />

      <Address prefix={prefix + ".Address"} />
      <FormikGroups label="BUILDING" xs={12}>
        <Field
          label="BUILDING_TYPE"
          name={`${prefix}.BuildingTypeId`}
          component={FormikSimpleSelect}
          options={resource.BuildingTypes.map(e => ({ label: e.NameTextKey, value: e.BuildingTypeId }))}
          overrideGrid={{ xs: 12, sm: 6, md: 3 }}
        />

        <Field
          label="BUILDING_TYPE_DETAIL"
          name={`${prefix}.BuildingTypeDetailId`}
          component={FormikSimpleSelect}
          options={resource.BuildingTypeDetails.map(e => ({ label: e.NameTextKey, value: e.BuildingTypeDetailId }))}
          overrideGrid={{ xs: 12, sm: 6, md: 3 }}
        />

        <Field label="ROOMS" name={`${prefix}.RoomAmount`} type="number" component={FormikTextField} inputProps={{ step: 0.5, min: 0.5 }} overrideGrid={{ xs: 6, sm: 3 }} />
        <Field label="TOTAL_AREA" name={`${prefix}.TotalArea`} component={FormikNumberEndAdornmentText} adornmentText="m&sup2;" overrideGrid={{ xs: 6, sm: 3 }} />

        <Field
          label="BALCONY_TERRASSE"
          name={`${prefix}.BalconyId`}
          component={FormikSimpleSelect}
          options={resource.Balconies.map(e => ({ label: e.NameTextKey, value: e.BalconyId }))}
        />
        <Field
          label="FLOOR"
          name={`${prefix}.FloorTypeId`}
          component={FormikSimpleSelect}
          options={resource.FloorTypes.map(e => ({ label: e.NameTextKey, value: e.FloorTypeId }))}
        />
        <Field
          label="RESTROOM_AMOUNT"
          name={`${prefix}.RestroomAmount`}
          type="number"
          component={FormikTextField}
          inputProps={{ step: 1, min: 0 }}
          overrideGrid={{ xs: 6, sm: 3 }}
        />
      </FormikGroups>

      <FormikGroups label="POLLUTION" xs={12}>
        <Field
          label="ROLLERBLIND"
          name={`${prefix}.RollerBlindTypeId`}
          component={FormikSimpleSelect}
          options={resource.RollerBlindTypes.map(e => ({ label: e.NameTextKey, value: e.RollerBlindTypeId }))}
        />
        <Field label="AMOUNT_NORMAL_WINDOWS" name={`${prefix}.WindowNormalAmount`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} />

        <Field label="AMOUNT_HIGH_WINDOWS" name={`${prefix}.WindowHighVerticalAmount`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} />

        <Field
          label="GARAGE"
          name={`${prefix}.GarageTypeId`}
          component={FormikSimpleSelect}
          options={resource.GarageTypes.map(e => ({ label: e.NameTextKey, value: e.GarageTypeId }))}
        />
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

        <Field label="PETS" name={`${prefix}.HadPets`} component={Switch} />
        <Field label="HARDENED_DIRT" name={`${prefix}.HasHardenedDirt`} component={Switch} />
        <Field label="MOLD_AT_WALL" name={`${prefix}.HasMoldAtWall`} component={Switch} />
        <Field label="MOLD_AT_WINDOW" name={`${prefix}.HasMoldAtWindow`} component={Switch} />
        <Field label="SMOKED" name={`${prefix}.HadSmoked`} component={Switch} />
      </FormikGroups>

      <FormikGroups label="AREAS" xs={12}>
        <Field label="BASEMENT" name={`${prefix}.HasBasement`} component={Switch} />
        <Field label="ATTIC" name={`${prefix}.HasAttic`} component={Switch} />
        <Field label="GARDEN" name={`${prefix}.HasGarden`} component={Switch} />
        <Field label="WINTERGARDEN" name={`${prefix}.HasWinterGarden`} component={Switch} />
      </FormikGroups>
    </>
  )
}
