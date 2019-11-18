import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from '@material-ui/core'
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
import TextField from '../../components/FormikFields/TextField';
import Switch from '../../components/FormikFields/Switch';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/DatePicker';
import { IPutServices, emptyServices, IPutMoveService, IPutPackService, IPutStorageService, IPutDisposalSerivce, IPutCleaningService } from '../../interfaces/IService';
import MoveInBuilding from '../Customer/MoveInBuilding';
import Select from '../../components/FormikFields/Select';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';
import PageHeader from '../../components/PageHeader';
import { IMoveServiceConditions } from '../../interfaces/IConditions';
import { injectIntl, InjectedIntlProps } from 'react-intl';

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
  getRateProfile = (IsHourlyRate: boolean, HasCostCeiling: boolean) => {
    if (HasCostCeiling) {
      return 2
    } else if (IsHourlyRate) {
      return 1
    } else {
      return 0
    }
  }


  handleSetRateProfile = (e: React.ChangeEvent<{}>, position: number) => {
    //@ts-ignore
    this.props.setFieldValue("ServiceConditions.IsHourlyRate", false)
    //@ts-ignore
    this.props.setFieldValue("ServiceConditions.HasCostCeiling", false)

    if(position === 0) {
      return
    } else if(position === 1) {
      //@ts-ignore
      this.props.setFieldValue("ServiceConditions.IsHourlyRate", true)
    } else if (position === 2) {
      //@ts-ignore
      this.props.setFieldValue("ServiceConditions.HasCostCeiling", true)
    }
  }


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
    } = this.props

    const prefix = "ServiceConditions"
    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MOVE_CONDITIONS" />

          <Grid item xs={12}>
            <Tabs
              value={this.getRateProfile(values.ServiceConditions.IsHourlyRate, values.ServiceConditions.HasCostCeiling)}
              onChange={this.handleSetRateProfile}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              centered
            >
              <Tab label={intl.formatMessage({ id: "DEFAULT" })} value={0} />
              <Tab label={intl.formatMessage({ id: "IS_HOURLY_RATE" })} value={1} />
              <Tab label={intl.formatMessage({ id: "HAS_COST_CEILING" })} value={2} />
            </Tabs>
          </Grid>

          <Field label="PRICE_PER_HOUR" name={`${prefix}.PricePerHour`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="MIN_HOURS_OF_WORK" name={`${prefix}.MinHoursOfWork`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="MAX_HOURS_OF_WORK" name={`${prefix}.MaxHoursOfWork`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="EstimatedHoursOfWorkWhenFixPrice" name={`${prefix}.EstimatedHoursOfWorkWhenFixPrice`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <Field label="WORKERS_AMOUNT" name={`${prefix}.WorkersAmount`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="DRIVE_HOURS" name={`${prefix}.DriveHours`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <Field name={`${prefix}.Comment`} label="COMMENT" component={TextField} />

          <Field label="COST_CEILING" name={`${prefix}.CostCeiling`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="FIX_PRICE" name={`${prefix}.FixPrice`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="EXPENSES" name={`${prefix}.Expenses`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />
          <Field label="DISCOUNT_IN_PERCENT" name={`${prefix}.DiscountInPercent`} type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />


          <Field label="FURNITURE_LIFT_PRICE" name="FurnitureLiftPrice" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <Field label="PIANO_PRICE" name="PianoPrice" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <Field label="MONTAGE_SERVICE_PRICE" name="MontageServicePrice" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <Field label="DE_MONTAGE_SERVICE_PRICE" name="DeMontageServicePrice" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <Field label="LAMP_DEMONTAGE_AMOUNT" name="LampDemontageAmount" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <Field label="LAMP_DEMONTAGE_PRICE" name="LampDemontagePrice" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <Field label="BORE_AMOUNT" name="BoreAmount" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <Field label="BORE_PRICE" name="BorePrice" type="number" component={TextField} inputProps={{ step: 1, min: 0 }} />

          <FieldArray
            name="CarAmounts"
            render={(arrayHelper) => (
              <div></div>
            )}
          />

          {status && status.msg && <div>{status.msg}</div>}

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
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
