import { createStyles, Grid, Theme, WithStyles, withStyles } from '@material-ui/core'
import Loading from '../Loading'
import ResponsiveContainer from '../ResponsiveContainer'
import * as React from 'react'
import Validator from '../Validator';
// import { Form } from '';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2)
    }
  })

interface Props extends WithStyles<typeof styles> {
  initialLoading: Promise<any> | null
}

class Lead extends React.Component<Props> {
  public render() {
    const { classes, children, initialLoading } = this.props

    return (
      <ResponsiveContainer>
        <Loading await={initialLoading} size={50}>
          <Validator>
            {/* Was 16 */}
            <Grid container spacing={2} className={classes.root}>
              {children}
            </Grid>
          </Validator>
        </Loading>
      </ResponsiveContainer>
    )
  }
}

export default withStyles(styles)(Lead)
