import * as React from "react"
import { Tab, Tabs,   Grid,  InputAdornment, TextField as MuiTextField } from "@material-ui/core"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import { IServiceConditions } from "../../../interfaces/IConditions"
import { injectIntl, WrappedComponentProps } from "react-intl"
import FormikPrice from "../../../components/FormikFields/Numbers/FormikPrice"
import FormikPercent from "../../../components/FormikFields/Numbers/FormikPercent"
import FormikNumberEndAdornmentText from "../../../components/FormikFields/Numbers/FormikNumberEndAdornmentText"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import { Field } from "formik"
import CarSelection from "./CarSelection"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import RemoveIcon from "@material-ui/icons/Remove"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"

interface Props<Values extends { ServiceConditions: IServiceConditions }> extends WrappedComponentProps, WithResourceProps {
  setFieldValue: (field: keyof Values | any, value: any) => void
  values: Values
  additionalCost: number
  personalCostAddon?: React.ReactNode
  disabledVehicles?: boolean

  prefix: string
  commentPrefix: string
  commentEnabled: boolean

  children: any
}

class ServiceConditionsBundle<Values extends { ServiceConditions: IServiceConditions }> extends React.Component<Props<Values>, {}> {
  getRateProfile = (IsHourlyRate: boolean, HasCostCeiling: boolean) => {
    if (HasCostCeiling) {
      return 2
    } else if (IsHourlyRate) {
      return 0
    } else {
      return 1
    }
  }

  handleSetRateProfile = (e: React.ChangeEvent<{}>, position: number) => {
    const {prefix} = this.props

    this.props.setFieldValue(`${prefix}.ServiceConditions.IsHourlyRate`, false)
    this.props.setFieldValue(`${prefix}.ServiceConditions.HasCostCeiling`, false)

    if (position === 0) {
      this.props.setFieldValue(`${prefix}.ServiceConditions.IsHourlyRate`, true)
    } else if (position === 1) {
      return
    } else if (position === 2) {
      this.props.setFieldValue(`${prefix}.ServiceConditions.IsHourlyRate`, true)
      this.props.setFieldValue(`${prefix}.ServiceConditions.HasCostCeiling`, true)
    }
  }

