import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography } from "@material-ui/core"
import { Formik, FormikProps, withFormik } from "formik"
import { injectIntl, InjectedIntlProps } from "react-intl"
import MoveOut from "../../../components/FormikFields/Bundled/MoveOut"
import { IPostMoveInBuilding } from "../../../interfaces/IBuilding"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import Submit from "../../../components/FormikFields/Submit"
import PageHeader from "../../../components/PageHeader"
import MoveIn from "../../../components/FormikFields/Bundled/MoveIn"
import { IBuildingCopy } from "../../../components/FormikFields/Bundled/BuildingCopy"
import HttpErrorHandler from "../../../components/HttpErrorHandler"

const styles = (theme: Theme) => createStyles({})

interface Values {
  moveInBuilding: IPostMoveInBuilding
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (moveInBuilding: IPostMoveInBuilding) => Promise<void>
  moveInBuilding: IPostMoveInBuilding
  buildingOptions: IBuildingCopy
}

class MoveInBuilding extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, selectedCompany, buildingOptions, values } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MOVE_IN_BUILDING" />
          <MoveIn buildingOptions={buildingOptions} prefix="moveInBuilding" resource={resource} />{" "}
        </Form>
      </Grid>
    )
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ moveInBuilding: props.moveInBuilding }),

        handleSubmit: async (values, actions) => {
          try {
            await actions.props.onChangeAndSave(values.moveInBuilding)

            actions.setSubmitting(false)

            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(MoveInBuilding)
    )
  )
)