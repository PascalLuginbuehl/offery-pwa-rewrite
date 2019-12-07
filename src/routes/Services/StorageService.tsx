import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from '@material-ui/core'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { IPostMoveInBuilding, IPostMoveOutBuilding, IPostStorageBuilding } from '../../interfaces/IBuilding';
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from 'formik';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import { IPutServices, emptyServices, IPutMoveService, IPutPackService, IPutStorageService } from '../../interfaces/IService';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';
import PageHeader from '../../components/PageHeader';
import FormikButtonCheckbox from '../../components/FormikFields/FormikButtonCheckbox';
import FormikDivider from '../../components/FormikFields/FormikDivider';
import Storage from '../../components/FormikFields/Bundled/Storage';
import IntlTypography from '../../components/Intl/IntlTypography';
import FormikGroups from '../../components/FormikFields/Bundled/Groups';
import FormikDateTimePicker from '../../components/FormikFields/FormikDateTimePicker';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values {
  storageService: IPutStorageService
  storage: IPostStorageBuilding
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (storageService: IPutStorageService, storage: IPostStorageBuilding | null) => void
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
    } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="STORAGE_SERVICE" />

          <Field name="storageService.BoreService" label="BORE" component={FormikButtonCheckbox} />
          <Field name="storageService.LampDemontageService" label="LAMP_DEMONTAGE" component={FormikButtonCheckbox} />
          <Field name="storageService.FurnitureLiftService" label="FURNITURE_LIFT" component={FormikButtonCheckbox} />
          <Field name="storageService.PianoService" label="PIANO" component={FormikButtonCheckbox} />
          <Field name="storageService.MontageService" label="MONTAGE" component={FormikButtonCheckbox} />
          <Field name="storageService.DeMontageService" label="DEMONTAGE" component={FormikButtonCheckbox} />

          <FormikGroups label="APPOINTMENTS" xs={12}>
            <Field name="storageService.StorageDate" label="STORAGE_UNSTORE" component={FormikDateTimePicker} />
          </FormikGroups>

          <FormikDivider />
          <Grid item xs={12}>
            <IntlTypography variant="h6">STORAGE_BUILDING</IntlTypography>
          </Grid>

          <Storage prefix={"storage"} resource={resource} />


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

      mapPropsToValues: props => ({ storageService: props.storageService, storage: props.storage }),

      handleSubmit: async (values, actions) => {
        await actions.props.onChangeAndSave(values.storageService, values.storage)

        actions.setSubmitting(false)

        actions.resetForm()
        actions.props.nextPage()
      },
    })(StorageService)
  )
)
