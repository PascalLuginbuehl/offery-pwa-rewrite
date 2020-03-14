
import * as React from "react"
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from "@material-ui/core/TextField"
import { FieldProps, getIn } from "formik"
import { injectIntl, WrappedComponentProps } from "react-intl"
import Grid, { GridSize } from "@material-ui/core/Grid"
import { InputAdornment, createStyles, Theme, withStyles, ButtonBase, Paper } from "@material-ui/core"
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints"
import { WithStyles } from "@material-ui/styles"
import IntlTypography from "../Intl/IntlTypography"
import MuiSwitch, {
  SwitchProps as MuiSwitchProps,
} from "@material-ui/core/Switch"
import DoneOutlineIcon from "@material-ui/icons/DoneOutline"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      textAlign: "center",
    },
    checked: {
      backgroundColor: theme.palette.primary.light,
      "& h5": {
        color: theme.palette.primary.contrastText,
      }
    },
    fullButton: {
      width: "100%"
    },
    fullPaper: {
      width: "100%",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  })

export interface FormikButtonCheckboxProps extends WrappedComponentProps, FieldProps, Omit<MuiSwitchProps, "error" | "name" | "onChange" | "value" | "classes" | "form" | "defaultChecked">, WithStyles<typeof styles> {
  label: string
  disableGrid?: boolean
  overrideGrid?: Partial<Record<Breakpoint, boolean | GridSize>>
}


class FormikButtonCheckbox extends React.Component<FormikButtonCheckboxProps> {
  onChange = (event: React.MouseEvent<{}>) => {
    const value = this.props.field.value
    if (typeof value === "boolean") {
      this.props.form.setFieldValue(this.props.field.name, !value)
    }
  }

  render() {
    const { children, intl, field,
      form,
      disabled,

      label,
      disableGrid = false,
      overrideGrid = {},
      classes,
      field: { value },
      ...props
    } = this.props


    const { name } = field
    const { touched, errors, isSubmitting } = form

    const fieldError = getIn(errors, name)

    const ButtonCheckbox = (
      <ButtonBase className={classes.fullButton} disabled={disabled != undefined ? disabled : isSubmitting} onClick={this.onChange}>
        <Paper elevation={1} className={classes.fullPaper + " " + classes.root + " " + (value ? classes.checked : "")}>
          {
            value ?
              <DoneOutlineIcon />
              :
              <HighlightOffIcon />
          }
          <IntlTypography noWrap>{label}</IntlTypography>
        </Paper>
      </ButtonBase>
    )

    if (disableGrid) {
      return ButtonCheckbox
    } else {
      const defaultGrid: FormikButtonCheckboxProps["overrideGrid"] = { xs: 6, sm: 4, md: 3, lg: 3 }
      // SetDefaultValues
      const newGrid = { ...defaultGrid, ...overrideGrid }
      return (
        <Grid item xs={newGrid.xs} sm={newGrid.sm} md={newGrid.md} lg={newGrid.lg}>
          {ButtonCheckbox}
        </Grid>
      )

    }


  }
}


export default withStyles(styles)(injectIntl(FormikButtonCheckbox))
