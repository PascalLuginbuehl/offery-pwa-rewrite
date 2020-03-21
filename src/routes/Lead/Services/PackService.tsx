import { createStyles,   Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import { FormikProps, Field, withFormik } from "formik"
import Form from "../../../components/FormikFields/Form"

import { IPutPackService } from "../../../interfaces/IService"
import PageHeader from "../../../components/PageHeader"
import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"
import FormikDivider from "../../../components/FormikFields/FormikDivider"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import IntlTypography from "../../../components/Intl/IntlTypography"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import { ILead } from "../../../interfaces/ILead"
import { IBuilding } from "../../../interfaces/IBuilding"
import NestedBuildingEdit from "./NestedBuildingEdit"
import GridContainer from "../../../components/GridContainer"
import SelectBuilding from "../../../components/FormikFields/Bundled/SelectBuilding"
import Submit from "../../../components/FormikFields/Submit"
import SubmitPadding from "../../../components/FormikFields/SubmitPadding"

const styles = (theme: Theme) => createStyles({})

interface Values {
  packService: IPutPackService
  lead: ILead
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  buildings: IBuilding[]
  onChangeAndSave: (packService: IPutPackService, lead: ILead) => Promise<any>
  onSaveNestedBuilding: (buildings: IBuilding) => Promise<any>
}

class PackService extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, values, selectedCompany, buildings, onSaveNestedBuilding } = this.props

    const initialDate = new Date()
    initialDate.setHours(selectedCompany.Settings.DefaultServiceTimeStart || 8)
    initialDate.setMinutes(0)
    initialDate.setSeconds(0)

    return (
      <Grid item xs={12}>
        <Form disableSubmit>
          <PageHeader title="PACK_SERVICE" />

          <Field name="packService.HasOutService" label="WITH_UNPACK" component={FormikButtonCheckbox} />
          <Field name="packService.HeavyLiftService" label="HEAVY_LIFT_SERVICE" component={FormikButtonCheckbox} />

          <FormikGroups label="APPOINTMENTS" xs={12}>
            <Field name="lead.PackServiceDate" label="PACK_DATE" component={FormikDateTimePicker} initialFocusedDate={initialDate}/>
          </FormikGroups>

          <Field name="packService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12 }} />

          <Submit isSubmitting={isSubmitting} disableSubmitPadding />
        </Form>


        <GridContainer>
          <FormikDivider />

          <Grid item xs={12}>
            <IntlTypography variant="h6">PACK_BUILDING</IntlTypography>
          </Grid>

          <Field name="packService.BuildingId" label="PACK_BUILDING" buildings={buildings} component={SelectBuilding} />
          <NestedBuildingEdit resource={resource} buildingId={values.packService.BuildingId} buildings={buildings} saveBuilding={onSaveNestedBuilding} />
        </GridContainer>

        <SubmitPadding />
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ packService: props.packService, lead: props.lead }),

      handleSubmit: async (values, actions) => {
        try {
          await actions.props.onChangeAndSave(values.packService, values.lead)

          actions.setSubmitting(false)

          actions.resetForm()
          actions.props.nextPage()
        } catch (e) {
          actions.setStatus(e)
        }
      },
    })(PackService)
  )
)
