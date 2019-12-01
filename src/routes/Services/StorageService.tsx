import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from '@material-ui/core'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { IPostMoveInBuilding, IPostMoveOutBuilding } from '../../interfaces/IBuilding';
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from 'formik';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/FormikDatePicker';
import { IPutServices, emptyServices, IPutMoveService, IPutPackService, IPutStorageService } from '../../interfaces/IService';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';
import PageHeader from '../../components/PageHeader';
import FormikButtonCheckbox from '../../components/FormikFields/FormikButtonCheckbox';
import FormikDivider from '../../components/FormikFields/FormikDivider';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values {
  storageService: IPutStorageService
  moveOut: IPostMoveOutBuilding | null
  moveIn: IPostMoveInBuilding | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (storageService: IPutStorageService, moveOut: IPostMoveOutBuilding | null, moveIn: IPostMoveInBuilding | null) => void
  HasMoveService: boolean
}

class StorageService extends React.Component<Props & FormikProps<Values>, {}> {
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
      storageService,
      HasMoveService
    } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="STORAGE_SERVICE" />

          <Field name="storageService.MontageService" label="MONTAGE" component={FormikButtonCheckbox} />
          <Field name="storageService.BoreService" label="BORE" component={FormikButtonCheckbox} />
          <Field name="storageService.PianoService" label="KLAVIER" component={FormikButtonCheckbox} />
          <Field name="storageService.FurnitureLiftService" label="FURNITURE_LIFT" component={FormikButtonCheckbox} />
          <Field name="storageService.LampDemontageService" label="LAMP_DEMONTAGE" component={FormikButtonCheckbox} />
          <Field name="storageService.DeMontageService" label="DEMONTAGE" component={FormikButtonCheckbox} />

          <FormikDivider />

          <Field name="storageService.StorageDate" label="DATE_STORAGE_UNSTORE" component={DatePicker} />

          {/* Only show moveout when there is no MoveService
          {
            HasMoveService ? null : <MoveOut prefix={'moveOut'} resource={resource} />
          } */}

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

      mapPropsToValues: props => ({ storageService: props.storageService, moveOut: props.moveOut, moveIn: props.moveIn }),

      handleSubmit: async (values, actions) => {
        console.log(values)
        // actions.props.
        await actions.props.onChangeAndSave(values.storageService, values.moveOut, values.moveIn)

        actions.setSubmitting(false)
        actions.props.nextPage()
      }

    })(StorageService)
  )
)
