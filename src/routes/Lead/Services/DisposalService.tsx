import { createStyles, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import { IPostDisposalOutBuilding } from "../../../interfaces/IBuilding"
import { FormikProps, Field, withFormik } from "formik"
import Form from "../../../components/FormikFields/Form"
import Submit from "../../../components/FormikFields/Submit"
import { IPutDisposalService } from "../../../interfaces/IService"
import PageHeader from "../../../components/PageHeader"
import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"
import FormikDivider from "../../../components/FormikFields/FormikDivider"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import Disposal from "../../../components/FormikFields/Bundled/Disposal"
import IntlTypography from "../../../components/Intl/IntlTypography"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import { IBuildingCopy } from "../../../components/FormikFields/Bundled/BuildingCopy"
import { ILead } from "../../../interfaces/ILead"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

const styles = (theme: Theme) => createStyles({})

interface Values {
  disposalService: IPutDisposalService
  disposal: IPostDisposalOutBuilding
  lead: ILead
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (disposalService: IPutDisposalService, disposal: IPostDisposalOutBuilding, lead: ILead) => Promise<any>
  buildingOptions: IBuildingCopy
}

class DisposalService extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, buildingOptions } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="DISPOSAL_SERVICE" />

          <Field name="disposalService.LampDemontageService" label="LAMP_DEMONTAGE" component={FormikButtonCheckbox} />
          <Field name="disposalService.FurnitureLiftService" label="FURNITURE_LIFT" component={FormikButtonCheckbox} />
          <Field name="disposalService.DeMontage" label="DEMONTAGE" component={FormikButtonCheckbox} />
          <Field name="disposalService.HeavyLiftService" label="HEAVY_LIFT_SERVICE" component={FormikButtonCheckbox} />

          <FormikGroups label="APPOINTMENTS" xs={12}>
            <Field name="lead.DisposalDate" label="DISPOSAL_DATE" component={FormikDateTimePicker} />
          </FormikGroups>

          <Field name="disposalService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12 }} />

          <FormikDivider />
          <Grid item xs={12}>
            <IntlTypography variant="h6">DISPOSAL_BUILDING</IntlTypography>
          </Grid>
          <Disposal buildingOptions={buildingOptions} prefix="disposal" resource={resource} />
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ disposalService: props.disposalService, disposal: props.disposal, lead: props.lead }),

      handleSubmit: async (values, actions) => {
        try {
          await actions.props.onChangeAndSave(values.disposalService, values.disposal, values.lead)

          actions.setSubmitting(false)

          actions.resetForm()
          actions.props.nextPage()
        } catch (e) {
          actions.setStatus(e)
        }
      },
    })(DisposalService)
  )
)