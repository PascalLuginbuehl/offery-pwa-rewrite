import * as React from "react"
import Form from "../../../components/FormikFields/Form"
import { createStyles, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import {  FormikProps, Field, withFormik } from "formik"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

import PageHeader from "../../../components/PageHeader"
import { IMoveServiceConditions } from "../../../interfaces/IConditions"
import { injectIntl, WrappedComponentProps } from "react-intl"
import FormikPrice from "../../../components/FormikFields/Numbers/FormikPrice"
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

    //Set default values from settings if configured, enabled and not set yet
    if (showFurnitureLift && values.moveConditions.FurnitureLiftPrice == null)
      values.moveConditions.FurnitureLiftPrice = selectedCompany.Settings.DefaultFurnitureLiftPrice

    if (showPiano && values.moveConditions.PianoPrice == null)
      values.moveConditions.PianoPrice = selectedCompany.Settings.DefaultPianoPrice

    if (showHeavyLift && values.moveConditions.ServiceConditions.HeavyLiftPrice == null)
      values.moveConditions.ServiceConditions.HeavyLiftPrice = selectedCompany.Settings.DefaultHeavyLiftPrice

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
                  (<Field label="PRICE" name="moveConditions.BorePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />) : null }
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
                {selectedCompany.Settings.EnableServiceMoveLampDemontagePrice ?
                  (<Field label="PRICE" name="moveConditions.LampDemontagePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />) : null}
              </FormikGroups>
              ) : null}

            {showFurnitureLift || showPiano || showHeavyLift || showMontageCondition || showDeMontageCondition ? (
              <FormikGroups label="PRICES" xs={12} md={6}>
                {showFurnitureLift ? <Field label="FURNITURE_LIFT" name="moveConditions.FurnitureLiftPrice" component={FormikPrice} /> : null}

                {showPiano ? <Field label="PIANO" name="moveConditions.PianoPrice" component={FormikPrice} /> : null}

                {showMontageCondition ? <Field label="MONTAGE_SERVICE" name="moveConditions.MontageServicePrice" component={FormikPrice} /> : null}

                {showDeMontageCondition ? <Field label="DE_MONTAGE_SERVICE" name="moveConditions.DeMontageServicePrice" component={FormikPrice} /> : null}

                {showHeavyLift ? <Field label="HEAVY_LIFT_PRICE" name="moveConditions.ServiceConditions.HeavyLiftPrice" component={FormikPrice} /> : null}
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
