import React from "react"
import { makeStyles, createStyles, Theme, useTheme, useMediaQuery, Grid } from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 8,
      // [theme.breakpoints.down('xs')]: {
      //   padding: 4,
      // }
    },
  })
)


/**
 * Be careful using this hook. It only works because the number of
 * breakpoints in theme is static. It will break once you change the number of
 * breakpoints. See https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
 */

type BreakpointOrNull = Breakpoint | null;
function useWidth() {
  const theme: Theme = useTheme()
  const keys: Breakpoint[] = [...theme.breakpoints.keys].reverse()
  return (
    keys.reduce((output: BreakpointOrNull, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key))
      return !output && matches ? key : output
    }, null) || "xs"
  )
}


export default function GridContainer(props: {children: React.ReactNode}) {
  const { children } = props

  const width = useWidth()
  const classes = useStyles()

  return (
    <Grid container spacing={width == "xs" ? 1 : 2} className={classes.root}>
      {children}
    </Grid>
  )
}
