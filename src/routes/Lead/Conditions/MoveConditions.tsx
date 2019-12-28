import * as React from "react"
import Form from "../../../components/FormikFields/Form"
import { createStyles, Theme, WithStyles, withStyles, Grid, ListItem, List, ListItemText, ListItemSecondaryAction, TextField, MenuItem, IconButton } from "@material-ui/core"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import { Formik, FormikProps, Field, withFormik, FieldArray } from "formik"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import Submit from "../../../components/FormikFields/Submit"
import PageHeader from "../../../components/PageHeader"
import { IMoveServiceConditions } from "../../../interfaces/IConditions"
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl"
import FormikPrice from "../../../components/FormikFields/Numbers/FormikPrice"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import ServiceConditions from "./ServiceConditions"
import { IPutMoveService } from "../../../interfaces/IService"
import CarSelection from "./CarSelection"

const styles = (theme: Theme) => createStyles({})

interface Values  {
  moveConditions: IMoveServiceConditions
  moveService: IPutMoveService
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (moveConditions: IMoveServiceConditions, moveService: IPutMoveService) => Promise<any>
  moveConditions: IMoveServiceConditions
  moveService: IPutMoveService
}

class MoveConditions extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { values, isSubmitting, status, setFieldValue, selectedCompany, moveService, intl } = this.props

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
          >
            {moveService.BoreService ? (
              <FormikGroups label="BORE" xs={6} md={3}>
                <Field label="AMOUNT" name="moveConditions.BoreAmount" type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: undefined }} />
                <Field label="PRICE" name="moveConditions.BorePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
              </FormikGroups>
            ) : null}

            {moveService.LampDemontageService ? (
              <FormikGroups label="LAMP_DEMONTAGE" xs={6} md={3}>
                <Field
                  label="AMOUNT"
                  name="moveConditions.LampDemontageAmount"
                  type="number"
                  component={FormikTextField}
                  inputProps={{ step: 1, min: 0 }}
                  overrideGrid={{ xs: 6, md: undefined }}
                />
                <Field label="PRICE" name="moveConditions.LampDemontagePrice" component={FormikPrice} overrideGrid={{ xs: 6, md: undefined }} />
              </FormikGroups>
            ) : null}

            {moveService.FurnitureLiftService || moveService.PianoService || moveService.MontageService || moveService.DeMontageService || moveService.HeavyLiftService ? (
              <FormikGroups label="PRICES" xs={12} md={6}>
                {moveService.FurnitureLiftService ? <Field label="FURNITURE_LIFT" name="moveConditions.FurnitureLiftPrice" component={FormikPrice} /> : null}

                {moveService.PianoService ? <Field label="PIANO" name="moveConditions.PianoPrice" component={FormikPrice} /> : null}

                {moveService.MontageService ? <Field label="MONTAGE_SERVICE" name="moveConditions.MontageServicePrice" component={FormikPrice} /> : null}

                {moveService.DeMontageService ? <Field label="DE_MONTAGE_SERVICE" name="moveConditions.DeMontageServicePrice" component={FormikPrice} /> : null}

                {moveService.HeavyLiftService ? <Field label="HEAVY_LIFT_PRICE" name="moveConditions.ServiceConditions.HeavyLiftPrice" component={FormikPrice} /> : null}

              </FormikGroups>
            ) : null}
          </ServiceConditions>
        </Form>
      </Grid>
    )
  }

  getAdditionalCost = (): number => {
    const {
      values: { moveConditions: {PianoPrice, LampDemontagePrice, FurnitureLiftPrice, BorePrice, MontageServicePrice, DeMontageServicePrice} },
    } = this.props

    return (
      (PianoPrice ? PianoPrice : 0) +
      (LampDemontagePrice ? LampDemontagePrice : 0) +
      (FurnitureLiftPrice ? FurnitureLiftPrice : 0) +
      (BorePrice ? BorePrice : 0) +
      (MontageServicePrice ? MontageServicePrice : 0) +
      (DeMontageServicePrice ? DeMontageServicePrice : 0)
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
