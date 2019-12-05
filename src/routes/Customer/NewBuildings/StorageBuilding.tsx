import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import { FormikProps, withFormik } from "formik"
import { injectIntl, InjectedIntlProps } from "react-intl"
import { IPostStorageBuilding } from "../../../interfaces/IBuilding"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import Submit from "../../../components/FormikFields/Submit"
import PageHeader from "../../../components/PageHeader"
import Storage from "../../../components/FormikFields/Bundled/Storage";

const styles = (theme: Theme) => createStyles({})

interface Values {
  storageBuilding: IPostStorageBuilding
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (storageBuilding: IPostStorageBuilding) => void
  storageBuilding: IPostStorageBuilding
}

class StorageBuilding extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, selectedCompany } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="STORAGE_BUILDING" />

          <Storage prefix="storageBuilding" resource={resource} />
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
        mapPropsToValues: props => ({ storageBuilding: props.storageBuilding }),

        handleSubmit: async (values, actions) => {
          await actions.props.onChangeAndSave(values.storageBuilding)

          actions.setSubmitting(false)

          actions.resetForm()
          actions.props.nextPage()
        },
      })(StorageBuilding)
    )
  )
)
