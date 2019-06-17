import { createStyles, Grid, Paper, Theme, Typography, WithStyles, withStyles } from '@material-ui/core'
import * as React from 'react'

const styles = (theme: Theme) =>
  createStyles({
    select: {
      padding: theme.spacing(2),
      textAlign: "center",
    },
  })

interface State {

}

interface Props extends WithStyles<typeof styles> {
  value: string
  onClick(): void
}

class CheckGrid extends React.Component<Props, State> {
  public render() {
    const { classes, value, onClick } = this.props

    return (
      <Grid item xs={4} sm={3} md={2} lg={2}>
        <Paper className={classes.select} elevation={1} onClick={onClick}>
          <Typography>{value}</Typography>
        </Paper>
      </Grid>
    )
  }
}

export default withStyles(styles)(CheckGrid)
