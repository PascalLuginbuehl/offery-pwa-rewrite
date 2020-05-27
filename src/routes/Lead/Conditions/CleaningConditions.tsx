import * as React from "react"
import Form from "../../../components/FormikFields/Form"
import { createStyles, Theme, WithStyles, withStyles, Grid,  InputAdornment, TextField as MuiTextField } from "@material-ui/core"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import { FormikProps, Field, withFormik } from "formik"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

import PageHeader from "../../../components/PageHeader"
import { ICleaningServiceConditions } from "../../../interfaces/IConditions"
import { injectIntl, WrappedComponentProps } from "react-intl"
import FormikPrice from "../../../components/FormikFields/Numbers/FormikPrice"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"
import FormikNumberEndAdornmentText from "../../../components/FormikFields/Numbers/FormikNumberEndAdornmentText"
import FormikPercent from "../../../components/FormikFields/Numbers/FormikPercent"
import { IPutCleaningService } from "../../../interfaces/IService"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"

const styles = (theme: Theme) => createStyles({})

interface Values {
  cleaningConditions: ICleaningServiceConditions
  cleaningService: IPutCleaningService
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  nextPage: () => void
  onChangeAndSave: (cleaningConditions: ICleaningServiceConditions, cleaningService: IPutCleaningService) => Promise<any>
  cleaningConditions: ICleaningServiceConditions
  cleaningService: IPutCleaningService
}

