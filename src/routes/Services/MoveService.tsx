import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from '@material-ui/core'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { IPostMoveInBuilding, IPostMoveOutBuilding } from '../../interfaces/IBuilding';
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from 'formik';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/FormikDatePicker';
import { IPutServices, emptyServices, IPutMoveService } from '../../interfaces/IService';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';
import PageHeader from '../../components/PageHeader';
import FormikButtonCheckbox from '../../components/FormikFields/FormikButtonCheckbox';
import FormikDivider from '../../components/FormikFields/FormikDivider';
import IntlTypography from '../../components/Intl/IntlTypography';
import MoveIn from '../../components/FormikFields/Bundled/MoveIn';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values {
  moveService: IPutMoveService
  moveIn: IPostMoveInBuilding | null
  moveOut: IPostMoveOutBuilding | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (moveService: IPutMoveService, moveIn: IPostMoveInBuilding | null, moveOut: IPostMoveOutBuilding | null) => void
}

class Index extends React.Component<Props & FormikProps<Values>, {}> {
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
      resource
    } = this.props

    // const { data } = this.props

    console.log(this.props)
    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MOVE_SERVICE" />

          <Field name="moveService.BoreService" label="BORE_SERVICE" component={FormikButtonCheckbox} />

          <Field name="moveService.DeMontageService" label="DE_MONTAGE_SERVICE" component={FormikButtonCheckbox} />

          <Field name="moveService.FurnitureLiftService" label="FURNITURE_LIFT_SERVICE" component={FormikButtonCheckbox} />

          <Field name="moveService.LampDemontageService" label="LAMP_DEMONTAGE_SERVICE" component={FormikButtonCheckbox} />

          <Field name="moveService.MontageService" label="MONTAGE_SERVICE" component={FormikButtonCheckbox} />

          <Field name="moveService.PianoService" label="PIANO_SERVICE" component={FormikButtonCheckbox} />

          <FormikDivider />

          <Field name="moveService.MoveDate" label="MOVE_DATE" component={DatePicker} />

          <Grid item xs={12}>
            <IntlTypography variant="body1">MOVE_OUT_BUILDING</IntlTypography>
          </Grid>

          <MoveOut prefix={"moveOut"} resource={resource} />

          <Grid item xs={12}>
            <IntlTypography variant="body1">MOVE_IN_BUILDING</IntlTypography>
          </Grid>
          <MoveIn prefix={"moveIn"} resource={resource} />

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

      mapPropsToValues: props => ({ moveIn: props.moveIn, moveOut: props.moveOut, moveService: props.moveService}),

      handleSubmit: async (values, actions) => {
        console.log(values)
        // actions.props.
        await actions.props.onChangeAndSave(values.moveService, values.moveIn, values.moveOut)

        actions.setSubmitting(false)
        actions.props.nextPage()
      }

    })(Index)
  )
)
