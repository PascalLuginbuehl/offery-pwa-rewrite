import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, TextField as MuiTextField, Divider, Typography } from '@material-ui/core'
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
import DatePicker from '../../components/FormikFields/FormikDatePicker';
import { IPutServices, emptyServices, IPutMoveService, IPutPackService, IPutStorageService, IPutDisposalSerivce, IPutCleaningService } from '../../interfaces/IService';
import MoveInBuilding from '../Customer/MoveInBuilding';
import Select from '../../components/FormikFields/Select';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';
import PageHeader from '../../components/PageHeader';
import { IMoveServiceConditions, IServiceConditions } from '../../interfaces/IConditions';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import FormikPrice from '../../components/FormikFields/Numbers/FormikPrice';
import FormikPercent from '../../components/FormikFields/Numbers/FormikPercent';
import FormikNumberEndAdornmentText from '../../components/FormikFields/Numbers/FormikNumberEndAdornmentText';
import FormikDivider from '../../components/FormikFields/FormikDivider';
import FormikGroups from './Groups';

const styles = (theme: Theme) =>
  createStyles({

  })


interface Props<Values extends {ServiceConditions: IServiceConditions}> extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  setFieldValue: (field: keyof Values | any, value: any) => void
  values: Values
  additionalCost: number
}

class ServiceConditionsBundle<Values extends { ServiceConditions: IServiceConditions }> extends React.Component<Props<Values>, {}> {
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
    this.props.setFieldValue("ServiceConditions.IsHourlyRate", false)
    this.props.setFieldValue("ServiceConditions.HasCostCeiling", false)

    if (position === 0) {
      return
    } else if (position === 1) {
      this.props.setFieldValue("ServiceConditions.IsHourlyRate", true)
    } else if (position === 2) {
      this.props.setFieldValue("ServiceConditions.HasCostCeiling", true)
    }
  }


  public render() {
    const {
      values,
      children,

      intl,
      selectedCompany,
    } = this.props

    console.log(selectedCompany.CarTypes)

    return (
      <>
        <Grid item xs={12}>
          <Tabs
            value={this.getRateProfile(values.ServiceConditions.IsHourlyRate, values.ServiceConditions.HasCostCeiling)}
            onChange={this.handleSetRateProfile}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            centered

          >
            <Tab label={intl.formatMessage({ id: "IS_HOURLY_RATE" })} value={1} />
            <Tab label={intl.formatMessage({ id: "FIX_PRICE" })} value={0} />
            <Tab label={intl.formatMessage({ id: "HAS_COST_CEILING" })} value={2} />
          </Tabs>
        </Grid>

        <Field label="WORKERS_AMOUNT" name={`ServiceConditions.WorkersAmount`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: 3 }} />

        {values.ServiceConditions.IsHourlyRate || values.ServiceConditions.HasCostCeiling ? (
          <>
            <Field label="PRICE_PER_HOUR" name={`ServiceConditions.PricePerHour`} component={FormikNumberEndAdornmentText} adornmentText="CHF/h" />

            <Field label="EXPENSES" name={`ServiceConditions.Expenses`} component={FormikPrice} />

            {children}

            <FormikGroups label="HOURS_OF_WORK" xs={12} md={6}>
              <Field label="MIN" name={`ServiceConditions.MinHoursOfWork`} component={FormikNumberEndAdornmentText} adornmentText="h" overrideGrid={{ xs: 2, md: undefined }} />

              <Grid item xs={1}><Typography>-</Typography></Grid>

              <Field label="MAX" name={`ServiceConditions.MaxHoursOfWork`} component={FormikNumberEndAdornmentText} adornmentText="h" overrideGrid={{ xs: 2, md: undefined }} />

              <Field label="DRIVE_HOURS" name={`ServiceConditions.DriveHours`} component={FormikNumberEndAdornmentText} adornmentText="h" overrideGrid={{ xs: 7, md: undefined }} />
            </FormikGroups>


            <FormikGroups label="PRICE" xs={12} md={6}>
              {/* Calculations */}
              <Grid item xs={values.ServiceConditions.HasCostCeiling ? 3 : 5}>
                <MuiTextField label={intl.formatMessage({ id: "MIN" })} value={this.getMinPrice()} disabled={true} type="number" InputProps={{ startAdornment: (<InputAdornment position="start">CHF</InputAdornment>) }} />
              </Grid>
              <Grid item xs={values.ServiceConditions.HasCostCeiling ? 3 : 5}>
                <MuiTextField label={intl.formatMessage({ id: "MAX" })} value={this.getMaxPrice()} disabled={true} type="number" InputProps={{ startAdornment: (<InputAdornment position="start">CHF</InputAdornment>) }} />
              </Grid>

              <Field label="DISCOUNT_IN_PERCENT" name={`ServiceConditions.DiscountInPercent`} component={FormikPercent} overrideGrid={{ xs: 2, md: undefined }} />

              {
                values.ServiceConditions.HasCostCeiling ? (
                  <Field label="COST_CEILING" name={`ServiceConditions.CostCeiling`} component={FormikPrice} overrideGrid={{ xs: 4, md: undefined }} />
                ) : null
              }
            </FormikGroups>
          </>
        ) : null}

        {!values.ServiceConditions.HasCostCeiling && !values.ServiceConditions.IsHourlyRate ? (
          <Field label="ESTIMATED_HOURS_OF_WORKING_WHEN_FIX_PRICE" name={`ServiceConditions.EstimatedHoursOfWorkWhenFixPrice`} component={FormikNumberEndAdornmentText} adornmentText="h" />
        ) : null}

        {
          !values.ServiceConditions.HasCostCeiling && !values.ServiceConditions.IsHourlyRate ? (
            <Field label="FIX_PRICE" name={`ServiceConditions.FixPrice`} component={FormikPrice} />
          ) : null}
      </>
    )
  }

  getAdditionalCost = (): number => {
    const { values: { ServiceConditions: { Expenses } }, additionalCost } = this.props

    return (Expenses ? Expenses : 0) + additionalCost
  }

  getMinPrice = (): number | null => {
    const { values: { ServiceConditions: { WorkersAmount, PricePerHour, MinHoursOfWork } } } = this.props

    if (WorkersAmount && PricePerHour && MinHoursOfWork) {

      return WorkersAmount * PricePerHour * MinHoursOfWork + this.getAdditionalCost()
    }

    return null
  }
  getMaxPrice = () => {
    const { values: { ServiceConditions: { WorkersAmount, PricePerHour, MaxHoursOfWork } } } = this.props

    if (WorkersAmount && PricePerHour && MaxHoursOfWork) {
      return WorkersAmount * PricePerHour * MaxHoursOfWork + this.getAdditionalCost()
    }

    return null
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      ServiceConditionsBundle
    )
  )
)
