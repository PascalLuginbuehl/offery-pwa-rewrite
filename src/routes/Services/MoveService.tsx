import { createStyles, Theme, WithStyles, withStyles, Grid } from '@material-ui/core'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { IPostMoveInBuilding, IPostMoveOutBuilding } from '../../interfaces/IBuilding';
import { FormikProps, Field, withFormik } from 'formik';
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';
import PageHeader from '../../components/PageHeader';
import FormikButtonCheckbox from '../../components/FormikFields/FormikButtonCheckbox';
import FormikDivider from '../../components/FormikFields/FormikDivider';
import IntlTypography from '../../components/Intl/IntlTypography';
import MoveIn from '../../components/FormikFields/Bundled/MoveIn';
import FormikDateTimePicker from '../../components/FormikFields/FormikDateTimePicker';
import { IPutMoveService } from '../../interfaces/IService';
import FormikGroups from '../../components/FormikFields/Bundled/Groups';
import { IBuildingCopy } from '../../components/FormikFields/Bundled/BuildingCopy';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values {
  moveService: IPutMoveService
  moveIn: IPostMoveInBuilding
  moveOut: IPostMoveOutBuilding
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, Values {
  nextPage: () => void
  onChangeAndSave: (moveService: IPutMoveService, moveIn: IPostMoveInBuilding | null, moveOut: IPostMoveOutBuilding | null) => void
  buildingOptions: IBuildingCopy
}

class Index extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const {
      isSubmitting,
      status,
      resource,
      buildingOptions,
    } = this.props

    // const { data } = this.props

    console.log(this.props)
    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MOVE_SERVICE" />

          <Field name="moveService.BoreService" label="BORE_SERVICE" component={FormikButtonCheckbox} />

          <Field name="moveService.LampDemontageService" label="LAMP_DEMONTAGE_SERVICE" component={FormikButtonCheckbox} />

          <Field name="moveService.FurnitureLiftService" label="FURNITURE_LIFT_SERVICE" component={FormikButtonCheckbox} />

          <Field name="moveService.PianoService" label="PIANO_SERVICE" component={FormikButtonCheckbox} />

          <Field name="moveService.MontageService" label="MONTAGE_SERVICE" component={FormikButtonCheckbox} />

          <Field name="moveService.DeMontageService" label="DE_MONTAGE_SERVICE" component={FormikButtonCheckbox} />

          <FormikGroups label="APPOINTMENTS" xs={12}>
            <Field name="moveService.MoveDate" label="MOVE_DATE" component={FormikDateTimePicker} />
          </FormikGroups>

          <FormikDivider />
          <Grid item xs={12}>
            <IntlTypography variant="h6">MOVE_OUT_BUILDING</IntlTypography>
          </Grid>

          <MoveOut buildingOptions={buildingOptions}  prefix={"moveOut"} resource={resource} />

          <Grid item xs={12}>
            <IntlTypography variant="h6">MOVE_IN_BUILDING</IntlTypography>
          </Grid>
          <MoveIn buildingOptions={buildingOptions}  prefix={"moveIn"} resource={resource} />

          {status && status.msg && <div>{status.msg}</div>}

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ moveIn: props.moveIn, moveOut: props.moveOut, moveService: props.moveService}),

      handleSubmit: async (values, actions) => {
        await actions.props.onChangeAndSave(values.moveService, values.moveIn, values.moveOut)

        actions.setSubmitting(false)

        actions.resetForm()
        actions.props.nextPage()
      }

    })(Index)
  )
)
