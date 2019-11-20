import * as React from 'react';
import { injectIntl } from 'react-intl';
import { InputAdornment } from '@material-ui/core';
import FormikTextField, { FormikTextFieldProps } from '../FormikTextField';

type newProps = Omit<FormikTextFieldProps, "type" | "InputProps">

const FormikPrice: React.ComponentType<newProps> = (props) => (
  //@ts-ignore
  <FormikTextField
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          CHF
        </InputAdornment>
      ),
    }}

    inputProps={{
      step: 1,
      min: 0,
    }}

    overrideGrid={{ xs: 6, md: 3 }}

    type="number"

    {...props}
  />
)


export default injectIntl(FormikPrice)

