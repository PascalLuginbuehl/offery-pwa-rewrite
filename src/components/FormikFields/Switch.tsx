import * as React from 'react';
import MuiSwitch, {
  SwitchProps as MuiSwitchProps,
} from '@material-ui/core/Switch';
import { FieldProps } from 'formik';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

export interface SwitchProps
  extends FieldProps,
    Omit<
      MuiSwitchProps,
      'form' | 'name' | 'onChange' | 'value' | 'defaultChecked'
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
  };
};

const Switch: React.ComponentType<SwitchProps & {label: string}> = injectIntl((
  {
    intl,
    label,
    ...props
  }: SwitchProps & InjectedIntlProps & {label: string}
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

Switch.displayName = 'FormikMaterialUISwitch';

export default Switch