class CleaningConditions extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, intl, selectedCompany, cleaningConditions, cleaningService, resource} = this.props

    const showHighPressureTerracePrice = (selectedCompany.Settings.EnableServiceCleaningHighPressureTerrace &&
        selectedCompany.Settings.EnableServiceCleaningHighPressureTerracePrice &&
        cleaningService.HighPressureTerraceCleaningService)

    const showFirePlacePrice = (selectedCompany.Settings.EnableServiceCleaningFirePlace &&
      selectedCompany.Settings.EnableServiceCleaningFirePlacePrice &&
      cleaningService.CleaningFireplaceService)

    const showCarpetPrice = (selectedCompany.Settings.EnableServiceCleaningCarpet &&
      selectedCompany.Settings.EnableServiceCleaningCarpetPrice &&
      cleaningService.CleaningCarpetService)

    const showHighPressureGaragePrice = (selectedCompany.Settings.EnableServiceCleaningHighPressureGarage &&
      selectedCompany.Settings.EnableServiceCleaningHighPressureGaragePrice &&
      cleaningService.HighPressureGarageCleaningService)

    const showWindowPrice = (selectedCompany.Settings.EnableServiceCleaningWindows &&
      selectedCompany.Settings.EnableServiceCleaningWindowsPrice &&
      cleaningService.CleaningWindowsService)

    const showWindowShuttersPrice = (selectedCompany.Settings.EnableServiceCleaningWindowsWithShutters &&
      selectedCompany.Settings.EnableServiceCleaningWindowsWithShuttersPrice &&
      cleaningService.CleaningWindowsWithShuttersService)

    //Set default values from settings if configured, enabled and not set yet
    if (cleaningConditions.PaymentMethodId == null)
    {
      const defaultPaymentMethod = resource.PaymentMethods.find(p => p.NameTextKey == selectedCompany.Settings.DefaultPaymentMethodTextKey)
      cleaningConditions.PaymentMethodId = defaultPaymentMethod != null ? defaultPaymentMethod.PaymentMethodId : null
    }

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="CLEANING_CONDITIONS" />

          {selectedCompany.Settings.EnableServiceCleaningHandOutGaranty ? (<Field label="HANDOUT_GARANTY" name="cleaningService.HandoutGaranty" component={FormikButtonCheckbox} />) : null }

          <FormikGroups label="PERSONAL_COST" xs={12}>
            {selectedCompany.Settings.EnableServiceCleaningWorkersAmount ? (<Field
              label="CLEANING_PERSONAL_AMOUNT"
              name="cleaningConditions.WorkersAmount"
              type="number"
              component={FormikTextField}
              inputProps={{ step: 1, min: 0 }}
              overrideGrid={{ xs: 6, md: 3 }}
            />) : null}
            <Field
              label="ESTIMATED_HOURS_OF_WORKING_WHEN_FIX_PRICE"
              name="cleaningConditions.EstimatedHoursOfWorkWhenFixPrice"
              component={FormikNumberEndAdornmentText}
              adornmentText="h"
              overrideGrid={{ xs: 6, md: 3 }}
            />

            <Field label="BASE_PRICE" name="cleaningConditions.FixPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: 3 }} />
          </FormikGroups>

          {showHighPressureGaragePrice || showHighPressureTerracePrice ? (
            <FormikGroups label="HIGH_PRESURE_CLEANING_FIX_PRICE" xs={6} md={3}>
              {showHighPressureTerracePrice ? (
                <Field label="TERRACE" name="cleaningConditions.HighPressureTerraceCleaningFixPrice" component={FormikPrice} overrideGrid={{ xs: 6 }} />
              ) : null}
              {showHighPressureGaragePrice ? (
                <Field label="GARAGE" name="cleaningConditions.HighPressureGarageCleaningFixPrice" component={FormikPrice} overrideGrid={{ xs: 6 }} />
              ) : null}
            </FormikGroups>
          ) : null}

          {selectedCompany.Settings.EnableServiceCleaningDovelhole && cleaningService.DovelholeService &&
            (selectedCompany.Settings.EnableServiceCleaningDovelholeAmount || selectedCompany.Settings.EnableServiceCleaningDovelholePrice) ?
            (<FormikGroups label="DOVEL_HOLES" xs={6} md={3}>
              {selectedCompany.Settings.EnableServiceCleaningDovelholeAmount ? (<Field
                label="AMOUNT"
                name="cleaningConditions.DovelholeAmount"
                type="number"
                component={FormikTextField}
                inputProps={{ step: 1, min: 0 }}
                overrideGrid={{ xs: 6, md: undefined }}
              />) : null }
              {selectedCompany.Settings.EnableServiceCleaningDovelholePrice ?
                (<Field label="PRICE" name="cleaningConditions.DovelholePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />) : null }
            </FormikGroups>
            ) : null}

          {
            showFirePlacePrice ||
            showCarpetPrice ||
            showWindowPrice ||
            showWindowShuttersPrice
              ? (
                <FormikGroups label="CLEANING_PRICES" xs={12} md={6}>
                  {showFirePlacePrice ? (
                    <Field label="FIREPLACE" name="cleaningConditions.CleaningFireplacePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
                  ) : null}
                  {showCarpetPrice ? (
                    <Field label="CLEANING_CARPET" name="cleaningConditions.CleaningCarpetPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
                  ) : null}
                  {showWindowPrice ? (
                    <Field label="WINDOWS" name="cleaningConditions.CleaningWindowsPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
                  ) : null}
                  {showWindowShuttersPrice ? (
                    <Field label="WINDOWS_WITH_SHUTTERS" name="cleaningConditions.CleaningWindowsWithShuttersPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
                  ) : null}
                </FormikGroups>
              ) : null
          }

          {selectedCompany.Settings.EnableServiceCleaningSpecial && cleaningService.CleaningSpecialService ?
            (<FormikGroups label="SPECIAL_CLEANING" xs={6} md={3}>
              {selectedCompany.Settings.EnableServiceCleaningSpecialPrice ?
                (<Field label="PRICE" name="cleaningConditions.CleaningSpecialPrice" component={FormikPrice} overrideGrid={{ xs: 12, md: undefined }} />) : null }
              <Field name="cleaningConditions.CleaningSpecialComment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />
            </FormikGroups>
            ) : null}

          <FormikGroups label="PRICE" xs={12} md={6}>
            <Field label="DISCOUNT_IN_PERCENT" name="cleaningConditions.DiscountInPercent" component={FormikPercent} overrideGrid={{ xs: 2, md: undefined }} />

            <Grid item xs={5}>
              <MuiTextField
                label={intl.formatMessage({ id: "FIX_PRICE" })}
                value={this.getCost()}
                disabled={true}
                type="number"
                InputProps={{ startAdornment: <InputAdornment position="start">CHF</InputAdornment> }}
              />
            </Grid>
          </FormikGroups>

          <Field
            label="PAYMENT_METHOD"
            name={`cleaningConditions.PaymentMethodId`}
            component={FormikSimpleSelect}
            options={resource.PaymentMethods.map(e => ({ label: e.NameTextKey, value: e.PaymentMethodId }))}
          />

          {selectedCompany.Settings.EnableServiceCleaningComment ?
            (<Field name="cleaningService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />) : null }
        </Form>
      </Grid>
    )
  }

  getCost = (): number => {
    const {
      values: {
        cleaningConditions: {HighPressureGarageCleaningFixPrice: NullHighPressureGarageCleaningFixPrice, DovelholePrice: NullDovelholePrice,HighPressureTerraceCleaningFixPrice: NullHighPressureTerraceCleaningFixPrice, CleaningFireplacePrice: NullCleaningFireplacePrice, CleaningCarpetPrice: NullCleaningCarpetPrice, CleaningWindowsPrice: NullCleaningWindowsPrice, CleaningWindowsWithShuttersPrice: NullCleaningWindowsWithShuttersPrice, CleaningSpecialPrice: NullCleaningSpecialPrice, FixPrice: NullFixPrice, DiscountInPercent: NullDiscountInPercent },
        cleaningService: { HighPressureGarageCleaningService, DovelholeService, HighPressureTerraceCleaningService, CleaningFireplaceService, CleaningCarpetService, CleaningWindowsService, CleaningWindowsWithShuttersService, CleaningSpecialService },
      },
    } = this.props

    const HighPressureGarageCleaningFixPrice = NullHighPressureGarageCleaningFixPrice && HighPressureGarageCleaningService? NullHighPressureGarageCleaningFixPrice : 0
    const DovelholePrice = NullDovelholePrice && DovelholeService ? NullDovelholePrice : 0
    const HighPressureTerraceCleaningFixPrice = NullHighPressureTerraceCleaningFixPrice && HighPressureTerraceCleaningService? NullHighPressureTerraceCleaningFixPrice : 0
    const CleaningFireplacePrice = NullCleaningFireplacePrice && CleaningFireplaceService ? NullCleaningFireplacePrice : 0
    const CleaningCarpetPrice = NullCleaningCarpetPrice && CleaningCarpetService ? NullCleaningCarpetPrice : 0
    const CleaningWindowsPrice = NullCleaningWindowsPrice && CleaningWindowsService ? NullCleaningWindowsPrice : 0
    const CleaningWindowsWithShuttersPrice = NullCleaningWindowsWithShuttersPrice && CleaningWindowsWithShuttersService ? NullCleaningWindowsWithShuttersPrice : 0
    const CleaningSpecialPrice = NullCleaningSpecialPrice && CleaningSpecialService ? NullCleaningSpecialPrice : 0

    const FixPrice = NullFixPrice ? NullFixPrice : 0
    const DiscountInPercent = NullDiscountInPercent ? NullDiscountInPercent : 0
    const DiscountMultiplier = ((100 - DiscountInPercent) / 100)


    return (
      HighPressureGarageCleaningFixPrice +
      DovelholePrice +
      HighPressureTerraceCleaningFixPrice +
      CleaningFireplacePrice +
      CleaningCarpetPrice +
      CleaningWindowsPrice +
      CleaningWindowsWithShuttersPrice +
      CleaningSpecialPrice +
      FixPrice
    ) * DiscountMultiplier
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ cleaningConditions: props.cleaningConditions, cleaningService: props.cleaningService }),

        handleSubmit: async (values, actions) => {
          try {
            await actions.props.onChangeAndSave(values.cleaningConditions, values.cleaningService)

            actions.setSubmitting(false)
            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(CleaningConditions)
    )
  )
)
