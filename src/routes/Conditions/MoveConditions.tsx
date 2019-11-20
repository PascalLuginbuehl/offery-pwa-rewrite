import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, TextField as MuiTextField } from '@material-ui/core'
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
import FormikTextField from '../../components/FormikFields/FormikTextField';
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
import { injectIntl, InjectedIntlProps } from 'react-intl';
import FormikPrice from '../../components/FormikFields/Numbers/FormikPrice';
import FormikPercent from '../../components/FormikFields/Numbers/FormikPercent';
import FormikNumberEndAdornmentText from '../../components/FormikFields/Numbers/FormikNumberEndAdornmentText';

const styles = (theme: Theme) =>
  createStyles({

  })

// Transform Tabs to lowercase
const SmallerTab = withStyles({
  root: {
    "textTransform": "none"
  },
})(Tab)


interface Values extends IMoveServiceConditions {
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (moveConditions: IMoveServiceConditions) => void
  moveConditions: IMoveServiceConditions
}

class MoveConditions extends React.Component<Props & FormikProps<Values>, {}> {
  getRateProfile = (IsHourlyRate: boolean, HasCostCeiling: boolean) => {
    if (HasCostCeiling) {
      return 2
    } else if (IsHourlyRate) {
      return 1
    } else {
      return 0
    }
  }


  handleSetRateProfile = (e: React.ChangeEvent<{}>, position: number) => {
    //@ts-ignore
    this.props.setFieldValue("ServiceConditions.IsHourlyRate", false)
    //@ts-ignore
    this.props.setFieldValue("ServiceConditions.HasCostCeiling", false)

    if(position === 0) {
      return
    } else if(position === 1) {
      //@ts-ignore
      this.props.setFieldValue("ServiceConditions.IsHourlyRate", true)
    } else if (position === 2) {
      //@ts-ignore
      this.props.setFieldValue("ServiceConditions.HasCostCeiling", true)
    }
  }


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
      intl,
      resource,
    } = this.props

    const prefix = "ServiceConditions"
    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MOVE_CONDITIONS" />

          <Grid item xs={12}>
            <Tabs
              value={this.getRateProfile(values.ServiceConditions.IsHourlyRate, values.ServiceConditions.HasCostCeiling)}
              onChange={this.handleSetRateProfile}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              centered

            >
              <SmallerTab label={intl.formatMessage({ id: "IS_HOURLY_RATE" })} value={1} />
              <SmallerTab label={intl.formatMessage({ id: "FIX_PRICE" })} value={0} />
              <SmallerTab label={intl.formatMessage({ id: "HAS_COST_CEILING" })} value={2} />
            </Tabs>
          </Grid>
          {
            /* default */
          }
          <Field label="WORKERS_AMOUNT" name={`ServiceConditions.WorkersAmount`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} />

          {values.ServiceConditions.IsHourlyRate || values.ServiceConditions.HasCostCeiling ? (
            <>
              <Field label="PRICE_PER_HOUR" name={`ServiceConditions.PricePerHour`} component={FormikNumberEndAdornmentText} adornmentText="CHF/h" />

              <Field label="EXPENSES" name={`ServiceConditions.Expenses`} component={FormikPrice} />

              <Field label="FURNITURE_LIFT_PRICE" name="FurnitureLiftPrice" component={FormikPrice} />

              <Field label="PIANO_PRICE" name="PianoPrice" component={FormikPrice} />

              <Grid item xs={12} />


              <Field label="BORE_AMOUNT" name="BoreAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: 3 }} />
              <Field label="BORE_PRICE" name="BorePrice" component={FormikPrice} />

              <Grid item xs={12} />


              <Field label="LAMP_DEMONTAGE_AMOUNT" name="LampDemontageAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} />
              <Field label="LAMP_DEMONTAGE_PRICE" name="LampDemontagePrice" component={FormikPrice} />

              <Grid item xs={12} />

              <Field label="MONTAGE_SERVICE_PRICE" name="MontageServicePrice" component={FormikPrice} />
              <Field label="DE_MONTAGE_SERVICE_PRICE" name="DeMontageServicePrice" component={FormikPrice} />

              <Field label="MIN_HOURS_OF_WORK" name={`ServiceConditions.MinHoursOfWork`} component={FormikNumberEndAdornmentText} adornmentText="h" overrideGrid={{ xs: 6 }} />
              <Field label="MAX_HOURS_OF_WORK" name={`ServiceConditions.MaxHoursOfWork`} component={FormikNumberEndAdornmentText} adornmentText="h" overrideGrid={{ xs: 6 }} />


              <Field label="DRIVE_HOURS" name={`ServiceConditions.DriveHours`} component={FormikNumberEndAdornmentText} adornmentText="h"  />

              <Field label="ESTIMATED_HOURS_OF_WORKING_WHEN_FIX_PRICE" name={`ServiceConditions.EstimatedHoursOfWorkWhenFixPrice`} component={FormikNumberEndAdornmentText} adornmentText="h"  />

              <Grid item xs={12} />

              {/* Calculations */}
              <Grid item xs={5} md={2}>
                <MuiTextField label={intl.formatMessage({ id: "MIN_PRICE" })} value={this.getMinPrice()} disabled={true} type="number" InputProps={{ startAdornment: (<InputAdornment position="start">CHF</InputAdornment>) }} />
              </Grid>
              <Grid item xs={5} md={2}>
                <MuiTextField label={intl.formatMessage({ id: "MAX_PRICE" })} value={this.getMaxPrice()} disabled={true} type="number" InputProps={{ startAdornment: (<InputAdornment position="start">CHF</InputAdornment>)}} />
              </Grid>

              <Field label="DISCOUNT_IN_PERCENT" name={`ServiceConditions.DiscountInPercent`} component={FormikPercent} overrideGrid={{ xs: 2, md: undefined }} />

            </>
          ) : null}

          {
            values.ServiceConditions.HasCostCeiling ? (
              <Field label="COST_CEILING" name={`ServiceConditions.CostCeiling`} component={FormikPrice} />
            ) : null
          }

          {
            !values.ServiceConditions.HasCostCeiling && !values.ServiceConditions.IsHourlyRate ? (
              <Field label="FIX_PRICE" name={`ServiceConditions.FixPrice`} component={FormikPrice} />
          ) : null}

          <Field name={`${prefix}.Comment`} label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

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

  getRestCosts = (): number => {
    const { values: { ServiceConditions: { Expenses }, PianoPrice, LampDemontagePrice, FurnitureLiftPrice, BorePrice } } = this.props

    return (Expenses ? Expenses : 0) + (PianoPrice ? PianoPrice : 0) + (LampDemontagePrice ? LampDemontagePrice : 0) + (FurnitureLiftPrice ? FurnitureLiftPrice : 0) + (BorePrice ? BorePrice : 0)
  }

  getMinPrice = (): number | null => {
    const { values: { ServiceConditions: { WorkersAmount, PricePerHour, MinHoursOfWork} } } = this.props

    if(WorkersAmount && PricePerHour && MinHoursOfWork) {

      return WorkersAmount * PricePerHour * MinHoursOfWork + this.getRestCosts()
    }

    return null
  }
  getMaxPrice = () => {
    const { values: {ServiceConditions: { WorkersAmount, PricePerHour, MaxHoursOfWork} } } = this.props

    if (WorkersAmount && PricePerHour && MaxHoursOfWork) {
      return WorkersAmount * PricePerHour * MaxHoursOfWork + this.getRestCosts()
    }

    return null
  }
}

export default injectIntl(
  withStyles(styles)(
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
)
