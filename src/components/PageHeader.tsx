import * as React from 'react'
import { Form as FormikForm, FormikFormProps } from 'formik';
import Grid from '@material-ui/core/Grid';
import withWidth, { WithWidthProps } from '@material-ui/core/withWidth';
import IntlTypography from './Intl/IntlTypography';


interface Props extends WithWidthProps {
  title: string,
  subtitle?: string,
}

class PageHeader extends React.Component<Props> {
  public render() {
    if(this.props.width !== 'xs') {
      return (
        <Grid item xs={12}>
          <IntlTypography variant="h5">{this.props.title}</IntlTypography>
        </Grid>
      )
    }

    return null
  }
}

export default withWidth()(PageHeader)
