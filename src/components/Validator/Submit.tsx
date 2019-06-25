import * as React from 'react'
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl'
import { WithFormContext, withValidator } from '.'
import { Button, Grid } from '@material-ui/core'
import Loading from '../Loading'
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
    }
  })

interface State {
  saveAwait: Promise<any> | null
}

interface Props extends WithStyles<typeof styles>, InjectedIntlProps, WithFormContext, WithWidth {
  onSubmit: () => Promise<any>
  label?: string
}

class Submit extends React.Component<Props, State> {
  state: State = {
    saveAwait: null
  }

  handleSubmit = () => {
    const { isValid } = this.props
    const { onSubmit } = this.props

    console.log(isValid())
    if (isValid()) {
      this.setState({ saveAwait: onSubmit() })
    }
  }

  public render() {
    const { classes, width, label = "NEXT" } = this.props
    const { saveAwait } = this.state

    if (isWidthUp('sm', width)) {
      return (
        <Grid item xs={12} className={classes.rightAlign}>
          <Loading await={saveAwait} disableCenter>
            <Button variant="contained" color="primary" type="submit" onClick={this.handleSubmit}>
              <FormattedMessage id={label} />
            </Button>
            </Loading>
        </Grid>
      )
    } else {
      return (
        <Fab className={classes.fab} color="primary" type="submit" onClick={this.handleSubmit}>
          <Loading await={saveAwait} disableCenter>
            <ChevronRightIcon />
          </Loading>
        </Fab>
      )
    }
  }
}

export default withValidator(injectIntl(withWidth()(withStyles(styles)(Submit))))
