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

const styles = (theme: Theme) => createStyles({})

interface Values {
  storageService: IPutStorageService
  buildings: IBuilding[]
  lead: ILead
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (storageService: IPutStorageService, buildings: IBuilding[], lead: ILead) => Promise<any>
}

class StorageService extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { resource, storageService, buildings } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="STORAGE_SERVICE" />

          <Field name="storageService.BoreService" label="BORE" component={FormikButtonCheckbox} />
          <Field name="storageService.LampDemontageService" label="LAMP_DEMONTAGE" component={FormikButtonCheckbox} />
          <Field name="storageService.FurnitureLiftService" label="FURNITURE_LIFT" component={FormikButtonCheckbox} />
          <Field name="storageService.PianoService" label="PIANO" component={FormikButtonCheckbox} />
          <Field name="storageService.MontageService" label="MONTAGE" component={FormikButtonCheckbox} />
          <Field name="storageService.DeMontageService" label="DEMONTAGE" component={FormikButtonCheckbox} />
          <Field name="storageService.HeavyLiftService" label="HEAVY_LIFT_SERVICE" component={FormikButtonCheckbox} />

          <FormikGroups label="APPOINTMENTS" xs={12}>
            <Field name="lead.StorageDate" label="STORAGE_UNSTORE" component={FormikDateTimePicker} />
          </FormikGroups>

          <Field name="storageService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12 }} />

          <FormikDivider />
          <Grid item xs={12}>
            <IntlTypography variant="h6">STORAGE_BUILDING</IntlTypography>
          </Grid>
          {/* <Storage buildingOptions={buildingOptions} prefix={"storage"} resource={resource} /> */}
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ storageService: props.storageService, buildings: props.buildings, lead: props.lead }),

      handleSubmit: async (values, actions) => {
        try {
          await actions.props.onChangeAndSave(values.storageService, values.buildings, values.lead)

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
