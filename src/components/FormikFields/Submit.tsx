import * as React from 'react'
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl'
import { Button, Grid } from '@material-ui/core'
import { createStyles, Theme, WithStyles, withStyles, Fab, CircularProgress } from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import withWidth, { WithWidth, isWidthUp } from '@material-ui/core/withWidth';

const styles = (theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(3),
    },
    rightAlign: {
      margin: theme.spacing(2),
      width: "100%",
      textAlign: "right",
    },
    submitPadding: {
      height: 56 + 16
    }
  })

interface Props extends WithStyles<typeof styles>, InjectedIntlProps, WithWidth {
  label?: string
  isSubmitting: boolean
}

class Submit extends React.Component<Props> {
  public render() {
    const { classes, width, label = "NEXT", isSubmitting } = this.props

    if (isWidthUp('sm', width)) {
      return (
        <Grid item xs={12} className={classes.rightAlign}>
          <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
            <FormattedMessage id={label} />
          </Button>
        </Grid>
      )
    } else {
      return (
        <Grid item xs={12} className={classes.submitPadding}>
          <Fab className={classes.fab} color="primary" type="submit" disabled={isSubmitting}>
            <ChevronRightIcon />
          </Fab>
        </Grid>
      )
    }
  }
}

export default injectIntl(withWidth()(withStyles(styles)(Submit)))
