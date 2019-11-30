import React from "react"
import { Grid, InputAdornment } from "@material-ui/core"
import IntlTypography from "../../Intl/IntlTypography"
import { Field } from "formik"
import Select from "../Select"
import FormikTextField from "../FormikTextField"
import { IResource } from "../../../interfaces/IResource"
import Switch from "../Switch"
import Address from "./Address"

export default ({ prefix, resource }: { prefix: string; resource: IResource }) => {
  return (
    <>
      <Field label="FULL_NAME" name={`${prefix}.StorageCompany.ContactPersonFullName`} component={FormikTextField} />
      <Field label="COMPANY" name={`${prefix}.StorageCompany.CompanyName`} component={FormikTextField} />
      <Field label="CONTACTPERSON_EMAIL" name={`${prefix}.StorageCompany.ContactPersonEMail`} component={FormikTextField} />
      <Field label="CONTACT_PERSON_TEL" name={`${prefix}.StorageCompany.ContactPersonTel`} component={FormikTextField} />

      <Address prefix={prefix + ".Address"} />
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
      <Field label="ETAGE" name={`${prefix}.EtageId`} component={Select} options={resource.Etages.map(e => ({ label: e.NameTextKey, value: e.EtageId }))} />
      <Field label="ELEVATOR" name={`${prefix}.ElevatorId`} component={Select} options={resource.Elevators.map(e => ({ label: e.NameTextKey, value: e.ElevatorId }))} />
      <Field label="AMOUNT_STAIRS_TO_ENTRY" name={`${prefix}.StairsToEntryAmount`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} />
      <Field label="METER_TO_PARKING" name={`${prefix}.MetersToParking`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 1 }} />
    </>
  )
}
