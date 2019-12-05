import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button } from '@material-ui/core'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { FormikProps, Field, withFormik } from 'formik';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import { IPutServices } from '../../interfaces/IService';
import PageHeader from '../../components/PageHeader';
import FormikButtonCheckbox from '../../components/FormikFields/FormikButtonCheckbox';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  data: IPutServices
  onChangeAndSave: (data: IPutServices) => void
  nextPage: () => void
}

class Index extends React.Component<Props & FormikProps<IPutServices>, {}> {
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
    } = this.props

    const { data } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="SERVICES"/>

          <Field name="HasMoveServiceEnabled" label="MOVE" component={FormikButtonCheckbox} />

          <Field name="HasPackServiceEnabled" label="PACK" component={FormikButtonCheckbox} />

          <Field name="HasStorageServiceEnabled" label="STORAGE" component={FormikButtonCheckbox} />

          <Field name="HasDisposalServiceEnabled" label="DISPOSAL" component={FormikButtonCheckbox} />

          <Field name="HasCleaningServiceEnabled" label="CLEANING" component={FormikButtonCheckbox} />

          {status && status.msg && <div>{status.msg}</div>}

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, IPutServices>({
      mapPropsToValues: props => props.data,

      handleSubmit: async (values, actions) => {
        await actions.props.onChangeAndSave(values)
        actions.setSubmitting(false)


        actions.resetForm()
        actions.props.nextPage()
      }

    })(Index)
  )
)
