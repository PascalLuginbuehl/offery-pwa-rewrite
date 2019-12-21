import * as React from "react"
import Form from "../../components/FormikFields/Form"
import { createStyles, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import { withResource, WithResourceProps } from "../../providers/withResource"
import { FormikProps, withFormik } from "formik"
import Submit from "../../components/FormikFields/Submit"
import PageHeader from "../../components/PageHeader"
import { IPackServiceConditions } from "../../interfaces/IConditions"
import { injectIntl, InjectedIntlProps } from "react-intl"
import ServiceConditions from "./ServiceConditions"
import { IPutPackService } from "../../interfaces/IService"

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
    const { values, isSubmitting, status, setFieldValue, selectedCompany } = this.props

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
            {/**/}
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
