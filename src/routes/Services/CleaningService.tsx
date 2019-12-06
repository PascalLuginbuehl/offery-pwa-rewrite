import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from '@material-ui/core'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { IPostMoveInBuilding, IPostMoveOutBuilding, IPostCleaningBuilding } from '../../interfaces/IBuilding';
// import TestService from 'services/TestService'
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from 'formik';
import FormikTextField from '../../components/FormikFields/FormikTextField';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import { IPutCleaningService } from '../../interfaces/IService';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';
import PageHeader from '../../components/PageHeader';
import FormikButtonCheckbox from '../../components/FormikFields/FormikButtonCheckbox';
import FormikDivider from '../../components/FormikFields/FormikDivider';
import BuildingCopy, { IBuildingCopy } from '../../components/FormikFields/Bundled/BuildingCopy';
import Cleaning from '../../components/FormikFields/Bundled/Cleaning';
import FormikDateTimePicker from '../../components/FormikFields/FormikDateTimePicker';
import IntlTypography from '../../components/Intl/IntlTypography';
import FormikGroups from '../../components/FormikFields/Bundled/Groups';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values {
  cleaningService: IPutCleaningService
  cleaning: IPostCleaningBuilding | null
}


interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (cleaningSerivce: IPutCleaningService, cleaning: IPostCleaningBuilding | null) => void
  buildingOptions: IBuildingCopy
}

class CleaningService extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, buildingOptions, resource } = this.props

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
            <Field name="cleaningService.CleaningDate" label="CLEANING_DATE" component={FormikDateTimePicker} />
            <Field name="cleaningService.HandOverDate" label="HANDOVER_DATE" component={FormikDateTimePicker} />
          </FormikGroups>

          <Field name="cleaningService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12 }} />

          <FormikDivider />
          <Grid item xs={12}>
            <IntlTypography variant="h6">CLEANING_BUILDING</IntlTypography>
          </Grid>
          <BuildingCopy buildings={buildingOptions} onCopy={this.handleCopy} />

          <Cleaning prefix={"cleaning"} resource={resource} />

          {status && status.msg && <div>{status.msg}</div>}
          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }

  handleCopy = () => {

  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      validationSchema: Yup.object().shape({
        // email: Yup.string()
        //   .email()
        //   .required(),
      }),

      mapPropsToValues: props => ({ cleaningService: props.cleaningService, cleaning: props.cleaning }),

      handleSubmit: async (values, actions) => {
        console.log(values)
        // actions.props.
        await actions.props.onChangeAndSave(values.cleaningService, values.cleaning)

        actions.setSubmitting(false)
        actions.props.nextPage()
      },
    })(CleaningService)
  )
)
