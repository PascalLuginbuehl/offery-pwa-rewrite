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

      <Field label="ETAGE" name={`${prefix}.EtageId`} component={FormikSimpleSelect} options={resource.Etages.map(e => ({ label: e.NameTextKey, value: e.EtageId }))} />
      <Field label="ELEVATOR" name={`${prefix}.ElevatorId`} component={FormikSimpleSelect} options={resource.Elevators.map(e => ({ label: e.NameTextKey, value: e.ElevatorId }))} />

      <Field label="AMOUNT_PEOPLE_IN_HOUSEHOLD" name={`${prefix}.PeopleLivingAmount`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 1 }} />

      <Field label="AMOUNT_STAIRS_TO_ENTRY" name={`${prefix}.StairsToEntryAmount`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} />
      <Field label="METER_TO_PARKING" name={`${prefix}.MetersToParking`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 1 }} />

      <Field label="BASEMENT" name={`${prefix}.HasBasement`} component={Switch} />

      <Field label="ATTIC" name={`${prefix}.HasAttic`} component={Switch} />

      <Field label="GARAGE" name={`${prefix}.HasGarage`} component={Switch} />

      <Field label="GARDEN" name={`${prefix}.HasGarden`} component={Switch} />

      <Field label="WINTERGARDEN" name={`${prefix}.HasWinterGarden`} component={Switch} />
    </>
  )
}