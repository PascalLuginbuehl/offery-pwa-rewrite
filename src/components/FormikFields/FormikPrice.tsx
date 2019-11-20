import * as React from 'react';
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core/TextField';
import { FieldProps, getIn } from 'formik';
import { injectIntl, InjectedIntlProps, InjectedIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { InputAdornment } from '@material-ui/core';

interface Props extends InjectedIntlProps, FieldProps, Omit<MuiTextFieldProps, 'error' | 'name' | 'onChange' | 'value' | "type" | "InputProps"> {
  label: string
}


class FormikPrice extends React.Component<Props> {
  render() {
    const { children, intl, field,
      form,
      variant = 'standard',
      disabled,
      helperText,

      label,
      ...props
    } = this.props


    const { name } = field;
    const { touched, errors, isSubmitting } = form;

    const fieldError = getIn(errors, name);
    const showError = getIn(touched, name) && !!fieldError;

    return (
      <Grid item xs={12} md={6}>
        <MuiTextField
          error={showError}
          fullWidth {...props}
          helperText={showError ? fieldError : helperText}
          disabled={disabled != undefined ? disabled : isSubmitting}
          label={intl.formatMessage({ id: label })}
          InputProps={{
            //@ts-ignore
            step: 1,
            min: 0,
            startAdornment: (
              <InputAdornment position="start">
                CHF
              </InputAdornment>
            ),
          }}
          type="number"
          {...props}
          {...field}
        >
        {children}
        </MuiTextField>
      </Grid>
    )
  }
}


export default injectIntl(FormikPrice)
