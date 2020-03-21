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
import SelectBuilding from "../../../components/FormikFields/Bundled/SelectBuilding"
import NestedBuildingEdit from "./NestedBuildingEdit"
import GridContainer from "../../../components/GridContainer"
import Submit from "../../../components/FormikFields/Submit"
import SubmitPadding from "../../../components/FormikFields/SubmitPadding"

const styles = (theme: Theme) => createStyles({})

interface Values {
  moveService: IPutMoveService
  lead: ILead
}


interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  buildings: IBuilding[]
  onChangeAndSave: (moveService: IPutMoveService, lead: ILead) => Promise<any>
  onSaveNestedBuilding: (building: IBuilding) => Promise<any>
}

class Index extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, selectedCompany, buildings, values, onSaveNestedBuilding } = this.props

    const initialDate = new Date()
    initialDate.setDate(initialDate.getDate() + 7)
    initialDate.setHours(selectedCompany.Settings.DefaultServiceTimeStart || 8)
    initialDate.setMinutes(0)
    initialDate.setSeconds(0)

    // const { data } = this.props
    return (
      <Grid item xs={12}>
        <Form disableSubmit>
          <PageHeader title="MOVE_SERVICE" />

          <Field name="moveService.BoreService" label="BORE_SERVICE" component={FormikButtonCheckbox} />
          <Field name="moveService.LampDemontageService" label="LAMP_DEMONTAGE_SERVICE" component={FormikButtonCheckbox} />
          <Field name="moveService.FurnitureLiftService" label="FURNITURE_LIFT_SERVICE" component={FormikButtonCheckbox} />
          <Field name="moveService.PianoService" label="PIANO_SERVICE" component={FormikButtonCheckbox} />
          <Field name="moveService.MontageService" label="MONTAGE_SERVICE" component={FormikButtonCheckbox} />
          <Field name="moveService.DeMontageService" label="DE_MONTAGE_SERVICE" component={FormikButtonCheckbox} />
          <Field name="moveService.HeavyLiftService" label="HEAVY_LIFT_SERVICE" component={FormikButtonCheckbox} />

          <FormikGroups label="APPOINTMENTS" xs={12}>
            <Field name="lead.MoveDate" label="MOVE_DATE" component={FormikDateTimePicker} initialFocusedDate={initialDate} />
          </FormikGroups>

          <Field name="moveService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12 }} />

          <Submit isSubmitting={isSubmitting} disableSubmitPadding />
        </Form>

        <GridContainer>
          <FormikDivider />

          <Grid item xs={12}>
            <IntlTypography variant="h6">MOVE_OUT_BUILDING</IntlTypography>
          </Grid>
          <Field name="moveService.OutBuildingId" label="MOVE_OUT_BUILDING" buildings={buildings} component={SelectBuilding} />
          <NestedBuildingEdit resource={resource} buildingId={values.moveService.OutBuildingId} buildings={buildings} saveBuilding={onSaveNestedBuilding} />

          <Grid item xs={12}>
            <IntlTypography variant="h6">MOVE_IN_BUILDING</IntlTypography>
          </Grid>
          <Field name="moveService.InBuildingId" label="MOVE_IN_BUILDING" buildings={buildings} component={SelectBuilding} />
          <NestedBuildingEdit resource={resource} buildingId={values.moveService.InBuildingId} buildings={buildings} saveBuilding={onSaveNestedBuilding} />
        </GridContainer>

        <SubmitPadding />
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ moveService: props.moveService, lead: props.lead }),

      handleSubmit: async (values, actions) => {
        try {
          await actions.props.onChangeAndSave(values.moveService, values.lead)

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
