import * as React from 'react'
import Form from '../../components/FormikFields/Form';
import { createStyles, Theme, WithStyles, withStyles, Grid } from '@material-ui/core'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { Formik, FormikProps, Field, withFormik } from 'formik';
import FormikTextField from '../../components/FormikFields/FormikTextField';
import Submit from '../../components/FormikFields/Submit';
import PageHeader from '../../components/PageHeader';
import { IMoveServiceConditions } from '../../interfaces/IConditions';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import FormikPrice from '../../components/FormikFields/Numbers/FormikPrice';
import FormikGroups from '../../components/FormikFields/Bundled/Groups';
import ServiceConditions from './ServiceConditions';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values extends IMoveServiceConditions {
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (moveConditions: IMoveServiceConditions) => void
  moveConditions: IMoveServiceConditions
}

class MoveConditions extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const {
      values,
      isSubmitting,
      status,
      setFieldValue,
      selectedCompany,
    } = this.props

    console.log(selectedCompany.CarTypes)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MOVE_CONDITIONS" />

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
        mapPropsToValues: props => ({...props.moveConditions }),

        handleSubmit: async (values, actions) => {
          await actions.props.onChangeAndSave(values)

          actions.setSubmitting(false)
          actions.resetForm()
          actions.props.nextPage()
        }

      })(MoveConditions)
    )
  )
)
