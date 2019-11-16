import * as React from 'react'
import { Form as FormikForm, FormikFormProps } from 'formik';
import Grid from '@material-ui/core/Grid';
import withWidth, { WithWidthProps } from '@material-ui/core/withWidth';


interface Props extends FormikFormProps, WithWidthProps {

}

class Form extends React.Component<Props> {
  public render() {

    return (
      <FormikForm>
        <Grid container spacing={this.props.width == 'xs' ? 1 : 2}>
          {this.props.children}
        </Grid>
      </FormikForm>
    )
  }
}

export default withWidth()(Form)