  public render() {
    const {
      values,
      children,

      resource,
      prefix,
      commentPrefix,
      commentEnabled,
      intl,
      selectedCompany,
      personalCostAddon,
      disabledVehicles = false,
    } = this.props

    const enabledPaymentMethods = resource.PaymentMethods.filter(p => selectedCompany.Settings.EnabledPaymentMethodTextKeys.includes(p.NameTextKey))
    if (values.ServiceConditions.PaymentMethodId == null)
    {
      const defaultPaymentMethod = enabledPaymentMethods.find(p => p.NameTextKey == selectedCompany.Settings.DefaultPaymentMethodTextKey)
      values.ServiceConditions.PaymentMethodId = defaultPaymentMethod != null ? defaultPaymentMethod.PaymentMethodId : null
    }

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
            {selectedCompany.Settings.EnableHourPice ? (<Tab label={intl.formatMessage({ id: "IS_HOURLY_RATE" })} value={0} />) : null}
            {selectedCompany.Settings.EnableFixPrice ? (<Tab label={intl.formatMessage({ id: "FIX_PRICE" })} value={1} />) : null }
            {selectedCompany.Settings.EnableCostCeiling ? (<Tab label={intl.formatMessage({ id: "HAS_COST_CEILING" })} value={2} />) : null }
          </Tabs>
        </Grid>

        <FormikGroups label="PERSONAL_COST" xs={12} {...(disabledVehicles ? {} : { md: 6 })}>
          <Field
            label="WORKERS_AMOUNT"
            name={`${prefix}.ServiceConditions.WorkersAmount`}
            type="number"
            component={FormikTextField}
            inputProps={{ step: 1, min: 0 }}
            overrideGrid={disabledVehicles ? { xs: 6, md: 3 } : { xs: 6 }}
          />

          {values.ServiceConditions.HasCostCeiling || values.ServiceConditions.IsHourlyRate ? (
            <Field
              label="PRICE_PER_HOUR"
              name={`${prefix}.ServiceConditions.PricePerHour`}
              component={FormikNumberEndAdornmentText}
              adornmentText="CHF/h"
              overrideGrid={disabledVehicles ? { xs: 6, md: 3 } : { xs: 6 }}
            />
          ) : null}

          {selectedCompany.Settings.EnableWorkerExpenses && (values.ServiceConditions.HasCostCeiling || values.ServiceConditions.IsHourlyRate) ? (
            <Field label="EXPENSES" name={`${prefix}.ServiceConditions.Expenses`} component={FormikPrice} overrideGrid={disabledVehicles ? { xs: 6, md: 3 } : { xs: 6 }} />
          ) : null}

          {!values.ServiceConditions.HasCostCeiling && !values.ServiceConditions.IsHourlyRate ? (
            <Field
              label="ESTIMATED_HOURS_OF_WORKING_WHEN_FIX_PRICE"
              name={`${prefix}.ServiceConditions.EstimatedHoursOfWorkWhenFixPrice`}
              component={FormikNumberEndAdornmentText}
              adornmentText="h"
              overrideGrid={{ xs: 6 }}
            />
          ) : null}

          {personalCostAddon}
        </FormikGroups>

        {disabledVehicles ? null : (
          <FormikGroups label="VEHICLES" xs={12} md={6}>
            <Field component={CarSelection} name={`${prefix}.CarAmounts`} carTypes={selectedCompany.CarTypes} />
          </FormikGroups>
        )}

        {children}

        {values.ServiceConditions.HasCostCeiling || values.ServiceConditions.IsHourlyRate ? (
          <FormikGroups label="HOURS_OF_WORK" xs={12} md={6}>
            <Field label="MIN" name={`${prefix}.ServiceConditions.MinHoursOfWork`} component={FormikNumberEndAdornmentText} adornmentText="h" overrideGrid={{ xs: 2, md: undefined }} />

            <Grid item xs={1} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <RemoveIcon style={{ marginTop: 16 }} />
            </Grid>

            <Field label="MAX" name={`${prefix}.ServiceConditions.MaxHoursOfWork`} component={FormikNumberEndAdornmentText} adornmentText="h" overrideGrid={{ xs: 2, md: undefined }} />

            {values.ServiceConditions.HasCostCeiling ? (
              <Field label="COST_CEILING" name={`${prefix}.ServiceConditions.CostCeilingHoursOfWork`}
                component={FormikNumberEndAdornmentText}
                inputProps={{ step: 1 }}
                adornmentText="h"
                overrideGrid={{ xs: 3, md: undefined }} />
            ) : null}

            <Field
              label="DRIVE_HOURS"
              name={`${prefix}.ServiceConditions.DriveHours`}
              component={FormikNumberEndAdornmentText}
              InputLabelProps={{ shrink: values.ServiceConditions.HasCostCeiling }}
              inputProps={{ step: 0.25, min: 0 }}
              adornmentText="h"
              overrideGrid={{ xs: values.ServiceConditions.HasCostCeiling ? 4 : 7, md: undefined }}
            />

          </FormikGroups>
        ) : null}

        <FormikGroups label="PRICE" xs={12} md={!values.ServiceConditions.IsHourlyRate && !values.ServiceConditions.HasCostCeiling ? 12 : 6}>
          {/* Calculations */}
          {!values.ServiceConditions.HasCostCeiling && !values.ServiceConditions.IsHourlyRate ? (
            <Field label="FIX_PRICE" name={`${prefix}.ServiceConditions.FixPrice`} component={FormikPrice} overrideGrid={{ xs: 5 }} />
          ) : null}

          <Field label="DISCOUNT_IN_PERCENT" name={`${prefix}.ServiceConditions.DiscountInPercent`} component={FormikPercent} overrideGrid={{ xs: 2, md: undefined }} />

          {values.ServiceConditions.HasCostCeiling || values.ServiceConditions.IsHourlyRate ? (
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
          ) : (
            <Grid item xs={5}>
              <MuiTextField
                label={intl.formatMessage({ id: "PRICE" })}
                value={this.getFixPrice()}
                disabled={true}
                type="number"
                InputProps={{ startAdornment: <InputAdornment position="start">CHF</InputAdornment> }}
              />
            </Grid>
          )}

          {values.ServiceConditions.HasCostCeiling ?
            <Grid item xs={values.ServiceConditions.HasCostCeiling ? 3 : 5}>
              <MuiTextField
                label={intl.formatMessage({ id: "COST_CEILING" })}
                value={this.getCostCeilingPrice()}
                disabled={true}
                type="number"
                InputProps={{ startAdornment: <InputAdornment position="start">CHF</InputAdornment> }}
              />
            </Grid> : null
          }
        </FormikGroups>

        <Field
          label="PAYMENT_METHOD"
          name={`${prefix}.ServiceConditions.PaymentMethodId`}
          component={FormikSimpleSelect}
          options={enabledPaymentMethods.map(e => ({ label: e.NameTextKey, value: e.PaymentMethodId }))}
        />

        {commentEnabled ? (<Field name={`${commentPrefix}.Comment`} label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />) : null }
      </>
    )
  }


  getPricePerHour = (HoursOfWork: number): number | undefined => {
    const {
      values: {
        ServiceConditions: { DriveHours: NullDriveHours, PricePerHour: NullPricePerHour, DiscountInPercent: NullDiscountInPercent, Expenses: NullExpenses },
      },

      additionalCost
    } = this.props

    // Fixing null Values
    const Expenses = NullExpenses ? NullExpenses : 0
    const DriveHours = NullDriveHours ? NullDriveHours : 0
    const PricePerHour = NullPricePerHour ? NullPricePerHour : 0
    const DiscountInPercent = NullDiscountInPercent ? NullDiscountInPercent : 0

    const DiscountMultiplier = ((100 - DiscountInPercent) / 100)

    const HoursPrice = (DriveHours + HoursOfWork) * PricePerHour

    return (HoursPrice + Expenses + additionalCost) * DiscountMultiplier

  }

  getFixPrice = () => {
    const { values: { ServiceConditions: { FixPrice: NullFixPrice, DiscountInPercent: NullDiscountInPercent }, } } = this.props

    // Fixing Nulls
    const FixPrice = NullFixPrice ? NullFixPrice : 0
    const DiscountInPercent = NullDiscountInPercent ? NullDiscountInPercent : 0

    const DiscountMultiplier = ((100 - DiscountInPercent) / 100)

    return FixPrice * DiscountMultiplier
  }

  getMaxPrice = (): number | undefined => {
    const {
      values: {
        ServiceConditions: { MaxHoursOfWork },
      },
    } = this.props

    if (MaxHoursOfWork) {
      return this.getPricePerHour(MaxHoursOfWork)
    }

    return undefined
  }

  getCostCeilingPrice = (): number | undefined => {
    const {
      values: {
        ServiceConditions: { CostCeilingHoursOfWork, DriveHours },
      },
    } = this.props

    if (CostCeilingHoursOfWork) {
      return this.getPricePerHour(CostCeilingHoursOfWork - (DriveHours ? DriveHours : 0))
    } else {
      return this.getMaxPrice()
    }
  }

  getMinPrice = (): number | undefined => {
    const {
      values: {
        ServiceConditions: { MinHoursOfWork },
      },
    } = this.props

    if (MinHoursOfWork) {
      return this.getPricePerHour(MinHoursOfWork)
    }

    return undefined
  }
}

export default injectIntl(withResource(ServiceConditionsBundle))
