import { createStyles, Paper, Theme, WithStyles, withStyles, Grid } from '@material-ui/core'
import * as React from 'react'
import IntlTypography from './../Intl/IntlTypography';
import { OnChangeEvent } from '../../interfaces/OnChangeEvent';
// import { Link } from 'react-router-dom';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      textAlign: "center",
    },
    checked: {
      backgroundColor: theme.palette.primary.light,
      "& h5": {
        color: theme.palette.primary.contrastText,
      }
    }
  })


interface Props extends WithStyles<typeof styles> {
  onChange: (value: any, name: string) => void
  name: string
  value: boolean
}

class BigCheckbox extends React.Component<Props> {
  public render() {
    const { classes, children, onChange, name, value } = this.props

    return (
      <Grid item xs={12} sm={6}>
        <Paper elevation={1} className={classes.root + " " + (value ? classes.checked : "")} onClick={e => { onChange(!value, name)}}>
          <IntlTypography variant="h5">{children}</IntlTypography>
        </Paper>
      </Grid>
    )
  }
}

export default withStyles(styles)(BigCheckbox)
