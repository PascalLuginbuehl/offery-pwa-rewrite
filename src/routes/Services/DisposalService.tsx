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
import FormikTextField from '../../components/FormikFields/FormikTextField';
import Switch from '../../components/FormikFields/Switch';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/FormikDatePicker';
import { IPutServices, emptyServices, IPutMoveService, IPutPackService, IPutStorageService, IPutDisposalSerivce } from '../../interfaces/IService';
import MoveInBuilding from '../Customer/MoveInBuilding';
import Select from '../../components/FormikFields/Select';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';
import PageHeader from '../../components/PageHeader';
import FormikButtonCheckbox from '../../components/FormikFields/FormikButtonCheckbox';
import FormikDivider from '../../components/FormikFields/FormikDivider';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values {
  disposalService: IPutDisposalSerivce
  moveOut: IPostMoveOutBuilding | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (disposalService: IPutDisposalSerivce, moveOut: IPostMoveOutBuilding | null) => void
  HasMoveService: boolean
}

class DisposalService extends React.Component<Props & FormikProps<Values>, {}> {
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
      disposalService,
      HasMoveService
    } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="DISPOSAL_SERVICE" />

          <Field name="disposalService.FurnitureLiftService" label="FURNITURE_LIFT" component={FormikButtonCheckbox} />
          <Field name="disposalService.LampDemontageService" label="LAMP_DEMONTAGE" component={FormikButtonCheckbox} />
          <Field name="disposalService.DeMontage" label="DEMONTAGE" component={FormikButtonCheckbox} />

          <FormikDivider />

          <Field name="disposalService.DisposalDate" label="DISPOSAL_DATE" component={DatePicker} />

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

      mapPropsToValues: props => ({ disposalService: props.disposalService, moveOut: props.moveOut }),

      handleSubmit: async (values, actions) => {
        console.log(values)
        // actions.props.
        await actions.props.onChangeAndSave(values.disposalService, values.moveOut)

        actions.setSubmitting(false)
        actions.props.nextPage()
      }

    })(DisposalService)
  )
)
