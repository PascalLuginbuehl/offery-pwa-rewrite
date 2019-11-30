import * as React from 'react';
import { injectIntl } from 'react-intl';
import { InputAdornment } from '@material-ui/core';
import FormikTextField, { FormikTextFieldProps } from '../FormikTextField';


type newProps = Omit<FormikTextFieldProps, "type" | "InputProps">

const FormikPercent: React.ComponentType<newProps> = props => (
  <FormikTextField
    InputProps={{
      endAdornment: <InputAdornment position="end">%</InputAdornment>,
    }}
    // @ts-ignore
    ref={props.ref}
    inputProps={{
      step: 1,
      min: 0,
      max: 100,
    }}
    type="number"
    {...props}
  />
)


export default injectIntl(FormikPercent)
