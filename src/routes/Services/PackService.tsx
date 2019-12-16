import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../providers/withResource"
import { IPostMoveOutBuilding } from "../../interfaces/IBuilding"
import { FormikProps, Field, withFormik } from "formik"
import Form from "../../components/FormikFields/Form"
import Submit from "../../components/FormikFields/Submit"
import { IPutPackService } from "../../interfaces/IService"
import MoveOut from "../../components/FormikFields/Bundled/MoveOut"
import PageHeader from "../../components/PageHeader"
import FormikButtonCheckbox from "../../components/FormikFields/FormikButtonCheckbox"
import FormikDivider from "../../components/FormikFields/FormikDivider"
import FormikDateTimePicker from "../../components/FormikFields/FormikDateTimePicker"
import IntlTypography from "../../components/Intl/IntlTypography"
import FormikGroups from "../../components/FormikFields/Bundled/Groups"
import { IBuildingCopy } from "../../components/FormikFields/Bundled/BuildingCopy"
import { handleChangeFunction } from "../../components/Validator/HandleChangeFunction"
import HttpErrorHandler from "../../components/HttpErrorHandler"

const styles = (theme: Theme) => createStyles({})

interface Values {
  packService: IPutPackService
  moveOut: IPostMoveOutBuilding
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (packService: IPutPackService, moveOut: IPostMoveOutBuilding) => Promise<any>
  buildingOptions: IBuildingCopy
}

class PackService extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, buildingOptions, values } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="PACK_SERVICE" />

          <Field name="packService.HasOutService" label="WITH_UNPACK" component={FormikButtonCheckbox} />

          <FormikGroups label="APPOINTMENTS" xs={12}>
            <Field name="packService.PackServiceDate" label="PACK_DATE" component={FormikDateTimePicker} />
          </FormikGroups>

          <FormikDivider />

          <Grid item xs={12}>
            <IntlTypography variant="h6">MOVE_OUT_BUILDING</IntlTypography>
          </Grid>

          <MoveOut buildingOptions={buildingOptions} prefix={"moveOut"} resource={resource} />
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ packService: props.packService, moveOut: props.moveOut }),

      handleSubmit: async (values, actions) => {
        try {
          await actions.props.onChangeAndSave(values.packService, values.moveOut)

          actions.setSubmitting(false)

          actions.resetForm()
          actions.props.nextPage()
        } catch (e) {
          actions.setStatus(e)
        }
      },
    })(PackService)
  )
)
