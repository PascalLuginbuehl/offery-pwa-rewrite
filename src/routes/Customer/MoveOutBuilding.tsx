import * as React from "react"
import { createStyles, Tabs, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import { FormikProps, withFormik } from "formik"
import { injectIntl, InjectedIntlProps } from "react-intl"
import MoveOut from "../../components/FormikFields/Bundled/MoveOut"
import { IMoveOutBuilding, IPostMoveOutBuilding } from "../../interfaces/IBuilding"
import Form from "../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../providers/withResource"
import Submit from "../../components/FormikFields/Submit"
import PageHeader from "../../components/PageHeader"
import { IBuildingCopy } from "../../components/FormikFields/Bundled/BuildingCopy"
import HttpErrorHandler from "../../components/HttpErrorHandler"

const styles = (theme: Theme) => createStyles({})

interface Values {
  moveOutBuilding: IPostMoveOutBuilding
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (moveOutBuilding: IPostMoveOutBuilding) => Promise<void>
  moveOutBuilding: IPostMoveOutBuilding
  buildingOptions: IBuildingCopy
}

class CleaningConditions extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, selectedCompany, buildingOptions, values } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MOVE_OUT_BUILDING" />

          <MoveOut buildingOptions={buildingOptions} prefix="moveOutBuilding" resource={resource} />
        </Form>
      </Grid>
    )
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ moveOutBuilding: props.moveOutBuilding }),

        handleSubmit: async (values, actions) => {
          try {
            await actions.props.onChangeAndSave(values.moveOutBuilding)

            actions.setSubmitting(false)

            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(CleaningConditions)
    )
  )
)
