import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography } from "@material-ui/core"
import { Formik, FormikProps, withFormik } from "formik"
import { injectIntl, InjectedIntlProps } from "react-intl"
import MoveOut from "../../components/FormikFields/Bundled/MoveOut"
import { IPostMoveInBuilding, IPostStorageBuilding, IPostCleaningBuilding } from "../../interfaces/IBuilding"
import Form from "../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../providers/withResource"
import Submit from "../../components/FormikFields/Submit"
import PageHeader from "../../components/PageHeader"
import MoveIn from "../../components/FormikFields/Bundled/MoveIn"
import Storage from "../../components/FormikFields/Bundled/Storage"
import Cleaning from "../../components/FormikFields/Bundled/Cleaning"
import { RouteComponentProps, Prompt } from "react-router"
import { IBuildingCopy } from "../../components/FormikFields/Bundled/BuildingCopy"

const styles = (theme: Theme) => createStyles({})

interface Values {
  cleaningBuilding: IPostCleaningBuilding
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps, RouteComponentProps {
  nextPage: () => void
  onChangeAndSave: (cleaningBuilding: IPostCleaningBuilding) => Promise<void>
  cleaningBuilding: IPostCleaningBuilding
  buildingOptions: IBuildingCopy
}

class CleaningBuilding extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, selectedCompany, buildingOptions } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="CLEANING_BUILDING" />

          <Cleaning buildingOptions={buildingOptions} prefix="cleaningBuilding" resource={resource} />
        </Form>
      </Grid>
    )
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ cleaningBuilding: props.cleaningBuilding }),

        handleSubmit: async (values, actions) => {
          try {
            await actions.props.onChangeAndSave(values.cleaningBuilding)

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
