import * as React from 'react'
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, TextField as MuiTextField, Divider, Typography } from '@material-ui/core'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps, FieldArray } from 'formik';
import FormikTextField from '../../components/FormikFields/FormikTextField';
import Submit from '../../components/FormikFields/Submit';
import PageHeader from '../../components/PageHeader';
import { IMoveServiceConditions, IPackServiceConditions, IDisposalServiceConditions } from '../../interfaces/IConditions';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import FormikPrice from '../../components/FormikFields/Numbers/FormikPrice';
import FormikGroups from '../../components/FormikFields/Bundled/Groups';
import ServiceConditions from './ServiceConditions';
import FormikNumberEndAdornmentText from '../../components/FormikFields/Numbers/FormikNumberEndAdornmentText';
import FormikDivider from '../../components/FormikFields/FormikDivider';
import { IPutDisposalSerivce } from '../../interfaces/IService';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values extends IDisposalServiceConditions {
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (disposalConditions: IDisposalServiceConditions) => void
  disposalConditions: IDisposalServiceConditions
  disposalService: IPutDisposalSerivce
}

class DisposalConditions extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { values, isSubmitting, status, intl, setFieldValue, selectedCompany, disposalService } = this.props

    console.log(selectedCompany.CarTypes)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="DISPOSAL_CONDITIONS" />

          <ServiceConditions
            additionalCost={this.getAdditionalCost()}
            setFieldValue={setFieldValue}
            values={values}
            personalCostAddon={<Field label="ENTRY_COST" name="CostEntry" component={FormikPrice} overrideGrid={{ xs: 3 }} />}
          >
            {disposalService.LampDemontageService ? (
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

            {disposalService.FurnitureLiftService ? (
              <FormikGroups label="PRICES" xs={6} md={3}>
                <Field label="FURNITURE_LIFT" name="FurnitureLiftPrice" component={FormikPrice} overrideGrid={{ xs: 12 }} />
              </FormikGroups>
            ) : null}

            <FormikGroups label="DISPOSAL_FEES_PER_CUBIC_METER" xs={12}>
              <Field label="VOLUME" name="Volume" component={FormikNumberEndAdornmentText} adornmentText="m³" overrideGrid={{ xs: 4, md: 3 }} />
              <Field
                label="CHF_PER_M"
                name="CostPerCubicInMoney"
                component={FormikNumberEndAdornmentText}
                position="start"
                adornmentText="CHF/m³"
                overrideGrid={{ xs: 3, md: 3 }}
              />

              <Grid item xs={5} md={6}>
                <MuiTextField
                  label={intl.formatMessage({ id: "DISPOSAL_FEES" })}
                  value={(values.Volume ? values.Volume : 0) * (values.CostPerCubicInMoney ? values.CostPerCubicInMoney : 0)}
                  disabled={true}
                  type="number"
                  InputProps={{ startAdornment: <InputAdornment position="start">CHF</InputAdornment> }}
                />
              </Grid>
            </FormikGroups>
          </ServiceConditions>

          {status && status.msg && <div>{status.msg}</div>}

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }

  getAdditionalCost = (): number => {
    const { values: { LampDemontagePrice, FurnitureLiftPrice, CostEntry, Volume, CostPerCubicInMoney } } = this.props

    return (CostEntry ? CostEntry : 0) + (LampDemontagePrice ? LampDemontagePrice : 0) + (FurnitureLiftPrice ? FurnitureLiftPrice : 0)
      + ((Volume ? Volume : 0) * (CostPerCubicInMoney ? CostPerCubicInMoney : 0))
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ ...props.disposalConditions }),

        handleSubmit: async (values, actions) => {
          await actions.props.onChangeAndSave(values)

          actions.setSubmitting(false)
          actions.resetForm()
          actions.props.nextPage()
        }

      })(DisposalConditions)
    )
  )
)
