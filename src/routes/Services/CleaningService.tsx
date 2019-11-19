import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from '@material-ui/core'
import ResponsiveContainer from '../../components/ResponsiveContainer'
// import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import CounterTable, { Cart } from '../../components/ShopElements/CounterTable'
import GridSelect, { GridSelectItem } from '../../components/ShopElements/GridSelect'
import * as React from 'react'
import BigCheckbox from '../../components/Validator/BigCheckbox';
import { withResource, WithResourceProps } from '../../providers/withResource';
import { IPostMoveInBuilding, IPostMoveOutBuilding } from '../../interfaces/IBuilding';
import IntlTypography from '../../components/Intl/IntlTypography';
import ValidatedDatePicker from '../../components/Validator/ValidatedDatePicker';
// import TestService from 'services/TestService'
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from 'formik';
import TextField from '../../components/FormikFields/TextField';
import Switch from '../../components/FormikFields/Switch';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/DatePicker';
import { IPutServices, emptyServices, IPutMoveService, IPutPackService, IPutStorageService, IPutDisposalSerivce, IPutCleaningService } from '../../interfaces/IService';
import MoveInBuilding from '../Customer/MoveInBuilding';
import Select from '../../components/FormikFields/Select';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';
import PageHeader from '../../components/PageHeader';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values {
  cleaningService: IPutCleaningService
  moveOut: IPostMoveOutBuilding | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (cleaningSerivce: IPutCleaningService, moveOut: IPostMoveOutBuilding | null) => void
  HasMoveService: boolean
}

class CleaningService extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      status,
      resource,
      cleaningService,
      HasMoveService
    } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="CLEANING_SERVICE" />

          <Field name="cleaningService.HighPressureGarageCleaningService" label="HIGH_PRESSURE_GARAGE_CLEANING" component={Switch} />
          <Field name="cleaningService.HighPressureTerraceCleaningService" label="HIGH_PRESSURE_TERRACE_CLEANING" component={Switch} />
          <Field name="cleaningService.DovelholeService" label="DOVELHOLE" component={Switch} />
          <Field name="cleaningService.CleaningFireplaceService" label="CLEANING_FIREPLACE" component={Switch} />
          <Field name="cleaningService.CleaningCarpetService" label="CLEANING_CARPET" component={Switch} />
          <Field name="cleaningService.CleaningWindowsService" label="CLEANING_WINDOWS" component={Switch} />
          <Field name="cleaningService.CleaningWindowsWithShuttersService" label="CLEAING_WINDOWS_WITH_SHUTTER" component={Switch} />
          <Field name="cleaningService.CleaningSpecialService" label="CLEANING_SPECIAL" component={Switch} />
          <Field name="cleaningService.HandoutGaranty" label="HANDOUT_GARANTY" component={Switch} />

          <Field name="cleaningService.CleaningDate" label="CLEANING_DATE" component={DatePicker} />
          <Field name="cleaningService.HandOverDate" label="HANDOVER_DATE" component={DatePicker} />


          <Field name="cleaningService.Comment" label="COMMENT" component={TextField} />

          {/* Only show moveout when there is no MoveService */}
          {
            HasMoveService ? null : <MoveOut prefix={'moveOut'} resource={resource} />
          }

          {status && status.msg && <div>{status.msg}</div>}

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
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

      mapPropsToValues: props => ({ cleaningService: props.cleaningService, moveOut: props.moveOut }),

      handleSubmit: async (values, actions) => {
        console.log(values)
        // actions.props.
        await actions.props.onChangeAndSave(values.cleaningService, values.moveOut)

        actions.setSubmitting(false)
        actions.props.nextPage()
      }

    })(CleaningService)
  )
)