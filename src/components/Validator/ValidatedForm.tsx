
import { createStyles, Grid, Theme, WithStyles, withStyles } from '@material-ui/core'
import Loading from '../Loading'
import ResponsiveContainer from '../ResponsiveContainer'
import * as React from 'react'
import Validator from '../Validator';
// import { Form } from '';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: 8,
      [theme.breakpoints.down('xs')]: {
        padding: 4,
      }
    }
  })

interface Props extends WithStyles<typeof styles> {

}

class ValidatedForm extends React.Component<Props> {
  public render() {
    const { classes, children } = this.props

    return (
      <Validator>
        {/* Was 16 */}
        <Grid container spacing={2} className={classes.root}>
          {children}
        </Grid>
      </Validator>
    )
  }
}

export default withStyles(styles)(ValidatedForm)
