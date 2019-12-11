import * as React from 'react'
import Form from '../../components/FormikFields/Form';
import { createStyles, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, TextField as MuiTextField, Divider, Typography } from '@material-ui/core'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { FormikProps, Field, withFormik } from 'formik';
import FormikTextField from '../../components/FormikFields/FormikTextField';
import Submit from '../../components/FormikFields/Submit';
import PageHeader from '../../components/PageHeader';
import { ICleaningServiceConditions } from '../../interfaces/IConditions';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import FormikPrice from '../../components/FormikFields/Numbers/FormikPrice';
import FormikGroups from '../../components/FormikFields/Bundled/Groups';
import FormikButtonCheckbox from '../../components/FormikFields/FormikButtonCheckbox';
import FormikNumberEndAdornmentText from '../../components/FormikFields/Numbers/FormikNumberEndAdornmentText';
import FormikPercent from '../../components/FormikFields/Numbers/FormikPercent';
import { IPutCleaningService } from '../../interfaces/IService';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values extends ICleaningServiceConditions {
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (cleaningConditions: ICleaningServiceConditions) => void
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

          <FormikGroups label="PERSONAL_COST" xs={12} md={6}>
            <Field label="CLEANING_PERSONAL_AMOUNT" name="WorkersAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6 }} />
            <Field
              label="ESTIMATED_HOURS_OF_WORKING_WHEN_FIX_PRICE"
              name="EstimatedHoursOfWorkWhenFixPrice"
              component={FormikNumberEndAdornmentText}
              adornmentText="h"
              overrideGrid={{ xs: 6 }}
            />
          </FormikGroups>

          {cleaningService.HighPressureGarageCleaningService || cleaningService.HighPressureTerraceCleaningService ? (
            <FormikGroups label="HIGH_PRESURE_CLEANING_FIX_PRICE" xs={6} md={3}>
              {cleaningService.HighPressureTerraceCleaningService ? (
                <Field label="TERRACE" name="HighPressureTerraceCleaningFixPrice" component={FormikPrice} overrideGrid={{ xs: 6 }} />
              ) : null}
              {cleaningService.HighPressureGarageCleaningService ? (
                <Field label="GARAGE" name="HighPressureGarageCleaningFixPrice" component={FormikPrice} overrideGrid={{ xs: 6 }} />
              ) : null}
            </FormikGroups>
          ) : null}

          {cleaningService.DovelholeService ? (
            <FormikGroups label="DOVEL_HOLES" xs={6} md={3}>
              <Field label="AMOUNT" name="DovelholeAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: undefined }} />
              <Field label="PRICE" name="DovelholePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
            </FormikGroups>
          ) : null}

          {cleaningService.CleaningFireplaceService ||
          cleaningService.CleaningCarpetService ||
          cleaningService.CleaningWindowsService ||
          cleaningService.CleaningWindowsWithShuttersService ? (
            <FormikGroups label="CLEANING_PRICES" xs={12} md={6}>
              {cleaningService.CleaningFireplaceService ? (
                <Field label="FIREPLACE" name="CleaningFireplacePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
              ) : null}
              {cleaningService.CleaningCarpetService ? (
                <Field label="CLEANING_CARPET" name="CleaningCarpetPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
              ) : null}
              {cleaningService.CleaningWindowsService ? (
                <Field label="WINDOWS" name="CleaningWindowsPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
              ) : null}
              {cleaningService.CleaningWindowsWithShuttersService ? (
                <Field label="WINDOWS_WITH_SHUTTERS" name="CleaningWindowsWithShuttersPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
              ) : null}
            </FormikGroups>
          ) : null}

          {cleaningService.CleaningSpecialService ? (
            <FormikGroups label="SPECIAL_CLEANING" xs={6} md={3}>
              <Field label="PRICE" name="CleaningSpecialPrice" component={FormikPrice} overrideGrid={{ xs: 12, md: undefined }} />
              <Field name="CleaningSpecialComment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />
            </FormikGroups>
          ) : null}

          <Field label="HANDOUT_WARRANTY" name="HandoutGaranty" component={FormikButtonCheckbox} />

          <FormikGroups label="PRICE" xs={12} md={6}>
            <Grid item xs={5}>
              <MuiTextField
                label={intl.formatMessage({ id: "PRICE" })}
                value={this.getCost()}
                disabled={true}
                type="number"
                InputProps={{ startAdornment: <InputAdornment position="start">CHF</InputAdornment> }}
              />
            </Grid>

            <Field label="DISCOUNT_IN_PERCENT" name="DiscountInPercent" component={FormikPercent} overrideGrid={{ xs: 2, md: undefined }} />
          </FormikGroups>

          <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

          {status && status.json && <div>{status.json.Message}</div>}

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }

  getCost = (): number => {
    const { EstimatedHoursOfWorkWhenFixPrice, HighPressureGarageCleaningFixPrice, CleaningFireplacePrice, CleaningCarpetPrice, CleaningWindowsPrice, CleaningWindowsWithShuttersPrice, CleaningSpecialPrice } = this.props.values

    return (EstimatedHoursOfWorkWhenFixPrice ? EstimatedHoursOfWorkWhenFixPrice : 0)
    + (HighPressureGarageCleaningFixPrice ? HighPressureGarageCleaningFixPrice : 0)
    + (CleaningFireplacePrice ? CleaningFireplacePrice : 0)
    + (CleaningCarpetPrice ? CleaningCarpetPrice : 0)
    + (CleaningWindowsPrice ? CleaningWindowsPrice : 0)
    + (CleaningWindowsWithShuttersPrice ? CleaningWindowsWithShuttersPrice : 0)
    + (CleaningSpecialPrice ? CleaningSpecialPrice : 0)
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ ...props.cleaningConditions }),

        handleSubmit: async (values, actions) => {
          try {
            await actions.props.onChangeAndSave(values)

            actions.setSubmitting(false)
            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        }

      })(CleaningConditions)
    )
  )
)
