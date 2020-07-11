import * as React from "react"

import Form from "../../../components/FormikFields/Form"
import { createStyles,   Theme, WithStyles, withStyles, Grid,  InputAdornment, TextField as MuiTextField } from "@material-ui/core"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import {  FormikProps, Field,   withFormik } from "formik"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

import PageHeader from "../../../components/PageHeader"
import {   IDisposalServiceConditions } from "../../../interfaces/IConditions"
import { injectIntl, WrappedComponentProps } from "react-intl"
import FormikPrice from "../../../components/Formik/CustomComponents/FormikPrice"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import ServiceConditions from "./ServiceConditions"
import FormikNumberEndAdornmentText from "../../../components/FormikFields/Numbers/FormikNumberEndAdornmentText"

import { IPutDisposalService } from "../../../interfaces/IService"

const styles = (theme: Theme) => createStyles({})

interface Values {
  disposalConditions: IDisposalServiceConditions
  disposalService: IPutDisposalService
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  nextPage: () => void
  onChangeAndSave: (disposalConditions: IDisposalServiceConditions, disposalService: IPutDisposalService) => Promise<any>
  disposalConditions: IDisposalServiceConditions
  disposalService: IPutDisposalService
}

class DisposalConditions extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { values, isSubmitting, status, intl, setFieldValue, selectedCompany, disposalService } = this.props
    const showDeMontagePrice = (disposalService.DeMontage && selectedCompany.Settings.EnableServiceDisposalDemontage && selectedCompany.Settings.EnableServiceDisposalDemontagePrice)
    const showHeavyLiftPrice = (disposalService.HeavyLiftService && selectedCompany.Settings.EnableServiceDisposalHeavyLift && selectedCompany.Settings.EnableServiceDisposalHeavyLiftPrice)
    const showFurnitureLiftPrice = (disposalService.FurnitureLiftService && selectedCompany.Settings.EnableServiceDisposalFurnitureLift && selectedCompany.Settings.EnableServiceDisposalFurnitureLiftPrice)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="DISPOSAL_CONDITIONS" />

          <ServiceConditions
            additionalCost={this.getAdditionalCost()}
            setFieldValue={setFieldValue}
            values={values.disposalConditions}
            prefix={"disposalConditions"}
            commentPrefix={"disposalService"}
            commentEnabled={selectedCompany.Settings.EnableServiceDisposalComment}
            personalCostAddon={<Grid item xs={3}><FormikPrice label="ENTRY_COST" name="disposalConditions.CostEntry" /></Grid>}
          >
            {selectedCompany.Settings.EnableServiceDisposalLampDemontage && disposalService.LampDemontageService &&
              (selectedCompany.Settings.EnableServiceDisposalLampDemontageAmount || selectedCompany.Settings.EnableServiceDisposalLampDemontagePrice) ?
              (<FormikGroups label="LAMP_DEMONTAGE" xs={6} md={3}>
                {selectedCompany.Settings.EnableServiceDisposalLampDemontageAmount ?
                  (<Field
                    label="AMOUNT"
                    name="disposalConditions.LampDemontageAmount"
                    type="number"
                    component={FormikTextField}
                    inputProps={{ step: 1, min: 0 }}
                    overrideGrid={{ xs: 6, md: undefined }}
                  />) : null }
                {selectedCompany.Settings.EnableServiceDisposalLampDemontagePrice ?
                  (<Grid item xs={6}><FormikPrice label="PRICE" name="disposalConditions.LampDemontagePrice"/></Grid>) : null }
              </FormikGroups>
              ) : null}

            {showFurnitureLiftPrice || showHeavyLiftPrice || showDeMontagePrice ? (
              <FormikGroups label="PRICES" xs={6} md={3}>
                {showFurnitureLiftPrice ? <Grid item xs={6}><FormikPrice label="FURNITURE_LIFT" name="disposalConditions.FurnitureLiftPrice"/></Grid> : null }

                {showHeavyLiftPrice ? <Grid item xs={6}><FormikPrice label="HEAVY_LIFT_PRICE" name="disposalConditions.ServiceConditions.HeavyLiftPrice"/></Grid> : null}

                {showDeMontagePrice ? <Grid item xs={6}><FormikPrice label="DE_MONTAGE_SERVICE" name="disposalConditions.DeMontageServicePrice"/></Grid> : null}
              </FormikGroups>
            ) : null}

            <FormikGroups label="DISPOSAL_FEES_PER_CUBIC_METER" xs={12}>
              <Field label="VOLUME" name="disposalConditions.Volume" component={FormikNumberEndAdornmentText} adornmentText="m³" overrideGrid={{ xs: 4, md: 3 }} />
              <Field
                label="CHF_PER_M"
                name="disposalConditions.CostPerCubicInMoney"
                component={FormikNumberEndAdornmentText}
                position="start"
                adornmentText="CHF/m³"
                overrideGrid={{ xs: 3, md: 3 }}
              />

              <Grid item xs={5} md={6}>
                <MuiTextField
                  label={intl.formatMessage({ id: "DISPOSAL_FEES" })}
                  value={(values.disposalConditions.Volume ? values.disposalConditions.Volume : 0) * (values.disposalConditions.CostPerCubicInMoney ? values.disposalConditions.CostPerCubicInMoney : 0)}
                  disabled={true}
                  type="number"
                  InputProps={{ startAdornment: <InputAdornment position="start">CHF</InputAdornment> }}
                />
              </Grid>
            </FormikGroups>
          </ServiceConditions>
        </Form>
      </Grid>
    )
  }


  getAdditionalCost = (): number => {
    const {
      disposalService: { LampDemontageService, FurnitureLiftService, HeavyLiftService, DeMontage },
      values: { disposalConditions: { LampDemontagePrice: NullLampDemontagePrice, FurnitureLiftPrice: NullFurnitureLiftPrice, CostEntry: NullCostEntry, Volume: NullVolume, CostPerCubicInMoney: NullCostPerCubicInMoney,
        DeMontageServicePrice: NullDeMontageServicePrice, ServiceConditions: { HeavyLiftPrice: NullHeavyLiftPrice } } },
    } = this.props

    const LampDemontagePrice = NullLampDemontagePrice && LampDemontageService ? NullLampDemontagePrice : 0
    const FurnitureLiftPrice = NullFurnitureLiftPrice && FurnitureLiftService ? NullFurnitureLiftPrice : 0
    const HeavyLiftPrice = NullHeavyLiftPrice && HeavyLiftService ? NullHeavyLiftPrice : 0
    const CostEntry = NullCostEntry ? NullCostEntry : 0
    const Volume = NullVolume ? NullVolume : 0
    const CostPerCubicInMoney = NullCostPerCubicInMoney ? NullCostPerCubicInMoney : 0
    const DeMontageServicePrice = NullDeMontageServicePrice && DeMontage ? NullDeMontageServicePrice : 0

    return (
      LampDemontagePrice +
      FurnitureLiftPrice +
      CostEntry +
      HeavyLiftPrice +
      DeMontageServicePrice +
      (Volume * CostPerCubicInMoney)
    )
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ disposalConditions: props.disposalConditions, disposalService: props.disposalService }),

        handleSubmit: async (values, actions) => {
          try {
            await actions.props.onChangeAndSave(values.disposalConditions, values.disposalService)

            actions.setSubmitting(false)
            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(DisposalConditions)
    )
  )
)
