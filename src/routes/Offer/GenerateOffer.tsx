import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from '@material-ui/core'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from 'formik';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';

import PageHeader from '../../components/PageHeader';
const styles = (theme: Theme) =>
  createStyles({

  })


interface Values {

}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
}

class GenerateOffer extends React.Component<Props & FormikProps<Values>, {}> {
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
    } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="GENERATE_OFFER" />


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

      mapPropsToValues: props => ({  }),

      handleSubmit: async (values, actions) => {
        // console.log(values)
        // // actions.props.
        // await actions.props.onChangeAndSave(values.cleaningService, values.moveOut)

        // actions.setSubmitting(false)
        // actions.props.nextPage()
      }

    })(GenerateOffer)
  )
)
