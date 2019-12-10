import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography } from "@material-ui/core"
import { Formik, FormikProps, withFormik } from "formik"
import { injectIntl, InjectedIntlProps } from "react-intl"
import MoveOut from "../../components/FormikFields/Bundled/MoveOut"
import { IPostMoveInBuilding, IPostStorageBuilding, IPostDisposalOutBuilding } from "../../interfaces/IBuilding"
import Form from "../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../providers/withResource"
import Submit from "../../components/FormikFields/Submit"
import PageHeader from "../../components/PageHeader"
import MoveIn from "../../components/FormikFields/Bundled/MoveIn"
import Storage from "../../components/FormikFields/Bundled/Storage"
import Disposal from "../../components/FormikFields/Bundled/Disposal";
import { IBuildingCopy } from "../../components/FormikFields/Bundled/BuildingCopy";

const styles = (theme: Theme) => createStyles({})

interface Values {
  disposalBuilding: IPostDisposalOutBuilding
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (disposalBuilding: IPostDisposalOutBuilding) => void
  buildingOptions: IBuildingCopy
  disposalBuilding: IPostDisposalOutBuilding
}

class DisposalBuilding extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, selectedCompany, buildingOptions } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="DISPOSAL_BUILDING" />

          <Disposal buildingOptions={buildingOptions} prefix="disposalBuilding" resource={resource} />
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
        mapPropsToValues: props => ({ disposalBuilding: props.disposalBuilding }),

        handleSubmit: async (values, actions) => {
          await actions.props.onChangeAndSave(values.disposalBuilding)

          actions.setSubmitting(false)

          actions.resetForm()
          actions.props.nextPage()
        },
      })(DisposalBuilding)
    )
  )
)
