import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../providers/withResource"
import { IPostMoveInBuilding, IPostMoveOutBuilding, IPostCleaningBuilding, emptyCleaningBuilding } from "../../interfaces/IBuilding"
// import TestService from 'services/TestService'
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from "formik"
import FormikTextField from "../../components/FormikFields/FormikTextField"
import * as Yup from "yup"
import Form from "../../components/FormikFields/Form"
import Submit from "../../components/FormikFields/Submit"
import { IPutCleaningService } from "../../interfaces/IService"
import MoveOut from "../../components/FormikFields/Bundled/MoveOut"
import PageHeader from "../../components/PageHeader"
import FormikButtonCheckbox from "../../components/FormikFields/FormikButtonCheckbox"
import FormikDivider from "../../components/FormikFields/FormikDivider"
import BuildingCopy, { IBuildingCopy, CombinedBuildings } from "../../components/FormikFields/Bundled/BuildingCopy"
import Cleaning from "../../components/FormikFields/Bundled/Cleaning"
import FormikDateTimePicker from "../../components/FormikFields/FormikDateTimePicker"
import IntlTypography from "../../components/Intl/IntlTypography"
import FormikGroups from "../../components/FormikFields/Bundled/Groups"
import HttpErrorHandler from "../../components/HttpErrorHandler"
import { ILead } from "../../interfaces/ILead"

const styles = (theme: Theme) => createStyles({})

interface Values {
  cleaningService: IPutCleaningService
  cleaning: IPostCleaningBuilding
  lead: ILead
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (cleaningSerivce: IPutCleaningService, cleaning: IPostCleaningBuilding, lead: ILead) => Promise<any>
  buildingOptions: IBuildingCopy
}

class CleaningService extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, buildingOptions, resource, values } = this.props

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

          <FormikDivider />
          <Grid item xs={12}>
            <IntlTypography variant="h6">CLEANING_BUILDING</IntlTypography>
          </Grid>

          <Cleaning buildingOptions={buildingOptions} prefix={"cleaning"} resource={resource} />
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ cleaningService: props.cleaningService, cleaning: props.cleaning, lead: props.lead }),

      handleSubmit: async (values, actions) => {
        try {
          await actions.props.onChangeAndSave(values.cleaningService, values.cleaning, values.lead)

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
