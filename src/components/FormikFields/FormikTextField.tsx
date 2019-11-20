import * as React from 'react';
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core/TextField';
import { FieldProps, getIn } from 'formik';
import { injectIntl, InjectedIntlProps, InjectedIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';

export type TextFieldProps = FieldProps &
  Omit<MuiTextFieldProps, 'error' | 'name' | 'onChange' | 'value'>;

export const fieldToTextField = ({
  field,
  form,
  variant = 'standard',
  disabled,
  label,
  ...props
}: TextFieldProps, intl: InjectedIntl): MuiTextFieldProps => {
  const { name } = field;
  const { touched, errors, isSubmitting } = form;

  const fieldError = getIn(errors, name);
  const showError = getIn(touched, name) && !!fieldError;

  return {
    ...props,
    ...field,
    variant,
    error: showError,
    helperText: showError ? fieldError : props.helperText,
    // helperText = intl.formatMessage({ id: errorMessage }, messageValues)

    disabled: disabled != undefined ? disabled : isSubmitting,

    // translations
    // @ts-ignore
    label: intl.formatMessage({ id: label}),
  };
};

const TextField: React.ComponentType<TextFieldProps> = injectIntl(({
  children,
  intl,
  ...props
}: TextFieldProps & InjectedIntlProps) => (
    <Grid item xs={12} md={6}>
      <MuiTextField fullWidth {...fieldToTextField(props, intl)}>{children}</MuiTextField>
    </Grid>
))

TextField.displayName = 'FormikMaterialUITextField';

export default TextField
