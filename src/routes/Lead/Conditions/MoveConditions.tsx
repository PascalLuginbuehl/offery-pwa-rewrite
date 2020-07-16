import * as React from "react"
import Form from "../../../components/FormikFields/Form"
import { createStyles, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import {  FormikProps, Field, withFormik } from "formik"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

import PageHeader from "../../../components/PageHeader"
import { IMoveServiceConditions } from "../../../interfaces/IConditions"
import { injectIntl, WrappedComponentProps } from "react-intl"
import FormikPrice from "../../../components/Formik/CustomComponents/FormikPrice"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import ServiceConditions from "./ServiceConditions"
import { IPutMoveService } from "../../../interfaces/IService"

const styles = (theme: Theme) => createStyles({})

interface Values  {
  moveConditions: IMoveServiceConditions
  moveService: IPutMoveService
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  nextPage: () => void
  onChangeAndSave: (moveConditions: IMoveServiceConditions, moveService: IPutMoveService) => Promise<any>
  moveConditions: IMoveServiceConditions
  moveService: IPutMoveService
}

class MoveConditions extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { values, isSubmitting, status, setFieldValue, resource, selectedCompany, moveService, intl } = this.props
    const showFurnitureLift = (moveService.FurnitureLiftService && selectedCompany.Settings.EnableServiceMoveFurnitureLift && selectedCompany.Settings.EnableServiceMoveFurnitureLiftPrice)
    const showHeavyLift = (moveService.HeavyLiftService && selectedCompany.Settings.EnableServiceMoveHeavyLift && selectedCompany.Settings.EnableServiceMoveHeavyLiftPrice)
    const showPiano = (moveService.PianoService && selectedCompany.Settings.EnableServiceMovePiano && selectedCompany.Settings.EnableServiceMovePianoPrice)
    const showMontageCondition = (moveService.MontageService && selectedCompany.Settings.EnableServiceMoveMontage && selectedCompany.Settings.EnableServiceMoveMontagePrice)
    const showDeMontageCondition = (moveService.DeMontageService && selectedCompany.Settings.EnableServiceMoveDemontage && selectedCompany.Settings.EnableServiceMoveDemontagePrice)

    const formatMessage = intl.formatMessage.bind(intl)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MOVE_CONDITIONS" />
          <ServiceConditions
            additionalCost={this.getAdditionalCost()}
            setFieldValue={setFieldValue}
            values={values.moveConditions}
            prefix={"moveConditions"}
            commentPrefix={"moveService"}
            commentEnabled={selectedCompany.Settings.EnableServiceMoveComment}
          >
            {selectedCompany.Settings.EnableServiceMoveBore && moveService.BoreService &&
             (selectedCompany.Settings.EnableServiceMoveBoreAmount || selectedCompany.Settings.EnableServiceMoveBorePrice) ?
              (<FormikGroups label="BORE" xs={6} md={3}>
                {selectedCompany.Settings.EnableServiceMoveBoreAmount ?
                  (<Field label="AMOUNT" name="moveConditions.BoreAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: undefined }} />) : null }
                {selectedCompany.Settings.EnableServiceMoveBorePrice ?
                  (
                    <Grid item xs={6}>
                      <FormikPrice label={formatMessage({id: "PRICE"})} name="moveConditions.BorePrice" />
                    </Grid>
                  ) : null }
              </FormikGroups>
              ) : null}

            {selectedCompany.Settings.EnableServiceMoveLampDemontage && moveService.LampDemontageService &&
             (selectedCompany.Settings.EnableServiceMoveLampDemontageAmount || selectedCompany.Settings.EnableServiceMoveLampDemontagePrice) ?
              (<FormikGroups label="LAMP_DEMONTAGE" xs={6} md={3}>
                {selectedCompany.Settings.EnableServiceMoveLampDemontageAmount ?
                  (<Field
                    label="AMOUNT"
                    name="moveConditions.LampDemontageAmount"
                    type="number"
                    component={FormikTextField}
                    inputProps={{ step: 1, min: 0 }}
                    overrideGrid={{ xs: 6, md: undefined }}
                  />) : null }
                {selectedCompany.Settings.EnableServiceMoveLampDemontagePrice ? (
                  <Grid item xs={6}>
                    <FormikPrice label={formatMessage({id: "PRICE"})} name="moveConditions.LampDemontagePrice" />
                  </Grid>
                ) : null}
              </FormikGroups>
              ) : null}

            {showFurnitureLift || showPiano || showHeavyLift || showMontageCondition || showDeMontageCondition ? (
              <FormikGroups label="PRICES" xs={12} md={6}>
                {showFurnitureLift ? <Grid item xs={6} md={3}><FormikPrice label={formatMessage({id: "FURNITURE_LIFT"})} name="moveConditions.FurnitureLiftPrice" /></Grid> : null}

                {showPiano ? <Grid item xs={6} md={3}><FormikPrice label={formatMessage({id: "PIANO"})} name="moveConditions.PianoPrice" /></Grid> : null}

                {showMontageCondition ? <Grid item xs={6} md={3}><FormikPrice label={formatMessage({id: "MONTAGE_SERVICE"})} name="moveConditions.MontageServicePrice" /></Grid> : null}

                {showDeMontageCondition ? <Grid item xs={6} md={3}><FormikPrice label={formatMessage({id: "DE_MONTAGE_SERVICE"})} name="moveConditions.DeMontageServicePrice" /></Grid> : null}

                {showHeavyLift ? <Grid item xs={6} md={3}><FormikPrice label={formatMessage({id: "HEAVY_LIFT_PRICE"})} name="moveConditions.ServiceConditions.HeavyLiftPrice" /></Grid> : null}
              </FormikGroups>
            ) : null}
          </ServiceConditions>
        </Form>
      </Grid>
    )
  }

  getAdditionalCost = (): number => {
    const {
      moveService: { PianoService, LampDemontageService, FurnitureLiftService, BoreService, MontageService, HeavyLiftService, DeMontageService },
      values: { moveConditions: { PianoPrice: NullPianoPrice, LampDemontagePrice: NullLampDemontagePrice, FurnitureLiftPrice: NullFurnitureLiftPrice, BorePrice: NullBorePrice, MontageServicePrice: NullMontageServicePrice, DeMontageServicePrice: NullDeMontageServicePrice, ServiceConditions: { HeavyLiftPrice: NullHeavyLiftPrice } } },
    } = this.props

    const PianoPrice = NullPianoPrice && PianoService ? NullPianoPrice : 0
    const LampDemontagePrice = NullLampDemontagePrice && LampDemontageService ? NullLampDemontagePrice : 0
    const FurnitureLiftPrice = NullFurnitureLiftPrice && FurnitureLiftService ? NullFurnitureLiftPrice : 0
    const BorePrice = NullBorePrice && BoreService ? NullBorePrice : 0
    const MontageServicePrice = NullMontageServicePrice && MontageService ? NullMontageServicePrice : 0
    const DeMontageServicePrice = NullDeMontageServicePrice && DeMontageService ? NullDeMontageServicePrice : 0
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
        mapPropsToValues: props => ({ moveConditions: props.moveConditions, moveService: props.moveService }),

        handleSubmit: async (values, actions) => {
          try {
            await actions.props.onChangeAndSave(values.moveConditions, values.moveService)

            actions.setSubmitting(false)
            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(MoveConditions)
    )
  )
)
