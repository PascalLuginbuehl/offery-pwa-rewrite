import { createStyles,  Theme, WithStyles, withStyles } from "@material-ui/core"
import Loading from "../Loading"
import ResponsiveContainer from "../ResponsiveContainer"
import * as React from "react"

const styles = (theme: Theme) =>
  createStyles({

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
          {children}
        </Loading>
      </ResponsiveContainer>
    )
  }
}

export default withStyles(styles)(Lead)
