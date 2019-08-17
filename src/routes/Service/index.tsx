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
import { IPostMoveService } from '../../interfaces/IService';
import ValidatedDatePicker from '../../components/Validator/ValidatedDatePicker';
// import TestService from 'services/TestService'
import { Formik, FormikActions, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from 'formik';
import TextField from '../../components/FormikFields/TextField';
import Switch from '../../components/FormikFields/Switch';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/DatePicker';


const styles = (theme: Theme) =>
  createStyles({

  })

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedFormikProps<{}, IPostMoveService> {
  onChange: (data: IPostMoveService) => void
  data: IPostMoveService
  save: () => Promise<void>
}

class Index extends React.Component<Props, {}> {
  public render() {
    const {errors, status, touched, isSubmitting} = this.props
    console.log(props)
    return (
      <Grid item xs={12}>
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
      </Grid>
    )
  }
}

export default withStyles(styles)(withResource(withFormik({
  validationSchema: Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
    }),
    handleSubmit: (values, actions) => {

    }
})(Index)))
