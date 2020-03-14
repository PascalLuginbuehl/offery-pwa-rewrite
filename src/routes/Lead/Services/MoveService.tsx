import { createStyles, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import { IBuilding } from "../../../interfaces/IBuilding"
import { FormikProps, Field, withFormik } from "formik"
import Form from "../../../components/FormikFields/Form"

import PageHeader from "../../../components/PageHeader"
import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"
import FormikDivider from "../../../components/FormikFields/FormikDivider"
import IntlTypography from "../../../components/Intl/IntlTypography"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import { IPutMoveService } from "../../../interfaces/IService"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import { ILead } from "../../../interfaces/ILead"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

const styles = (theme: Theme) => createStyles({})

interface Values {
  moveService: IPutMoveService
  buildings: IBuilding[]
  lead: ILead
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (moveService: IPutMoveService, buildings: IBuilding[], lead: ILead) => Promise<any>
}

class Index extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, buildings } = this.props

    // const { data } = this.props

    console.log(this.props)
    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MOVE_SERVICE" />

          <Field name="moveService.BoreService" label="BORE_SERVICE" component={FormikButtonCheckbox} />
          <Field name="moveService.LampDemontageService" label="LAMP_DEMONTAGE_SERVICE" component={FormikButtonCheckbox} />
          <Field name="moveService.FurnitureLiftService" label="FURNITURE_LIFT_SERVICE" component={FormikButtonCheckbox} />
          <Field name="moveService.PianoService" label="PIANO_SERVICE" component={FormikButtonCheckbox} />
          <Field name="moveService.MontageService" label="MONTAGE_SERVICE" component={FormikButtonCheckbox} />
          <Field name="moveService.DeMontageService" label="DE_MONTAGE_SERVICE" component={FormikButtonCheckbox} />
          <Field name="moveService.HeavyLiftService" label="HEAVY_LIFT_SERVICE" component={FormikButtonCheckbox} />

          <FormikGroups label="APPOINTMENTS" xs={12}>
            <Field name="lead.MoveDate" label="MOVE_DATE" component={FormikDateTimePicker} />
          </FormikGroups>

          <Field name="moveService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12 }} />

          <FormikDivider />
          <Grid item xs={12}>
            <IntlTypography variant="h6">MOVE_OUT_BUILDING</IntlTypography>
          </Grid>
          {/* <MoveOut buildingOptions={buildingOptions} prefix={"moveOut"} resource={resource} /> */}

          <Grid item xs={12}>
            <IntlTypography variant="h6">MOVE_IN_BUILDING</IntlTypography>
          </Grid>

          {/* <MoveIn buildingOptions={buildingOptions} prefix={"moveIn"} resource={resource} /> */}
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ buildings: props.buildings, moveService: props.moveService, lead: props.lead }),

      handleSubmit: async (values, actions) => {
        try {
          await actions.props.onChangeAndSave(values.moveService, values.buildings, values.lead)

          actions.setSubmitting(false)

          actions.resetForm()
          actions.props.nextPage()
        } catch (e) {
          actions.setStatus(e)
        }
      },
    })(Index)
  )
)
