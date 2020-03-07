import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography } from "@material-ui/core"
import { Formik, FormikProps, withFormik } from "formik"
import { injectIntl, InjectedIntlProps } from "react-intl"
import MoveOut from "../../../components/FormikFields/Bundled/MoveOut"
import { IPostMoveInBuilding, IPostStorageBuilding, IPostCleaningBuilding, IPostBuilding } from "../../../interfaces/IBuilding"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import Submit from "../../../components/FormikFields/Submit"
import PageHeader from "../../../components/PageHeader"
import MoveIn from "../../../components/FormikFields/Bundled/MoveIn"
import Storage from "../../../components/FormikFields/Bundled/Storage"
import Cleaning from "../../../components/FormikFields/Bundled/Cleaning"
import { RouteComponentProps, Prompt } from "react-router"
import { IBuildingCopy } from "../../../components/FormikFields/Bundled/BuildingCopy"
import BuildingEdit from "../../../components/FormikFields/Bundled/BuildingEdit"

const styles = (theme: Theme) => createStyles({})

interface Values {
  building: IPostBuilding
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps, RouteComponentProps {
  nextPage: () => void
  onChangeAndSave: (building: IPostBuilding) => Promise<void>
  building: IPostBuilding
}

class CleaningBuilding extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, selectedCompany } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="BUILDING" />

          <BuildingEdit prefix="building" resource={resource} />
        </Form>
      </Grid>
    )
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ building: props.building }),

        handleSubmit: async (values, actions) => {
          try {
            await actions.props.onChangeAndSave(values.building)

            actions.setSubmitting(false)

            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(CleaningBuilding)
    )
  )
)
