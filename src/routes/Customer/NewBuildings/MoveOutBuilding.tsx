import * as React from 'react'
import * as Yup from 'yup'
import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, TextField as MuiTextField, Divider, Typography } from '@material-ui/core'
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps, FieldArray } from 'formik';

import { injectIntl, InjectedIntlProps } from 'react-intl';


import MoveOut from '../../../components/FormikFields/Bundled/MoveOut';
import { IMoveOutBuilding, IPostMoveOutBuilding } from '../../../interfaces/IBuilding';
import Form from '../../../components/FormikFields/Form';
import { withResource, WithResourceProps } from '../../../providers/withResource';
import Submit from '../../../components/FormikFields/Submit';
import PageHeader from '../../../components/PageHeader';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values {
  moveOutBuilding: IPostMoveOutBuilding
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (moveOutBuilding: IPostMoveOutBuilding) => void
  moveOutBuilding: IPostMoveOutBuilding
}

class CleaningConditions extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      status,
      intl,
      resource,
      setFieldValue,
      selectedCompany,
    } = this.props

    console.log(selectedCompany.CarTypes)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MOVE_OUT_BUILDING" />

          <MoveOut prefix="moveOutBuilding" resource={resource} />
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
        validationSchema: Yup.object().shape({
          // email: Yup.string()
          //   .email()
          //   .required(),
        }),

        mapPropsToValues: props => ({ moveOutBuilding: props.moveOutBuilding }),

        handleSubmit: async (values, actions) => {
          console.log(values)
          // actions.props.
          await actions.props.onChangeAndSave(values.moveOutBuilding)

          actions.setSubmitting(false)
          // actions.props.nextPage()
        }

      })(CleaningConditions)
    )
  )
)
