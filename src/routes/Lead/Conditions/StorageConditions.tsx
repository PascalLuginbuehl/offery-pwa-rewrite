import * as React from "react"
import * as Yup from "yup"
import Form from "../../../components/FormikFields/Form"
import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, TextField as MuiTextField, Divider, Typography } from "@material-ui/core"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps, FieldArray } from "formik"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import Submit from "../../../components/FormikFields/Submit"
import PageHeader from "../../../components/PageHeader"
import { IMoveServiceConditions, IPackServiceConditions, IStorageServiceConditions } from "../../../interfaces/IConditions"
import { injectIntl, InjectedIntlProps } from "react-intl"
import FormikPrice from "../../../components/FormikFields/Numbers/FormikPrice"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import ServiceConditions from "./ServiceConditions"
import FormikNumberEndAdornmentText from "../../../components/FormikFields/Numbers/FormikNumberEndAdornmentText"
import { IPutStorageService } from "../../../interfaces/IService"

const styles = (theme: Theme) => createStyles({})

interface Values {
  storageConditions: IStorageServiceConditions
  storageService: IPutStorageService
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (storageConditions: IStorageServiceConditions, storageService: IPutStorageService) => Promise<any>
  storageConditions: IStorageServiceConditions
  storageService: IPutStorageService
}

class StorageConditions extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { values, intl, resource, setFieldValue, selectedCompany, storageService } = this.props

    console.log(selectedCompany.CarTypes)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="STORAGE_CONDITIONS" />

          <ServiceConditions
            prefix={"storageConditions"}
            commentPrefix={"storageService"}
            additionalCost={this.getAdditionalCost()}
            setFieldValue={setFieldValue}
            values={values.storageConditions}
          >
            {storageService.BoreService ? (
              <FormikGroups label="BORE" xs={6} md={3}>
                <Field label="AMOUNT" name="storageConditions.BoreAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: undefined }} />
                <Field label="PRICE" name="storageConditions.BorePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
              </FormikGroups>
            ) : null}

            {storageService.LampDemontageService ? (
              <FormikGroups label="LAMP_DEMONTAGE" xs={6} md={3}>
                <Field
                  label="AMOUNT"
                  name="storageConditions.LampDemontageAmount"
                  type="number"
                  component={FormikTextField}
                  inputProps={{ step: 1, min: 0 }}
                  overrideGrid={{ xs: 6, md: undefined }}
                />
                <Field label="PRICE" name="storageConditions.LampDemontagePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
              </FormikGroups>
            ) : null}

            {storageService.FurnitureLiftService || storageService.PianoService || storageService.MontageService || storageService.DeMontageService || storageService.HeavyLiftService ? (
              <FormikGroups label="PRICES" xs={12} md={6}>
                {storageService.FurnitureLiftService ? <Field label="FURNITURE_LIFT" name="storageConditions.FurnitureLiftPrice" component={FormikPrice} /> : null}

                {storageService.PianoService ? <Field label="PIANO" name="storageConditions.PianoPrice" component={FormikPrice} /> : null}

                {storageService.MontageService ? <Field label="MONTAGE_SERVICE" name="storageConditions.MontageServicePrice" component={FormikPrice} /> : null}

                {storageService.DeMontageService ? <Field label="DE_MONTAGE_SERVICE" name="storageConditions.DeMontageServicePrice" component={FormikPrice} /> : null}

                {storageService.HeavyLiftService ? <Field label="HEAVY_LIFT_PRICE" name="storageConditions.ServiceConditions.HeavyLiftPrice" component={FormikPrice} /> : null}

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
