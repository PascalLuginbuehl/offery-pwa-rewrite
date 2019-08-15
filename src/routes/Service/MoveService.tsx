import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid } from '@material-ui/core'
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
import { Formik, FormikActions, FormikProps, Form, Field, FieldProps, ErrorMessage } from 'formik';
import TextField from '../../components/FormikFields/TextField';
import Switch from '../../components/FormikFields/Switch';


const styles = (theme: Theme) =>
  createStyles({

  })

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  // onChange: (data: IPostMoveService) => void
  // data: IPostMoveService
  save: () => Promise<void>
}

class Index extends React.Component<Props, {}> {

  private handleChange = (value: string, target: string) => {
    // this.props.onChange(Object.assign({}, this.props.data, { [target]: value }))
  }

  public render() {
    // const { BoreService, DeMontageService, FurnitureLiftService, LampDemontageService, MontageService, MoveDate, PianoService } = this.props.data

    return (
      <>
        <Grid item xs={12}>
          <IntlTypography variant="h5">SERVICES</IntlTypography>
        </Grid>

        <Grid item xs={12}>
          <Formik
            initialValues={ {email: "", BoreService: false} }
            onSubmit={(values, actions) => {

              // MyImaginaryRestApiCall(user.id, values).then(
              //   updatedUser => {
              //     actions.setSubmitting(false);
              //     updateUser(updatedUser);
              //     onClose();
              //   },
              //   error => {
              //     actions.setSubmitting(false);
              //     actions.setErrors(transformMyRestApiErrorsToAnObject(error));
              //     actions.setStatus({ msg: 'Set some arbitrary status or data' });
              //   }
              // );
            }}
            render={({ errors, status, touched, isSubmitting }) => (
              <Form>
                <Field name="email" label="EMAIL" component={TextField} fullWidth />

                <Field name="BoreService" label="DISPOSAL_BUILDING" component={Switch} fullWidth />

                <ErrorMessage name="email" component="div" />

                <Field type="text" className="error" name="social.facebook" />

                <ErrorMessage name="social.facebook">
                  {errorMessage => <div className="error">{errorMessage}</div>}
                </ErrorMessage>
                <Field type="text" name="social.twitter" />
                <ErrorMessage name="social.twitter" className="error" component="div" />
                {status && status.msg && <div>{status.msg}</div>}
                <button type="submit" disabled={isSubmitting}>
                  Submit
              </button>
              </Form>
              )}
            />
          </Grid>

{/*

        <BigCheckbox name="DeMontageService" value={DeMontageService} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox>


        <BigCheckbox name="FurnitureLiftService" value={FurnitureLiftService} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox>

        <BigCheckbox name="LampDemontageService" value={LampDemontageService} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox>

        <BigCheckbox name="MontageService" value={MontageService} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox>

        <BigCheckbox name="PianoService" value={PianoService} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox>

        <ValidatedDatePicker name="MoveDate" value={MoveDate} onChange={this.handleChange} label="" /> */}
      </>
    )
  }
}

export default withStyles(styles)(withResource(Index))
