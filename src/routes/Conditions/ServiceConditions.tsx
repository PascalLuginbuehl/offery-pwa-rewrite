
import * as React from 'react'
import { Tab, Tabs, WithStyles, withStyles, Grid, Button, InputAdornment, TextField as MuiTextField, Divider, Typography } from '@material-ui/core'
import FormikTextField from '../../components/FormikFields/FormikTextField';
import { IServiceConditions } from '../../interfaces/IConditions';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import FormikPrice from '../../components/FormikFields/Numbers/FormikPrice';
import FormikPercent from '../../components/FormikFields/Numbers/FormikPercent';
import FormikNumberEndAdornmentText from '../../components/FormikFields/Numbers/FormikNumberEndAdornmentText';
import FormikGroups from '../../components/FormikFields/Bundled/Groups';
import { Field } from 'formik';
import CarSelection from './CarSelection';
import { withResource, WithResourceProps } from '../../providers/withResource';


interface Props<Values extends {ServiceConditions: IServiceConditions}> extends InjectedIntlProps, WithResourceProps {
  setFieldValue: (field: keyof Values | any, value: any) => void
  values: Values
  additionalCost: number
  personalCostAddon?: React.ReactNode
  disabledVehicles?: boolean
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
      personalCostAddon,
      disabledVehicles = false,
    } = this.props

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

        <FormikGroups label="PERSONAL_COST" xs={12} {...(disabledVehicles ? {} : { md: 6 })}>
          <Field
            label="WORKERS_AMOUNT"
            name={`ServiceConditions.WorkersAmount`}
            type="number"
            component={FormikTextField}
            inputProps={{ step: 1, min: 0 }}
            overrideGrid={disabledVehicles ? { xs: 6, md: 3 } : { xs: 6 }}
          />

          {!values.ServiceConditions.HasCostCeiling && !values.ServiceConditions.IsHourlyRate ? null : (
            <Field
              label="PRICE_PER_HOUR"
              name={`ServiceConditions.PricePerHour`}
              component={FormikNumberEndAdornmentText}
              adornmentText="CHF/h"
              overrideGrid={disabledVehicles ? { xs: 6, md: 3 } : { xs: 6 }}
            />
          )}

          <Field label="EXPENSES" name={`ServiceConditions.Expenses`} component={FormikPrice} overrideGrid={disabledVehicles ? { xs: 6, md: 3 } : { xs: 6 }} />

          {personalCostAddon}
        </FormikGroups>

        {disabledVehicles ? null : (
          <FormikGroups label="VEHICLES" xs={12} md={6}>
            <Field component={CarSelection} name="CarAmounts" carTypes={selectedCompany.CarTypes} />
          </FormikGroups>
        )}

        {children}

        {!values.ServiceConditions.HasCostCeiling && !values.ServiceConditions.IsHourlyRate ? null : (
          <FormikGroups label="HOURS_OF_WORK" xs={12} md={6}>
            <Field label="MIN" name={`ServiceConditions.MinHoursOfWork`} component={FormikNumberEndAdornmentText} adornmentText="h" overrideGrid={{ xs: 2, md: undefined }} />

            <Grid item xs={1}>
              <Typography>-</Typography>
            </Grid>

            <Field label="MAX" name={`ServiceConditions.MaxHoursOfWork`} component={FormikNumberEndAdornmentText} adornmentText="h" overrideGrid={{ xs: 2, md: undefined }} />

            <Field label="DRIVE_HOURS" name={`ServiceConditions.DriveHours`} component={FormikNumberEndAdornmentText} adornmentText="h" overrideGrid={{ xs: 7, md: undefined }} />
          </FormikGroups>
        )}

        <FormikGroups label="PRICE" xs={12} md={!values.ServiceConditions.HasCostCeiling && !values.ServiceConditions.IsHourlyRate ? 12 : 6}>
          {/* Calculations */}
          {!values.ServiceConditions.HasCostCeiling && !values.ServiceConditions.IsHourlyRate ? (
            <>
              <Field
                label="ESTIMATED_HOURS_OF_WORKING_WHEN_FIX_PRICE"
                name={`ServiceConditions.EstimatedHoursOfWorkWhenFixPrice`}
                component={FormikNumberEndAdornmentText}
                adornmentText="h"
              />
              <Field label="FIX_PRICE" name={`ServiceConditions.FixPrice`} component={FormikPrice} />
            </>
          ) : (
            <>
              <Grid item xs={values.ServiceConditions.HasCostCeiling ? 3 : 5}>
                <MuiTextField
                  label={intl.formatMessage({ id: "MIN" })}
                  value={this.getMinPrice()}
                  disabled={true}
                  type="number"
                  InputProps={{ startAdornment: <InputAdornment position="start">CHF</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={values.ServiceConditions.HasCostCeiling ? 3 : 5}>
                <MuiTextField
                  label={intl.formatMessage({ id: "MAX" })}
                  value={this.getMaxPrice()}
                  disabled={true}
                  type="number"
                  InputProps={{ startAdornment: <InputAdornment position="start">CHF</InputAdornment> }}
                />
              </Grid>
            </>
          )}

          <Field label="DISCOUNT_IN_PERCENT" name={`ServiceConditions.DiscountInPercent`} component={FormikPercent} overrideGrid={{ xs: 2, md: undefined }} />

          {values.ServiceConditions.HasCostCeiling ? (
            <Field label="COST_CEILING" name={`ServiceConditions.CostCeiling`} disabled component={FormikPrice} overrideGrid={{ xs: 4, md: undefined }} />
          ) : null}
        </FormikGroups>

        <Field name={`ServiceConditions.Comment`} label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />
      </>
    )
  }

  getAdditionalCost = (): number => {
    const {
      values: {
        ServiceConditions: { Expenses },
      },
      additionalCost,
    } = this.props

    return (Expenses ? Expenses : 0) + additionalCost
  }

  getMinPrice = (): number | undefined => {
    const {
      values: {
        ServiceConditions: { DriveHours, PricePerHour, MinHoursOfWork },
      },
    } = this.props

    if (PricePerHour && MinHoursOfWork) {
      return ((DriveHours ? DriveHours : 0) * PricePerHour) + (PricePerHour * MinHoursOfWork) + this.getAdditionalCost()
    }

    return undefined
  }

  getMaxPrice = (): number | undefined => {
    const {
      values: {
        ServiceConditions: { DriveHours, PricePerHour, MaxHoursOfWork },
      },
    } = this.props

    if (PricePerHour && MaxHoursOfWork) {
      return ((DriveHours ? DriveHours : 0) * PricePerHour) + (PricePerHour * MaxHoursOfWork) + this.getAdditionalCost()
    }

    return undefined
  }
}

 export default
   injectIntl(
  withResource(ServiceConditionsBundle)
)
