import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, TextField as MuiTextField, Divider, Typography } from '@material-ui/core'
import ResponsiveContainer from '../../components/ResponsiveContainer'
// import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import CounterTable, { Cart } from '../../components/ShopElements/CounterTable'
import GridSelect, { GridSelectItem } from '../../components/ShopElements/GridSelect'
import * as React from 'react'
import BigCheckbox from '../../components/Validator/BigCheckbox';
import { withResource, WithResourceProps } from '../../providers/withResource';
import { IPostMoveInBuilding, IPostMoveOutBuilding } from '../../interfaces/IBuilding';
import IntlTypography from '../../components/Intl/IntlTypography';
import ValidatedDatePicker from '../../components/Validator/ValidatedDatePicker';
// import TestService from 'services/TestService'
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps, FieldArray } from 'formik';
import FormikTextField from '../../components/FormikFields/FormikTextField';
import Switch from '../../components/FormikFields/Switch';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/FormikDatePicker';
import { IPutServices, emptyServices, IPutMoveService, IPutPackService, IPutStorageService, IPutDisposalSerivce, IPutCleaningService } from '../../interfaces/IService';
import MoveInBuilding from '../Customer/MoveInBuilding';
import Select from '../../components/FormikFields/Select';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';
import PageHeader from '../../components/PageHeader';
import { IMoveServiceConditions } from '../../interfaces/IConditions';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import FormikPrice from '../../components/FormikFields/Numbers/FormikPrice';
import FormikPercent from '../../components/FormikFields/Numbers/FormikPercent';
import FormikNumberEndAdornmentText from '../../components/FormikFields/Numbers/FormikNumberEndAdornmentText';
import FormikDivider from '../../components/FormikFields/FormikDivider';
import FormikGroups from './Groups';
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

    const prefix = "ServiceConditions"
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


          <Field name={`${prefix}.Comment`} label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

          {status && status.msg && <div>{status.msg}</div>}

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }

  getAdditionalCost = (): number => {
    const { values: {PianoPrice, LampDemontagePrice, FurnitureLiftPrice, BorePrice } } = this.props

    return (PianoPrice ? PianoPrice : 0) + (LampDemontagePrice ? LampDemontagePrice : 0) + (FurnitureLiftPrice ? FurnitureLiftPrice : 0) + (BorePrice ? BorePrice : 0)
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

        mapPropsToValues: props => ({...props.moveConditions }),

        handleSubmit: async (values, actions) => {
          console.log(values)
          // actions.props.
          await actions.props.onChangeAndSave(values)

          actions.setSubmitting(false)
          // actions.props.nextPage()
        }

      })(MoveConditions)
    )
  )
)
