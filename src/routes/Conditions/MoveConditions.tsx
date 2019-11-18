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
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps, FieldArray } from 'formik';
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
import { IMoveServiceConditions } from '../../interfaces/IConditions';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values extends IMoveServiceConditions {
}

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  nextPage: () => void
  onChangeAndSave: (moveConditions: IMoveServiceConditions) => void
  moveConditions: IMoveServiceConditions
}

class MoveConditions extends React.Component<Props & FormikProps<Values>, {}> {
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

    const prefix = "ServiceConditions"
    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MOVE_CONDITIONS" />

          <Field name="" label="DEFAULT" component={Switch} />
          <Field name="ServiceConditions.IsHourlyRate" label="IS_HOURLY_RATE" component={Switch} />
          <Field name="ServiceConditions.HasCostCeiling" label="HAS_COST_CEILING" component={Switch} />

          <Field label="AMOUNT_STAIRS_TO_ENTRY" name={`${prefix}.PricePerHour`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name={`${prefix}.MinHoursOfWork`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name={`${prefix}.MaxHoursOfWork`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name={`${prefix}.EstimatedHoursOfWorkWhenFixPrice`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <Field label="AMOUNT_STAIRS_TO_ENTRY" name={`${prefix}.WorkersAmount`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name={`${prefix}.DriveHours`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <Field name={`${prefix}.cleaningService.Comment`} label="COMMENT" component={TextField} />

          <Field label="AMOUNT_STAIRS_TO_ENTRY" name={`${prefix}.CostCeiling`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name={`${prefix}.FixPrice`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name={`${prefix}.Expenses`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name={`${prefix}.DiscountInPercent`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />


          <Field label="AMOUNT_STAIRS_TO_ENTRY" name="FurnitureLiftPrice" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name="PianoPrice" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name="MontageServicePrice" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name="DeMontageServicePrice" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name="LampDemontageAmount" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name="LampDemontagePrice" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name="BoreAmount" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="AMOUNT_STAIRS_TO_ENTRY" name="BorePrice" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <FieldArray
            name="CarAmounts"
            render={(arrayHelper) => (
              <div></div>
            )}
          />

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

      mapPropsToValues: props => ({...props.moveConditions }),

      handleSubmit: async (values, actions) => {
        console.log(values)
        // actions.props.
        await actions.props.onChangeAndSave(values)

        actions.setSubmitting(false)
        // actions.props.nextPage()
      }

    })(MoveConditions)
  )
)
