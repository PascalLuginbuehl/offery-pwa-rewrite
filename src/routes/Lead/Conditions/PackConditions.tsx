import * as React from "react"
import Form from "../../../components/FormikFields/Form"
import { createStyles, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import { FormikProps, withFormik, Field } from "formik"
import Submit from "../../../components/FormikFields/Submit"
import PageHeader from "../../../components/PageHeader"
import { IPackServiceConditions } from "../../../interfaces/IConditions"
import { injectIntl, InjectedIntlProps } from "react-intl"
import ServiceConditions from "./ServiceConditions"
import { IPutPackService } from "../../../interfaces/IService"
import FormikPrice from "../../../components/FormikFields/Numbers/FormikPrice"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import PackService from "../Services/PackService"

const styles = (theme: Theme) => createStyles({})

interface Values {
  packConditions: IPackServiceConditions
  packService: IPutPackService
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (packConditions: IPackServiceConditions, packService: IPutPackService) => Promise<any>
  packConditions: IPackServiceConditions
  packService: IPutPackService
}

class PackConditions extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { values, isSubmitting, status, setFieldValue, selectedCompany, packService } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="PACK_CONDITIONS" />

          <ServiceConditions
            prefix={"packConditions"}
            commentPrefix={"packService"}
            disabledVehicles
            additionalCost={0}
            setFieldValue={setFieldValue}
            values={values.packConditions}
          >
            {packService.HeavyLiftService ?
              <FormikGroups label="PRICES" xs={12} md={6}>
                {packService.HeavyLiftService ? <Field label="HEAVY_LIFT_PRICE" name="packService.ServiceConditions.HeavyLiftPrice" component={FormikPrice} /> : null}
              </FormikGroups>
              : null }
          </ServiceConditions>
        </Form>
      </Grid>
    )
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ packConditions: props.packConditions, packService: props.packService }),

        handleSubmit: async (values, actions) => {
          try {
            await actions.props.onChangeAndSave(values.packConditions, values.packService)

            actions.setSubmitting(false)

            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(PackConditions)
    )
  )
)