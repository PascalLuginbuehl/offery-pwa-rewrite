import * as React from 'react'
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, TextField as MuiTextField, Divider, Typography } from '@material-ui/core'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps, FieldArray } from 'formik';
import FormikTextField from '../../components/FormikFields/FormikTextField';
import Submit from '../../components/FormikFields/Submit';
import PageHeader from '../../components/PageHeader';
import { IMoveServiceConditions, IPackServiceConditions, ICleaningServiceConditions } from '../../interfaces/IConditions';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import FormikPrice from '../../components/FormikFields/Numbers/FormikPrice';
import FormikGroups from './Groups';
import ServiceConditions from './ServiceConditions';
import Switch from '../../components/Validator/Switch';
import FormikDivider from '../../components/FormikFields/FormikDivider';
import FormikButtonCheckbox from '../../components/FormikFields/FormikButtonCheckbox';
import FormikNumberEndAdornmentText from '../../components/FormikFields/Numbers/FormikNumberEndAdornmentText';
import FormikPercent from '../../components/FormikFields/Numbers/FormikPercent';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values extends ICleaningServiceConditions {
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (cleaningConditions: ICleaningServiceConditions) => void
  cleaningConditions: ICleaningServiceConditions
}

class CleaningConditions extends React.Component<Props & FormikProps<Values>, {}> {
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
      setFieldValue,
      selectedCompany,
    } = this.props

    console.log(selectedCompany.CarTypes)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="CLEANING_CONDITIONS" />

          <Field label="CLEANING_PERSONAL_AMOUNT" name="WorkersAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: 3 }} />
          <Field label="ESTIMATED_HOURS_OF_WORKING_WHEN_FIX_PRICE" name="EstimatedHoursOfWorkWhenFixPrice" component={FormikNumberEndAdornmentText} adornmentText="h" />

          <FormikGroups label="HIGH_PRESURE_CLEANING_FIX_PRICE" xs={6} md={3}>
            <Field label="TERRACE" name="HighPressureTerraceCleaningFixPrice" component={FormikPrice} />
            <Field label="GARAGE" name="HighPressureGarageCleaningFixPrice" component={FormikPrice} />
          </FormikGroups>

          <FormikGroups label="DOVEL_HOLES" xs={6} md={3}>
            <Field label="AMOUNT" name="DovelholeAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: undefined }} />
            <Field label="PRICE" name="DovelholePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
          </FormikGroups>


          <FormikGroups label="CLEANING_PRICES" xs={12} md={6}>
            <Field label="FIREPLACE" name="CleaningFireplacePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
            <Field label="CLEANING_CARPET" name="CleaningCarpetPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
            <Field label="WINDOWS" name="CleaningWindowsPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
            <Field label="WINDOWS_WITH_SHUTTERS" name="CleaningWindowsWithShuttersPrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
          </FormikGroups>

          <FormikGroups label="SPECIAL_CLEANING" xs={6} md={3}>
            <Field label="WINDOWS" name="CleaningSpecialPrice" component={FormikPrice} overrideGrid={{ xs: 12, md: undefined }} />
            <Field name="CleaningSpecialComment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />
          </FormikGroups>


          <Field label="HANDOUT_WARRANTY" name="HandoutGaranty" component={FormikButtonCheckbox} />


          <FormikGroups label="PRICE" xs={12} md={6}>
            <Grid item xs={5}>
              <MuiTextField label={intl.formatMessage({ id: "PRICE" })} value={this.getCost()} disabled={true} type="number" InputProps={{ startAdornment: (<InputAdornment position="start">CHF</InputAdornment>) }} />
            </Grid>

            <Field label="DISCOUNT_IN_PERCENT" name="DiscountInPercent" component={FormikPercent} overrideGrid={{ xs: 2, md: undefined }} />

          </FormikGroups>

          <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

          {status && status.msg && <div>{status.msg}</div>}

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
        validationSchema: Yup.object().shape({
          // email: Yup.string()
          //   .email()
          //   .required(),
        }),

        mapPropsToValues: props => ({ ...props.cleaningConditions }),

        handleSubmit: async (values, actions) => {
          console.log(values)
          // actions.props.
          await actions.props.onChangeAndSave(values)

          actions.setSubmitting(false)
          // actions.props.nextPage()
        }

      })(CleaningConditions)
    )
  )
)
