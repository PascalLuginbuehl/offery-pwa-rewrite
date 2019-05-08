import { createStyles, Theme, WithStyles, withStyles, CircularProgress } from '@material-ui/core'
import * as React from 'react'

const styles = (theme: Theme) =>
  createStyles({
    progress: {
      position: "absolute",
      left: "calc(50% - 20px)",
      top: "calc(50% - 20px)",
      // position: 'fixed',
      // bottom: theme.spacing.unit * 2,
      // right: theme.spacing.unit * 3,
    },
  })

interface State {
  complete: boolean
}

interface Props extends WithStyles<typeof styles> {
  await: Promise<any> | null
  children: any
  size?: number
  disableCenter?: boolean
}

class Loading extends React.Component<Props, State> {
  mounted: boolean = false
  state: State = {
    complete: false
  }

  componentDidMount() {
    this.mounted = true


    const { await: awaitPromise } = this.props

    if (awaitPromise === null) {
      this.state.complete = true
    }

    this.awaitPromise(this.props)
  }


  componentDidUpdate(prevProps: Props, prevState: State) {
    // const { value } = this.props
    if (this.props.await !== prevProps.await) {
      // this.validateDebounced(this.props.value, this.props.withRequiredValidator);
      this.awaitPromise(this.props)
    }
  }

  awaitPromise(props: Props) {
    const { await: awaitPromise } = props

    if (awaitPromise === null) {
      return this.setState({ complete: true })
    }
    if (!awaitPromise) {
      return
    }

    this.setState({ complete: false })
    awaitPromise.then(() => {
      if (this.mounted) {
        this.setState({ complete: true })
      }
    }).catch(() => {
      if (this.mounted) {
        this.setState({ complete: true })
      }
    })
  }

  componentWillUnmount() {
    this.mounted = false
  }

  public render() {
    const { classes, children, size, disableCenter } = this.props
    const { complete } = this.state

    if (complete) {
      return (
        <>
          {children}
        </>
      )
    } else {
      let style
      if (size) {
        style = { left: "calc(50% - " + size / 2 + "px)", top: "calc(50% - " + size / 2 + "px)" }
      }
      return (
        <CircularProgress className={disableCenter ? "" : classes.progress} size={size ? size : 40} style={style} />
      )
    }
  }
}

export default withStyles(styles)(Loading)
