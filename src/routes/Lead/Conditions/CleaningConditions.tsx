import * as React from "react"
import Form from "../../../components/FormikFields/Form"
import { createStyles, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, TextField as MuiTextField, Divider, Typography } from "@material-ui/core"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import { FormikProps, Field, withFormik } from "formik"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import Submit from "../../../components/FormikFields/Submit"
import PageHeader from "../../../components/PageHeader"
import { ICleaningServiceConditions } from "../../../interfaces/IConditions"
import { injectIntl, InjectedIntlProps } from "react-intl"
import FormikPrice from "../../../components/FormikFields/Numbers/FormikPrice"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"
import FormikNumberEndAdornmentText from "../../../components/FormikFields/Numbers/FormikNumberEndAdornmentText"
import FormikPercent from "../../../components/FormikFields/Numbers/FormikPercent"
import { IPutCleaningService } from "../../../interfaces/IService"

const styles = (theme: Theme) => createStyles({})

interface Values {
  cleaningConditions: ICleaningServiceConditions
  cleaningService: IPutCleaningService
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (cleaningConditions: ICleaningServiceConditions, cleaningService: IPutCleaningService) => Promise<any>
  cleaningConditions: ICleaningServiceConditions
  cleaningService: IPutCleaningService
}

class CleaningConditions extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, intl, selectedCompany, cleaningService } = this.props

    console.log(selectedCompany.CarTypes)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="CLEANING_CONDITIONS" />

          <Field label="HANDOUT_GARANTY" name="cleaningService.HandoutGaranty" component={FormikButtonCheckbox} />

          <FormikGroups label="PERSONAL_COST" xs={12}>
            <Field
              label="CLEANING_PERSONAL_AMOUNT"
              name="cleaningConditions.WorkersAmount"
              type="number"
              component={FormikTextField}
              inputProps={{ step: 1, min: 0 }}
              overrideGrid={{ xs: 6, md: 3 }}
            />
            <Field
              label="ESTIMATED_HOURS_OF_WORKING_WHEN_FIX_PRICE"
              name="cleaningConditions.EstimatedHoursOfWorkWhenFixPrice"
              component={FormikNumberEndAdornmentText}
              adornmentText="h"
              overrideGrid={{ xs: 6, md: 3 }}
            />

            <Field label="FIX_PRICE" name="cleaningConditions.FixPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: 3 }} />
          </FormikGroups>

          {cleaningService.HighPressureGarageCleaningService || cleaningService.HighPressureTerraceCleaningService ? (
            <FormikGroups label="HIGH_PRESURE_CLEANING_FIX_PRICE" xs={6} md={3}>
              {cleaningService.HighPressureTerraceCleaningService ? (
                <Field label="TERRACE" name="cleaningConditions.HighPressureTerraceCleaningFixPrice" component={FormikPrice} overrideGrid={{ xs: 6 }} />
              ) : null}
              {cleaningService.HighPressureGarageCleaningService ? (
                <Field label="GARAGE" name="cleaningConditions.HighPressureGarageCleaningFixPrice" component={FormikPrice} overrideGrid={{ xs: 6 }} />
              ) : null}
            </FormikGroups>
          ) : null}

          {cleaningService.DovelholeService ? (
            <FormikGroups label="DOVEL_HOLES" xs={6} md={3}>
              <Field
                label="AMOUNT"
                name="cleaningConditions.DovelholeAmount"
                type="number"
                component={FormikTextField}
                inputProps={{ step: 1, min: 0 }}
                overrideGrid={{ xs: 6, md: undefined }}
              />
              <Field label="PRICE" name="cleaningConditions.DovelholePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
            </FormikGroups>
          ) : null}

          {
            cleaningService.CleaningFireplaceService ||
            cleaningService.CleaningCarpetService ||
            cleaningService.CleaningWindowsService ||
            cleaningService.CleaningWindowsWithShuttersService
              ? (
                <FormikGroups label="CLEANING_PRICES" xs={12} md={6}>
                  {cleaningService.CleaningFireplaceService ? (
                    <Field label="FIREPLACE" name="cleaningConditions.CleaningFireplacePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
                  ) : null}
                  {cleaningService.CleaningCarpetService ? (
                    <Field label="CLEANING_CARPET" name="cleaningConditions.CleaningCarpetPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
                  ) : null}
                  {cleaningService.CleaningWindowsService ? (
                    <Field label="WINDOWS" name="cleaningConditions.CleaningWindowsPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
                  ) : null}
                  {cleaningService.CleaningWindowsWithShuttersService ? (
                    <Field label="WINDOWS_WITH_SHUTTERS" name="cleaningConditions.CleaningWindowsWithShuttersPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
                  ) : null}
                </FormikGroups>
              ) : null
          }

          {cleaningService.CleaningSpecialService ? (
            <FormikGroups label="SPECIAL_CLEANING" xs={6} md={3}>
              <Field label="PRICE" name="cleaningConditions.CleaningSpecialPrice" component={FormikPrice} overrideGrid={{ xs: 12, md: undefined }} />
              <Field name="cleaningConditions.CleaningSpecialComment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />
            </FormikGroups>
          ) : null}

          <FormikGroups label="PRICE" xs={12} md={6}>
            <Field label="DISCOUNT_IN_PERCENT" name="cleaningConditions.DiscountInPercent" component={FormikPercent} overrideGrid={{ xs: 2, md: undefined }} />

            <Grid item xs={5}>
              <MuiTextField
                label={intl.formatMessage({ id: "PRICE" })}
                value={this.getCost()}
                disabled={true}
                type="number"
                InputProps={{ startAdornment: <InputAdornment position="start">CHF</InputAdornment> }}
              />
            </Grid>
          </FormikGroups>

          <Field name="cleaningService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />
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
