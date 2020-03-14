import { createStyles,   Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import {  FormikProps, Field,   withFormik } from "formik"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

import Form from "../../../components/FormikFields/Form"

import { IPutCleaningService } from "../../../interfaces/IService"
import PageHeader from "../../../components/PageHeader"
import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"
import FormikDivider from "../../../components/FormikFields/FormikDivider"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import IntlTypography from "../../../components/Intl/IntlTypography"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"

import { ILead } from "../../../interfaces/ILead"
import { IBuilding } from "../../../interfaces/IBuilding"
import GridContainer from "../../../components/GridContainer"
import NestedBuildingEdit from "./NestedBuildingEdit"
import SelectBuilding from "../../../components/FormikFields/Bundled/SelectBuilding"

const styles = (theme: Theme) => createStyles({})

interface Values {
  cleaningService: IPutCleaningService
  lead: ILead
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (cleaningSerivce: IPutCleaningService, lead: ILead) => Promise<any>
  buildings: IBuilding[]
  onSaveNestedBuildings: (buildings: IBuilding[]) => Promise<any>
}

class CleaningService extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, values, buildings, onSaveNestedBuildings } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="CLEANING_SERVICE" />
          <Field name="cleaningService.HighPressureTerraceCleaningService" label="HIGH_PRESSURE_TERRACE_CLEANING" component={FormikButtonCheckbox} />
          <Field name="cleaningService.HighPressureGarageCleaningService" label="HIGH_PRESSURE_GARAGE_CLEANING" component={FormikButtonCheckbox} />
          <Field name="cleaningService.DovelholeService" label="DOVELHOLE" component={FormikButtonCheckbox} />
          <Field name="cleaningService.CleaningFireplaceService" label="CLEANING_FIREPLACE" component={FormikButtonCheckbox} />
          <Field name="cleaningService.CleaningCarpetService" label="CLEANING_CARPET" component={FormikButtonCheckbox} />
          <Field name="cleaningService.CleaningWindowsService" label="CLEANING_WINDOWS" component={FormikButtonCheckbox} />
          <Field name="cleaningService.CleaningWindowsWithShuttersService" label="CLEAING_WINDOWS_WITH_SHUTTER" component={FormikButtonCheckbox} />
          <Field name="cleaningService.CleaningSpecialService" label="CLEANING_SPECIAL" component={FormikButtonCheckbox} />
          <Field name="cleaningService.HandoutGaranty" label="HANDOUT_GARANTY" component={FormikButtonCheckbox} />

          <FormikGroups label="APPOINTMENTS" xs={12}>
            <Field name="lead.CleaningDate" label="CLEANING_DATE" component={FormikDateTimePicker} />
            <Field name="lead.HandOverDate" label="HANDOVER_DATE" component={FormikDateTimePicker} />
          </FormikGroups>

          <Field name="cleaningService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12 }} />
        </Form>

        <GridContainer>
          <FormikDivider />

          <Grid item xs={12}>
            <IntlTypography variant="h6">CLEANING_BUILDING</IntlTypography>
          </Grid>

          <Field name="cleaningService.BuildingId" label="CLEANING_BUILDING" buildings={buildings} component={SelectBuilding} />

          <NestedBuildingEdit resource={resource} buildingId={values.cleaningService.BuildingId} buildings={buildings} saveBuildings={onSaveNestedBuildings} />
        </GridContainer>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ cleaningService: props.cleaningService, lead: props.lead }),

      handleSubmit: async (values, actions) => {
        try {
          await actions.props.onChangeAndSave(values.cleaningService, values.lead)

          actions.resetForm()
          actions.setSubmitting(false)
          actions.props.nextPage()
        } catch (e) {
          actions.setStatus(e)
        }
      },
    })(CleaningService)
  )
)
