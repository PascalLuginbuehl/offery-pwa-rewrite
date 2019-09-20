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
import { Formik, FormikActions, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from 'formik';
import TextField from '../../components/FormikFields/TextField';
import Switch from '../../components/FormikFields/Switch';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/DatePicker';
import { IPutServices, emptyServices, IPutMoveService } from '../../interfaces/IService';
import MoveInBuilding from '../Customer/MoveInBuilding';
import Select from '../../components/FormikFields/Select';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values {
  moveService: IPutMoveService
  moveIn: IPostMoveInBuilding | null
  moveOut: IPostMoveOutBuilding | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  onChangeAndSave: (data: IPutMoveService) => void
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
          <Grid item xs={12}>
            <IntlTypography variant="h5">SHOP</IntlTypography>
          </Grid>

          <Button
            onClick={() => handleChange({ target: { value: date, name } })}
          />


          <Field name="moveService.MoveDate" label="MOVE_DATE" component={DatePicker} />

          {/* MoveOut */}
          {/* <AddressField
            value={Address}
            name="Address"
            onChange={this.handleChange}
          /> */}

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
        // await actions.props.onChangeAndSave(values)

        actions.setSubmitting(false)
      }

    })(Index)
  )
)
