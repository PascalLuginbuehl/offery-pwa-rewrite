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
import { IPutStorageService } from '../../interfaces/IService';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values extends IStorageServiceConditions {
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (storageConditions: IStorageServiceConditions) => void
  storageConditions: IStorageServiceConditions
  storageService: IPutStorageService
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
      storageService
    } = this.props

    console.log(selectedCompany.CarTypes)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="STORAGE_CONDITIONS" />

          <ServiceConditions additionalCost={this.getAdditionalCost()} setFieldValue={setFieldValue} values={values}>
            {storageService.BoreService ? (
              <FormikGroups label="BORE" xs={6} md={3}>
                <Field label="AMOUNT" name="BoreAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: undefined }} />
                <Field label="PRICE" name="BorePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
              </FormikGroups>
            ) : null}

            {storageService.LampDemontageService ? (
              <FormikGroups label="LAMP_DEMONTAGE" xs={6} md={3}>
                <Field
                  label="AMOUNT"
                  name="LampDemontageAmount"
                  type="number"
                  component={FormikTextField}
                  inputProps={{ step: 1, min: 0 }}
                  overrideGrid={{ xs: 6, md: undefined }}
                />
                <Field label="PRICE" name="LampDemontagePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
              </FormikGroups>
            ) : null}

            {storageService.FurnitureLiftService || storageService.PianoService || storageService.MontageService || storageService.DeMontageService ? (
              <FormikGroups label="PRICES" xs={12} md={6}>
                {storageService.FurnitureLiftService ? <Field label="FURNITURE_LIFT" name="FurnitureLiftPrice" component={FormikPrice} /> : null}

                {storageService.PianoService ? <Field label="PIANO" name="PianoPrice" component={FormikPrice} /> : null}

                {storageService.MontageService ? <Field label="MONTAGE_SERVICE" name="MontageServicePrice" component={FormikPrice} /> : null}

                {storageService.DeMontageService ? <Field label="DE_MONTAGE_SERVICE" name="DeMontageServicePrice" component={FormikPrice} /> : null}
              </FormikGroups>
            ) : null}
          </ServiceConditions>

          <FormikGroups label="STORAGE_PRICE_PER_MONTH" xs={12}>
            <Field label="VOLUME" name="Volume" component={FormikNumberEndAdornmentText} adornmentText="m³" overrideGrid={{ xs: 4, md: 3 }} />
            <Field
              label="CHF_PER_M"
              name="CostPerCubicMonthInMoney"
              component={FormikNumberEndAdornmentText}
              position="start"
              adornmentText="CHF/m³"
              overrideGrid={{ xs: 3, md: 3 }}
            />

            <Grid item xs={5} md={6}>
              <MuiTextField
                label={intl.formatMessage({ id: "STORAGE_PRICE_PER_MONTH" })}
                value={(values.Volume ? values.Volume : 0) * (values.CostPerCubicMonthInMoney ? values.CostPerCubicMonthInMoney : 0)}
                disabled={true}
                type="number"
                InputProps={{ startAdornment: <InputAdornment position="start">CHF</InputAdornment> }}
              />
            </Grid>
          </FormikGroups>

          {status && status.json && <div>{status.json.Message}</div>}

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
        mapPropsToValues: props => ({ ...props.storageConditions }),

        handleSubmit: async (values, actions) => {
          try {
            await actions.props.onChangeAndSave(values)

            actions.setSubmitting(false)

            actions.resetForm()
            actions.props.nextPage()
          } catch(e) {
            actions.setStatus(e)
          }
        }

      })(StorageConditions)
    )
  )
)
