import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import * as React from 'react'
import { LinkProps, Link } from 'react-router-dom';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textDecoration: "none",
      color: "inherit",
    },
  })


interface Props extends LinkProps, WithStyles<typeof styles> {}

class Section extends React.Component<Props> {

  public render() {
    const { classes, className, ...props } = this.props

    return (
      <Link className={classes.root + " " + className} {...props} />
    )
  }
}

export default withStyles(styles)(Section)
