import { createStyles, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import { FormikProps, Field, withFormik } from "formik"
import Form from "../../../components/FormikFields/Form"
import { IPutDisposalService } from "../../../interfaces/IService"
import PageHeader from "../../../components/PageHeader"
import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"
import FormikDivider from "../../../components/FormikFields/FormikDivider"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import IntlTypography from "../../../components/Intl/IntlTypography"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import { ILead } from "../../../interfaces/ILead"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import { IBuilding } from "../../../interfaces/IBuilding"
import SelectBuilding from "../../../components/FormikFields/Bundled/SelectBuilding"
import NestedBuildingEdit from "./NestedBuildingEdit"
import GridContainer from "../../../components/GridContainer"
import Submit from "../../../components/FormikFields/Submit"
import SubmitPadding from "../../../components/FormikFields/SubmitPadding"

const styles = (theme: Theme) => createStyles({})

interface Values {
  disposalService: IPutDisposalService
  lead: ILead
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  buildings: IBuilding[]
  onChangeAndSave: (disposalService: IPutDisposalService, lead: ILead) => Promise<any>
  onSaveNestedBuilding: (buildings: IBuilding) => Promise<any>
}

class DisposalService extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, buildings, values, onSaveNestedBuilding } = this.props

    return (
      <Grid item xs={12}>
        <Form disableSubmit>
          <PageHeader title="DISPOSAL_SERVICE" />

          <Field name="disposalService.LampDemontageService" label="LAMP_DEMONTAGE" component={FormikButtonCheckbox} />
          <Field name="disposalService.FurnitureLiftService" label="FURNITURE_LIFT" component={FormikButtonCheckbox} />
          <Field name="disposalService.DeMontage" label="DEMONTAGE" component={FormikButtonCheckbox} />
          <Field name="disposalService.HeavyLiftService" label="HEAVY_LIFT_SERVICE" component={FormikButtonCheckbox} />

          <FormikGroups label="APPOINTMENTS" xs={12}>
            <Field name="lead.DisposalDate" label="DISPOSAL_DATE" component={FormikDateTimePicker} />
          </FormikGroups>

          <Field name="disposalService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12 }} />

          <Submit isSubmitting={isSubmitting} disableSubmitPadding />
        </Form>

        <GridContainer>
          <FormikDivider />

          <Grid item xs={12}>
            <IntlTypography variant="h6">DISPOSAL_BUILDING</IntlTypography>
          </Grid>

          <Field name="disposalService.BuildingId" label="DISPOSAL_BUILDING" buildings={buildings} component={SelectBuilding} />
          <NestedBuildingEdit resource={resource} buildingId={values.disposalService.BuildingId} buildings={buildings} saveBuilding={onSaveNestedBuilding} />
        </GridContainer>

        <SubmitPadding />
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ disposalService: props.disposalService, lead: props.lead }),

      handleSubmit: async (values, actions) => {
        try {
          await actions.props.onChangeAndSave(values.disposalService, values.lead)

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
