import * as React from "react"
import { injectIntl } from "react-intl"
import { InputAdornment, Theme } from "@material-ui/core"
import FormikTextField, { FormikTextFieldProps } from "../FormikTextField"
import { withStyles, WithStyles, createStyles } from "@material-ui/styles"
import { InputProps } from "@material-ui/core/Input"

type newProps = Omit<FormikTextFieldProps, "type" | "InputProps"> & { adornmentText: string; position?: "start" | "end" } &  WithStyles<typeof styles>

const styles = (theme: Theme) =>
  createStyles({
    input: {
      "textAlign": "right"
    },
  })

function createAdornment(position: "start" | "end", adornmentText: string): Partial<InputProps> {
  if (position === "start") {
    return {
      startAdornment: (
        <InputAdornment position="start">
          {adornmentText}
        </InputAdornment>
      )
    }
  } else {
    // if (position === "end")
    return {
      endAdornment: (
        <InputAdornment position="end">
          {adornmentText}
        </InputAdornment>
      )
    }
  }

}

const FormikNumberAdornmentText: React.ComponentType<newProps> = ({ adornmentText, overrideGrid = { xs: 6, md: 3 }, classes, position="end", ...props}) => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //@ts-ignore
  <FormikTextField
    InputProps={{
      ...createAdornment(position, adornmentText),
      classes: {
        input: classes.input
      }
    }}
    inputProps={{
      step: 1,
      min: 0,
    }}
    type="number"
    overrideGrid={overrideGrid}
    style={{textAlign: "right"}}

    {...props}
  />
)


export default withStyles(styles)(injectIntl(FormikNumberAdornmentText))
