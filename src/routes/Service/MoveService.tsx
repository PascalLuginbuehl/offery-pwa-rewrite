import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button } from '@material-ui/core'
import ResponsiveContainer from '../../components/ResponsiveContainer'
// import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import CounterTable, { Cart } from '../../components/ShopElements/CounterTable'
import GridSelect, { GridSelectItem } from '../../components/ShopElements/GridSelect'
import * as React from 'react'
import BigCheckbox from '../../components/Validator/BigCheckbox';
import { withResource, WithResourceProps } from '../../providers/withResource';
import { IPostMoveInBuilding } from '../../interfaces/IBuilding';
import IntlTypography from '../../components/Intl/IntlTypography';
import { IPostMoveService } from '../../interfaces/IService';
import ValidatedDatePicker from '../../components/Validator/ValidatedDatePicker';
// import TestService from 'services/TestService'
import { Formik, FormikActions, FormikProps, Field, FieldProps, ErrorMessage } from 'formik';
import TextField from '../../components/FormikFields/TextField';
import Switch from '../../components/FormikFields/Switch';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/DatePicker';


const styles = (theme: Theme) =>
  createStyles({

  })

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  // onChange: (data: IPostMoveService) => void
  // data: IPostMoveService
  save: () => Promise<void>
}

class Index extends React.Component<Props, {}> {
  public render() {
    // const { BoreService, DeMontageService, FurnitureLiftService, LampDemontageService, MontageService, MoveDate, PianoService } = this.props.data

    return (
      <Grid item xs={12}>
        <Formik
          initialValues={{ email: "", BoreService: false, number: 0}}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email()
              .required(),
            })
          }
          onSubmit={(values, actions) => {
            const promise = this.props.save()
            console.log(values)
            // MyImaginaryRestApiCall(user.id, values).then(
            //   updatedUser => {
            //     actions.setSubmitting(false);
            //     updateUser(updatedUser);
            //     onClose();
            //   },
            //   error => {
                actions.setSubmitting(false);
                // actions.setErrors({});
                actions.setStatus({ msg: 'Set some arbitrary status or data' });
            //   }
            // );
          }}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <Grid item xs={12}>
                <IntlTypography variant="h5">SERVICES</IntlTypography>
              </Grid>


              <Field name="BoreService" label="BORE_SERVICE" component={Switch} />

              <Field name="DeMontageService" label="DE_MONTAGE_SERVICE" component={Switch} />

              <Field name="FurnitureLiftService" label="FURNITURE_LIFT_SERVICE" component={Switch} />

              <Field name="LampDemontageService" label="LAMP_DEMONTAGE_SERVICE" component={Switch} />

              <Field name="MontageService" label="MONTAGE_SERVICE" component={Switch} />

              <Field name="PianoService" label="PIANO_SERVICE" component={Switch} />

              <Field name="MoveDate" label="MOVE_DATE" component={DatePicker} />


              {status && status.msg && <div>{status.msg}</div>}

              <Submit isSubmitting={isSubmitting}></Submit>
            </Form>
            )}
          />
        </Grid>
    )
  }
}

export default withStyles(styles)(withResource(Index))
