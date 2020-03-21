import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import {  FormikProps, withFormik } from "formik"
import { injectIntl, WrappedComponentProps } from "react-intl"
import { IPostBuilding } from "../../../interfaces/IBuilding"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../../providers/withResource"

import PageHeader from "../../../components/PageHeader"
import { RouteComponentProps } from "react-router"
import BuildingEdit from "../../../components/FormikFields/Bundled/BuildingEdit"

const styles = (theme: Theme) => createStyles({})

interface Values {
  building: IPostBuilding
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps, RouteComponentProps {
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

          <BuildingEdit prefix="building" resource={resource} buildingSetting={selectedCompany.Settings.DefaultBuildingSetting}/>
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
