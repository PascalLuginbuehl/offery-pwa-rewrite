import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button } from '@material-ui/core'
import ResponsiveContainer from '../../components/ResponsiveContainer'
// import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import CounterTable, { Cart } from '../../components/ShopElements/CounterTable'
import GridSelect, { GridSelectItem } from '../../components/ShopElements/GridSelect'
import * as React from 'react'
import BigCheckbox from '../../components/Validator/BigCheckbox';
import { withResource, WithResourceProps } from '../../providers/withResource';
import { IPostMoveInBuilding } from '../../interfaces/IBuilding';
import IntlTypography from '../../components/Intl/IntlTypography';
import ValidatedDatePicker from '../../components/Validator/ValidatedDatePicker';
// import TestService from 'services/TestService'
import { Formik, FormikActions, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from 'formik';
import TextField from '../../components/FormikFields/TextField';
import Switch from '../../components/FormikFields/Switch';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/DatePicker';
import { IPutServices, emptyServices } from '../../interfaces/IService';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  onChange: (data: IPutServices) => void
  data: IPutServices
  save: () => Promise<void>
}

class Index extends React.Component<Props, {}> {
  public render() {
    const { data } = this.props

    console.log(this.props)
    return (
      <Grid item xs={12}>
        <Formik<IPutServices>
          initialValues={data}
          validationSchema={
            Yup.object().shape({
              // email: Yup.string()
              //   .email()
              //   .required(),
            })
          }

          onSubmit={(values, actions) => {
            this.props.onChange(values)
            console.log(values)

            actions.setSubmitting(false)
          }}

          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <Grid item xs={12}>
                <IntlTypography variant="h5">SERVICES</IntlTypography>
              </Grid>

              <Field name="HasMoveServiceEnabled" label="MOVE" component={Switch} />

              <Field name="HasPackServiceEnabled" label="PACK" component={Switch} />

              <Field name="HasStorageServiceEnabled" label="STORAGE" component={Switch} />

              <Field name="HasDisposalServiceEnabled" label="DISPOSAL" component={Switch} />

              <Field name="HasCleaningServiceEnabled" label="CLEANING" component={Switch} />

              {status && status.msg && <div>{status.msg}</div>}

              <Submit isSubmitting={isSubmitting}></Submit>
            </Form>
          )}
        />
      </Grid>
    )
  }
}

export default withStyles(styles)(withResource(Index))
