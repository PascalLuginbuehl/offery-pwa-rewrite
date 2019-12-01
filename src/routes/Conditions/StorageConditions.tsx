import * as React from 'react'
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, TextField as MuiTextField, Divider, Typography } from '@material-ui/core'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps, FieldArray } from 'formik';
import FormikTextField from '../../components/FormikFields/FormikTextField';
import Submit from '../../components/FormikFields/Submit';
import PageHeader from '../../components/PageHeader';
import { IMoveServiceConditions, IPackServiceConditions, IStorageServiceConditions } from '../../interfaces/IConditions';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import FormikPrice from '../../components/FormikFields/Numbers/FormikPrice';
import FormikGroups from '../../components/FormikFields/Bundled/Groups';
import ServiceConditions from './ServiceConditions';
import FormikNumberEndAdornmentText from '../../components/FormikFields/Numbers/FormikNumberEndAdornmentText';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values extends IStorageServiceConditions {
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (storageConditions: IStorageServiceConditions) => void
  storageConditions: IStorageServiceConditions
}

class StorageConditions extends React.Component<Props & FormikProps<Values>, {}> {
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
          <PageHeader title="STORAGE_CONDITIONS" />

          <ServiceConditions
            additionalCost={this.getAdditionalCost()}
            setFieldValue={setFieldValue}
            values={values}
          >
            <FormikGroups label="PRICES" xs={12} md={6}>
              <Field label="FURNITURE_LIFT_PRICE" name="FurnitureLiftPrice" component={FormikPrice} />

              <Field label="PIANO_PRICE" name="PianoPrice" component={FormikPrice} />

              <Field label="MONTAGE_SERVICE_PRICE" name="MontageServicePrice" component={FormikPrice} />

              <Field label="DE_MONTAGE_SERVICE_PRICE" name="DeMontageServicePrice" component={FormikPrice} />
            </FormikGroups>


            <FormikGroups label="BORE" xs={6} md={3}>
              <Field label="AMOUNT" name="BoreAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: undefined }} />
              <Field label="PRICE" name="BorePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
            </FormikGroups>

            <FormikGroups label="LAMP_DEMONTAGE" xs={6} md={3}>
              <Field label="AMOUNT" name="LampDemontageAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: undefined }} />
              <Field label="PRICE" name="LampDemontagePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
            </FormikGroups>

          </ServiceConditions>


          <FormikGroups label="STORAGE_PRICE_PER_MONTH" xs={12}>
            <Field label="VOLUME" name="Volume" component={FormikNumberEndAdornmentText} adornmentText="m³" overrideGrid={{ xs: 4, md: 3 }} />
            <Field label="CHF_PER_M" name="CostPerCubicMonthInMoney" component={FormikNumberEndAdornmentText} position="start" adornmentText="CHF/m³" overrideGrid={{ xs: 3, md: 3 }} />

            <Grid item xs={5} md={6}>
              <MuiTextField
                label={intl.formatMessage({ id: "STORAGE_PRICE_PER_MONTH" })}
                value={(values.Volume ? values.Volume : 0) * (values.CostPerCubicMonthInMoney ? values.CostPerCubicMonthInMoney : 0)}
                disabled={true}
                type="number"
                InputProps={{ startAdornment: (<InputAdornment position="start">CHF</InputAdornment>) }}
              />
            </Grid>
          </FormikGroups>

          {status && status.msg && <div>{status.msg}</div>}

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }

  getAdditionalCost = (): number => {
    const { values: { PianoPrice, LampDemontagePrice, FurnitureLiftPrice, BorePrice, MontageServicePrice, DeMontageServicePrice } } = this.props

    return (PianoPrice ? PianoPrice : 0)
      + (LampDemontagePrice ? LampDemontagePrice : 0)
      + (FurnitureLiftPrice ? FurnitureLiftPrice : 0)
      + (BorePrice ? BorePrice : 0)
      + (MontageServicePrice ? MontageServicePrice : 0)
      + (DeMontageServicePrice ? DeMontageServicePrice : 0)
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

        mapPropsToValues: props => ({ ...props.storageConditions }),

        handleSubmit: async (values, actions) => {
          console.log(values)
          // actions.props.
          await actions.props.onChangeAndSave(values)

          actions.setSubmitting(false)
          // actions.props.nextPage()
        }

      })(StorageConditions)
    )
  )
)