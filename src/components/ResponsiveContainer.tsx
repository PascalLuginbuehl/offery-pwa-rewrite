import { createStyles, Paper, Theme, WithStyles, withStyles } from "@material-ui/core"
import * as React from "react"

const styles = (theme: Theme) =>
  createStyles({
    root: {
      // width: "auto",
      height: "100%",
      position: "relative",
      width: "100%",
      // marginLeft: theme.spacing.unit * 3,
      // marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(1100 + theme.spacing(3 * 2))]: {
        maxWidth: 1100,
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
    // root: {
    //   justifyContent: "center",
    //   minHeight: 'calc(100vh - 56px)',
    //   width: '100%',
    // },

    content: {
      // Fix for default
      paddingTop: theme.spacing(1),
      height: "100%",
      boxSizing: "border-box",
      // padding: 10,
    },
  })


interface State {

}

interface Props extends WithStyles<typeof styles> {

}

class ResponsiveContainer extends React.Component<Props, State> {

  public render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Paper elevation={1} square className={classes.content}>
          {this.props.children}
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(ResponsiveContainer)
