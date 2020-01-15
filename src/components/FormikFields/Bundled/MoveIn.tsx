import React from "react"
import { Grid, InputAdornment } from "@material-ui/core"
import IntlTypography from "../../Intl/IntlTypography"
import { Field } from "formik"
import FormikSimpleSelect from "../FormikSimpleSelect"
import FormikTextField from "../FormikTextField"
import { IResource } from "../../../interfaces/IResource"
import Switch from "../Switch"
import Address from "./Address"
import FormikGroups from "./Groups"
import FormikNumberEndAdornmentText from "../Numbers/FormikNumberEndAdornmentText"
import BuildingCopy, { IBuildingCopy } from "./BuildingCopy"
import { emptyMoveInBuilding } from "../../../interfaces/IBuilding"

export default function MoveInBuilding({ prefix, resource, buildingOptions }: { prefix: string; resource: IResource; buildingOptions: IBuildingCopy}) {
  return (
    <>
      <BuildingCopy getKeysFromBuilding={emptyMoveInBuilding} prefix={prefix} buildings={buildingOptions} />

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
          label="BUILDING_AGE"
          name={`${prefix}.BuildingAgeId`}
          component={FormikSimpleSelect}
          options={resource.BuildingAges.map(e => ({ label: e.NameTextKey, value: e.BuildingAgeId }))}
          overrideGrid={{ xs: 12, sm: 6, md: 3 }}
        />

        <Field label="ROOMS" name={`${prefix}.RoomAmount`} type="number" component={FormikTextField} inputProps={{ step: 0.5, min: 0.5 }} overrideGrid={{ xs: 6, sm: 3 }} />

        <Field label="TOTAL_AREA" name={`${prefix}.TotalArea`} component={FormikNumberEndAdornmentText} adornmentText="m&sup2;" overrideGrid={{ xs: 6, sm: 3 }} />

        <Field
          label="ETAGE"
          name={`${prefix}.EtageId`}
          component={FormikSimpleSelect}
          options={resource.Etages.map(e => ({ label: e.NameTextKey, value: e.EtageId }))}
          overrideGrid={{ xs: 12, sm: 6, md: 3 }}
        />

        <Field
          label="ELEVATOR"
          name={`${prefix}.ElevatorId`}
          component={FormikSimpleSelect}
          options={resource.Elevators.map(e => ({ label: e.NameTextKey, value: e.ElevatorId }))}
          overrideGrid={{ xs: 12, sm: 6, md: 3 }}
        />
      </FormikGroups>

      <Field
        label="AMOUNT_STAIRS_TO_ENTRY"
        name={`${prefix}.StairsToEntryAmount`}
        type="number"
        component={FormikTextField}
        inputProps={{ step: 1, min: 0 }}
        overrideGrid={{ xs: 12, md: 6 }}
      />

      <Field
        label="METER_TO_PARKING"
        name={`${prefix}.MetersToParking`}
        type="number"
        component={FormikTextField}
        inputProps={{ step: 1, min: 0 }}
        overrideGrid={{ xs: 12, md: 6 }}
      />

      <FormikGroups label="AREAS" xs={12}>
        <Field label="CELLAR" name={`${prefix}.HasBasement`} component={Switch} />

        <Field label="ATTIC" name={`${prefix}.HasAttic`} component={Switch} />

        <Field label="GARAGE" name={`${prefix}.HasGarage`} component={Switch} />

        <Field label="GARDEN" name={`${prefix}.HasGarden`} component={Switch} />

        <Field label="WINTERGARDEN" name={`${prefix}.HasWinterGarden`} component={Switch} />
      </FormikGroups>
    </>
  )
}
