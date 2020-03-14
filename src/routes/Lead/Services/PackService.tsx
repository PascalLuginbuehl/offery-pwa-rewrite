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

const styles = (theme: Theme) => createStyles({})

interface Values {
  packService: IPutPackService
  buildings: IBuilding[]
  lead: ILead
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (packService: IPutPackService, buildings: IBuilding[], lead: ILead) => Promise<any>
}

class PackService extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, values } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="PACK_SERVICE" />

          <Field name="packService.HasOutService" label="WITH_UNPACK" component={FormikButtonCheckbox} />
          <Field name="packService.HeavyLiftService" label="HEAVY_LIFT_SERVICE" component={FormikButtonCheckbox} />

          <FormikGroups label="APPOINTMENTS" xs={12}>
            <Field name="lead.PackServiceDate" label="PACK_DATE" component={FormikDateTimePicker} />
          </FormikGroups>

          <Field name="packService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12 }} />

          <FormikDivider />
          <Grid item xs={12}>
            <IntlTypography variant="h6">MOVE_OUT_BUILDING</IntlTypography>
          </Grid>

          {/* <MoveOut buildingOptions={buildingOptions} prefix={"moveOut"} resource={resource} /> */}
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ packService: props.packService, buildings: props.buildings, lead: props.lead }),

      handleSubmit: async (values, actions) => {
        try {
          await actions.props.onChangeAndSave(values.packService, values.buildings, values.lead)

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
