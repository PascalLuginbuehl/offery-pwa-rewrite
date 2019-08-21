import * as React from 'react'
import { Form as FormikForm, FormikFormProps } from 'formik';
import Grid from '@material-ui/core/Grid';


interface Props extends FormikFormProps {

}

class Form extends React.Component<Props, {}> {
  public render() {

    return (
      <FormikForm>
        <Grid container spacing={2}>
          {this.props.children}
        </Grid>
      </FormikForm>
    )
  }
}

export default Form
