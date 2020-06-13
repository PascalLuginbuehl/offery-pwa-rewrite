import * as React from "react"
import MuiSwitch, {
  SwitchProps as MuiSwitchProps,
} from "@material-ui/core/Switch"
import { FieldProps } from "formik"
import { injectIntl, WrappedComponentProps } from "react-intl"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Grid from "@material-ui/core/Grid"

export interface SwitchProps
  extends FieldProps,
    Omit<
      MuiSwitchProps,
      "form" | "name" | "onChange" | "value" | "defaultChecked"
    > {}

export const fieldToSwitch = ({
  field,
  form: { isSubmitting },
  disabled,
  ...props
}: SwitchProps): MuiSwitchProps => {

  return {
    disabled: disabled != undefined ? disabled : isSubmitting,
    ...props,
    ...field,
    value: field.name,
    checked: field.value,
    // Ugly fix for event checked
    onChange: event => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //@ts-ignore
      event.target.value = event.target.checked
      field.onChange(event)
    },
  }
}

// @ts-ignore
const Switch: React.ComponentType<SwitchProps & {label: string}> = injectIntl((
  {
    intl,
    label,
    ...props
  }: SwitchProps & WrappedComponentProps & {label: string}
) =>
  <Grid item xs={6} sm={4} md={3} >
    <FormControlLabel
      control={
        <MuiSwitch {...fieldToSwitch(props)} />
      }
      label={intl.formatMessage({ id: label })}
    />
  </Grid>
)

Switch.displayName = "FormikMaterialUISwitch"

export default Switch
