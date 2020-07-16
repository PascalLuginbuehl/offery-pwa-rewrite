import * as React from "react"

import Form from "../../../components/FormikFields/Form"
import { createStyles,   Theme, WithStyles, withStyles, Grid,  InputAdornment, TextField as MuiTextField } from "@material-ui/core"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import {  FormikProps, Field,   withFormik } from "formik"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

import PageHeader from "../../../components/PageHeader"
import {   IStorageServiceConditions } from "../../../interfaces/IConditions"
import { injectIntl, WrappedComponentProps } from "react-intl"
import FormikPrice from "../../../components/Formik/CustomComponents/FormikPrice"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import ServiceConditions from "./ServiceConditions"
import FormikNumberEndAdornmentText from "../../../components/FormikFields/Numbers/FormikNumberEndAdornmentText"
import { IPutStorageService } from "../../../interfaces/IService"

const styles = (theme: Theme) => createStyles({})

interface Values {
  storageConditions: IStorageServiceConditions
  storageService: IPutStorageService
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  nextPage: () => void
  onChangeAndSave: (storageConditions: IStorageServiceConditions, storageService: IPutStorageService) => Promise<any>
  storageConditions: IStorageServiceConditions
  storageService: IPutStorageService
}

class StorageConditions extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { values, intl, resource, setFieldValue, selectedCompany, storageService } = this.props
    const showMontagePrice = (storageService.MontageService && selectedCompany.Settings.EnableServiceStorageMontage && selectedCompany.Settings.EnableServiceStorageMontagePrice)
    const showDeMontagePrice = (storageService.DeMontageService && selectedCompany.Settings.EnableServiceStorageDemontage && selectedCompany.Settings.EnableServiceStorageDemontagePrice)
    const showFurnitureLiftPrice = (storageService.FurnitureLiftService && selectedCompany.Settings.EnableServiceStorageFurnitureLift && selectedCompany.Settings.EnableServiceStorageFurnitureLiftPrice)
    const showHeavyLiftPrice = (storageService.HeavyLiftService && selectedCompany.Settings.EnableServiceStorageHeavyLift && selectedCompany.Settings.EnableServiceStorageHeavyLiftPrice)
    const showPiano = (storageService.PianoService && selectedCompany.Settings.EnableServiceStoragePiano && selectedCompany.Settings.EnableServiceStoragePianoPrice)

    const formatMessage = intl.formatMessage.bind(intl)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="STORAGE_CONDITIONS" />

          <ServiceConditions
            prefix={"storageConditions"}
            commentPrefix={"storageService"}
            commentEnabled={selectedCompany.Settings.EnableServiceStorageComment}
            additionalCost={this.getAdditionalCost()}
            setFieldValue={setFieldValue}
            values={values.storageConditions}
          >
            {selectedCompany.Settings.EnableServiceStorageBore && storageService.BoreService &&
              (selectedCompany.Settings.EnableServiceStorageBoreAmount || selectedCompany.Settings.EnableServiceStorageBorePrice) ?
              (<FormikGroups label="BORE" xs={6} md={3}>
                {selectedCompany.Settings.EnableServiceStorageBoreAmount ?
                  (<Field label="AMOUNT" name="storageConditions.BoreAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: undefined }} />) : null }
                {selectedCompany.Settings.EnableServiceStorageBorePrice ?
                  (<Grid item xs={6}><FormikPrice label={formatMessage({id: "PRICE"})} name="storageConditions.BorePrice" /></Grid>) : null }
              </FormikGroups>
              ) : null}

            {selectedCompany.Settings.EnableServiceStorageLampDemontage && storageService.LampDemontageService &&
              (selectedCompany.Settings.EnableServiceStorageLampDemontageAmount || selectedCompany.Settings.EnableServiceStorageLampDemontagePrice ) ?
              (<FormikGroups label="LAMP_DEMONTAGE" xs={6} md={3}>
                {selectedCompany.Settings.EnableServiceStorageLampDemontageAmount ?
                  (<Field
                    label="AMOUNT"
                    name="storageConditions.LampDemontageAmount"
                    type="number"
                    component={FormikTextField}
                    inputProps={{ step: 1, min: 0 }}
                    overrideGrid={{ xs: 6, md: undefined }}
                  />) : null }
                {selectedCompany.Settings.EnableServiceStorageLampDemontagePrice ?
                  (<Grid item xs={6}><FormikPrice label={formatMessage({id: "PRICE"})} name="storageConditions.LampDemontagePrice" /></Grid>) : null }
              </FormikGroups>
              ) : null}

            {showFurnitureLiftPrice || showPiano || showMontagePrice || showDeMontagePrice || showHeavyLiftPrice ? (
              <FormikGroups label="PRICES" xs={12} md={6}>
                {showFurnitureLiftPrice ? <Grid item xs={6} md={3}><FormikPrice label={formatMessage({id: "FURNITURE_LIFT"})} name="storageConditions.FurnitureLiftPrice" /></Grid> : null}

                {showPiano ? <Grid item xs={6} md={3}><FormikPrice label={formatMessage({id: "PIANO"})} name="storageConditions.PianoPrice" /></Grid> : null}

                {showMontagePrice ? <Grid item xs={6} md={3}><FormikPrice label={formatMessage({id: "MONTAGE_SERVICE"})} name="storageConditions.MontageServicePrice" /></Grid> : null}

                {showDeMontagePrice ? <Grid item xs={6} md={3}><FormikPrice label={formatMessage({id: "DE_MONTAGE_SERVICE"})} name="storageConditions.DeMontageServicePrice" /></Grid> : null}

                {showHeavyLiftPrice ? <Grid item xs={6} md={3}><FormikPrice label={formatMessage({id: "HEAVY_LIFT_PRICE"})} name="storageConditions.ServiceConditions.HeavyLiftPrice" /></Grid> : null}
              </FormikGroups>
            ) : null}
          </ServiceConditions>

          <FormikGroups label="STORAGE_PRICE_PER_MONTH" xs={12}>
            <Field label="VOLUME" name="storageConditions.Volume" component={FormikNumberEndAdornmentText} adornmentText="m³" overrideGrid={{ xs: 4, md: 3 }} />
            <Field
              label="CHF_PER_M"
              name="storageConditions.CostPerCubicMonthInMoney"
              component={FormikNumberEndAdornmentText}
              position="start"
              adornmentText="CHF/m³"
              overrideGrid={{ xs: 3, md: 3 }}
            />

            <Grid item xs={5} md={6}>
              <MuiTextField
                label={intl.formatMessage({ id: "STORAGE_PRICE_PER_MONTH" })}
                value={(values.storageConditions.Volume ? values.storageConditions.Volume : 0) * (values.storageConditions.CostPerCubicMonthInMoney ? values.storageConditions.CostPerCubicMonthInMoney : 0)}
                disabled={true}
                type="number"
                InputProps={{ startAdornment: <InputAdornment position="start">CHF</InputAdornment> }}
              />
            </Grid>
          </FormikGroups>
        </Form>
      </Grid>
    )
  }

  getAdditionalCost = (): number => {
    const {
      storageService: { PianoService, LampDemontageService, FurnitureLiftService, BoreService, MontageService, HeavyLiftService, DeMontageService},
      values: { storageConditions: { PianoPrice: NullPianoPrice, LampDemontagePrice: NullLampDemontagePrice, FurnitureLiftPrice: NullFurnitureLiftPrice, BorePrice: NullBorePrice, MontageServicePrice: NullMontageServicePrice, DeMontageServicePrice: NullDeMontageServicePrice, ServiceConditions: { HeavyLiftPrice: NullHeavyLiftPrice }} },
    } = this.props

    const PianoPrice = NullPianoPrice && PianoService ? NullPianoPrice : 0
    const LampDemontagePrice = NullLampDemontagePrice && LampDemontageService ? NullLampDemontagePrice : 0
    const FurnitureLiftPrice = NullFurnitureLiftPrice && FurnitureLiftService ? NullFurnitureLiftPrice : 0
    const BorePrice = NullBorePrice && BoreService ? NullBorePrice : 0
    const MontageServicePrice = NullMontageServicePrice && MontageService ? NullMontageServicePrice : 0
    const DeMontageServicePrice = NullDeMontageServicePrice && DeMontageService  ? NullDeMontageServicePrice : 0
    const HeavyLiftPrice = NullHeavyLiftPrice && HeavyLiftService ? NullHeavyLiftPrice : 0

    return (
      PianoPrice +
      LampDemontagePrice +
      FurnitureLiftPrice +
      BorePrice +
      MontageServicePrice +
      DeMontageServicePrice +
      HeavyLiftPrice
    )
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ storageConditions: props.storageConditions, storageService: props.storageService }),

        handleSubmit: async (values, actions) => {
          try {
            await actions.props.onChangeAndSave(values.storageConditions, values.storageService)

            actions.setSubmitting(false)

            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(StorageConditions)
    )
  )
)
