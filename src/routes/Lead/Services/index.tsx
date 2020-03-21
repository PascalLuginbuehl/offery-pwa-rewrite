import { createStyles,   Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import { FormikProps, Field, withFormik } from "formik"

import Form from "../../../components/FormikFields/Form"

import { IServices } from "../../../interfaces/IService"
import PageHeader from "../../../components/PageHeader"
import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"

const styles = (theme: Theme) => createStyles({})

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  data: IServices
  onChangeAndSave: (data: IServices) => Promise<void>
  nextPage: () => void
}

class Index extends React.Component<Props & FormikProps<IServices>, {}> {
  public render() {
    const { selectedCompany, data } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="SERVICES" />

          {selectedCompany.Settings.EnableServiceMove ? (<Field name="HasMoveServiceEnabled" label="MOVE" component={FormikButtonCheckbox} />) : null}

          {selectedCompany.Settings.EnableServicePack ? (<Field name="HasPackServiceEnabled" label="PACK" component={FormikButtonCheckbox} />) : null}

          {selectedCompany.Settings.EnableServiceStorage ? (<Field name="HasStorageServiceEnabled" label="STORAGE" component={FormikButtonCheckbox} />) : null}

          {selectedCompany.Settings.EnableServiceDisposal ? (<Field name="HasDisposalServiceEnabled" label="DISPOSAL" component={FormikButtonCheckbox} />) : null}

          {selectedCompany.Settings.EnableServiceCleaning ? (<Field name="HasCleaningServiceEnabled" label="CLEANING" component={FormikButtonCheckbox} />) : null}
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, IServices>({
      mapPropsToValues: props => props.data,

      handleSubmit: async (values, actions) => {
        try {
          await actions.props.onChangeAndSave(values)
          actions.setSubmitting(false)

          actions.resetForm()
          actions.props.nextPage()
        } catch (e) {
          actions.setStatus(e)
        }
      },
    })(Index)
  )
)
