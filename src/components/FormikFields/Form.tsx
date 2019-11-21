import * as React from 'react'
import { Form as FormikForm, FormikFormProps } from 'formik';
import Grid from '@material-ui/core/Grid';
import withWidth, { WithWidthProps } from '@material-ui/core/withWidth';
import { withStyles, createStyles, WithStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: 8,
      // [theme.breakpoints.down('xs')]: {
      //   padding: 4,
      // }
    }
  })

interface Props extends FormikFormProps, WithWidthProps, WithStyles<typeof styles> {

}

class Form extends React.Component<Props> {
  public render() {
    const { classes } = this.props

    return (
      <FormikForm>
        <Grid container spacing={this.props.width == 'xs' ? 1 : 2} className={classes.root}>
          {this.props.children}
        </Grid>
      </FormikForm>
    )
  }
}

export default withStyles(styles)(withWidth()(Form))
