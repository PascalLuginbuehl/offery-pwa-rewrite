import React from "react"
import { createStyles, makeStyles, Theme, useMediaQuery } from "@material-ui/core"
import { useTheme } from "@material-ui/styles";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    submitPadding: {
      height: 56 + 16
    }
  })
)

/**
 * Be careful using this hook. It only works because the number of
 * breakpoints in theme is static. It will break once you change the number of
 * breakpoints. See https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
 */

type BreakpointOrNull = Breakpoint | null
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

export default function SubmitPadding() {
  const classes = useStyles()
  const width = useWidth()

  return <div className={width == "xs" ? classes.submitPadding : ""} />
}
