import React from "react"
import { Container as MuiContainer, ContainerProps as MuiContainerProps, makeStyles, Paper, Theme } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  }
}))

type ContainerProps = MuiContainerProps

export default function Container(props: ContainerProps) {
  const classes = useStyles()

  return  (
    <MuiContainer component={Paper} {...props} className={classes.root} />
  )
}
