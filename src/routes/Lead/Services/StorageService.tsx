import { createStyles,   Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import { FormikProps, Field, withFormik } from "formik"

import Form from "../../../components/FormikFields/Form"

import { IPutStorageService } from "../../../interfaces/IService"
import PageHeader from "../../../components/PageHeader"
import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"
import FormikDivider from "../../../components/FormikFields/FormikDivider"
import IntlTypography from "../../../components/Intl/IntlTypography"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import { ILead } from "../../../interfaces/ILead"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import { IBuilding } from "../../../interfaces/IBuilding"
import GridContainer from "../../../components/GridContainer"
import NestedBuildingEdit from "./NestedBuildingEdit"
import SelectBuilding from "../../../components/FormikFields/Bundled/SelectBuilding"
import Submit from "../../../components/FormikFields/Submit"
import SubmitPadding from "../../../components/FormikFields/SubmitPadding"

const styles = (theme: Theme) => createStyles({})

interface Values {
  storageService: IPutStorageService
  lead: ILead
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  buildings: IBuilding[]
  nextPage: () => void
  onChangeAndSave: (storageService: IPutStorageService, lead: ILead) => Promise<any>
  onSaveNestedBuilding: (buildings: IBuilding) => Promise<any>
}

class StorageService extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { resource, selectedCompany, values, buildings, onSaveNestedBuilding, isSubmitting } = this.props

    const initialDate = new Date()
    initialDate.setHours(selectedCompany.Settings.DefaultServiceTimeStart || 8)
    initialDate.setMinutes(0)
    initialDate.setSeconds(0)

    return (
      <Grid item xs={12}>
        <Form disableSubmit>
          <PageHeader title="STORAGE_SERVICE" />

          {selectedCompany.Settings.EnableServiceStorageBore ? (<Field name="storageService.BoreService" label="BORE" component={FormikButtonCheckbox} />) : null }
          {selectedCompany.Settings.EnableServiceStorageLampDemontage ? (<Field name="storageService.LampDemontageService" label="LAMP_DEMONTAGE" component={FormikButtonCheckbox} />) : null }
          {selectedCompany.Settings.EnableServiceStorageFurnitureLift ? (<Field name="storageService.FurnitureLiftService" label="FURNITURE_LIFT" component={FormikButtonCheckbox} />) : null }
          {selectedCompany.Settings.EnableServiceStoragePiano ? (<Field name="storageService.PianoService" label="PIANO" component={FormikButtonCheckbox} />) : null }
          {selectedCompany.Settings.EnableServiceStorageMontage ? (<Field name="storageService.MontageService" label="MONTAGE" component={FormikButtonCheckbox} />) : null }
          {selectedCompany.Settings.EnableServiceStorageDemontage ? (<Field name="storageService.DeMontageService" label="DEMONTAGE" component={FormikButtonCheckbox} />) : null }
          {selectedCompany.Settings.EnableServiceStorageHeavyLift ? (<Field name="storageService.HeavyLiftService" label="HEAVY_LIFT_SERVICE" component={FormikButtonCheckbox} />) : null }

          <FormikGroups label="CONTACT_PERSON" xs={12}>
            {selectedCompany.Settings.EnableServiceStorageContactPersonFullName ? (<Field label="FULL_NAME" name="storageService.ContactPersonFullName" component={FormikTextField} />) : null }
            {selectedCompany.Settings.EnableServiceStorageCompanyName ? (<Field label="COMPANY" name="storageService.CompanyName" component={FormikTextField} />) : null }
            {selectedCompany.Settings.EnableServiceStorageContactPersonEMail ? (<Field label="CONTACTPERSON_EMAIL" name="storageService.ContactPersonEMail" component={FormikTextField} />) : null }
            {selectedCompany.Settings.EnableServiceStorageContactPersonTel ? (<Field label="CONTACT_PERSON_TEL" name="storageService.ContactPersonTel" component={FormikTextField} />) : null }
          </FormikGroups>

          <FormikGroups label="APPOINTMENTS" xs={12}>
            <Field name="lead.StorageDate" label="STORAGE_UNSTORE" component={FormikDateTimePicker} initialFocusedDate={initialDate}/>
          </FormikGroups>

          {selectedCompany.Settings.EnableServiceStorageComment ? (<Field name="storageService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12 }} />) : null }

          <Submit isSubmitting={isSubmitting} disableSubmitPadding />
        </Form>

        <GridContainer>
          <FormikDivider />

          <Grid item xs={12}>
            <IntlTypography variant="h6">MOVE_OUT_BUILDING</IntlTypography>
          </Grid>

          <Field name="storageService.OutBuildingId" label="MOVE_OUT_BUILDING" buildings={buildings} component={SelectBuilding} />
          <NestedBuildingEdit
            resource={resource}
            buildingSetting={selectedCompany.Settings.StorageServiceOutBuildingSetting}
            buildingId={values.storageService.OutBuildingId}
            buildings={buildings}
            saveBuilding={onSaveNestedBuilding} />

          <Grid item xs={12}>
            <IntlTypography variant="h6">STORAGE_BUILDING</IntlTypography>
          </Grid>

          <Field name="storageService.StorageInBuildingId" label="STORAGE_BUILDING" buildings={buildings} component={SelectBuilding} />
          <NestedBuildingEdit
            resource={resource}
            buildingSetting={selectedCompany.Settings.StorageServiceStorageInBuildingSetting}
            buildingId={values.storageService.StorageInBuildingId}
            buildings={buildings}
            saveBuilding={onSaveNestedBuilding} />

          {/* <Grid item xs={12}>
            <IntlTypography variant="h6">STORAGE_OUT_BUILDING</IntlTypography>
          </Grid>
          <Field name="storageService.InBuildingId" label="STORAGE_OUT_BUILDING" buildings={buildings} component={SelectBuilding} />
          <NestedBuildingEdit
            resource={resource}
            buildingSetting={selectedCompany.Settings.StorageServiceInBuildingSetting}
            buildingId={values.storageService.InBuildingId}
            buildings={buildings}
            saveBuilding={onSaveNestedBuilding} /> */}
        </GridContainer>

        <SubmitPadding />
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ storageService: props.storageService, lead: props.lead }),

      handleSubmit: async (values, actions) => {
        try {
          await actions.props.onChangeAndSave(values.storageService, values.lead)

          actions.setSubmitting(false)

          actions.resetForm()
          actions.props.nextPage()
        } catch (e) {
          actions.setStatus(e)
        }
      },
    })(StorageService)
  )
)
