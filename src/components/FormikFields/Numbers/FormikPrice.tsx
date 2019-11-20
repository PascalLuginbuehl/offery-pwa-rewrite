import * as React from 'react';
import { injectIntl } from 'react-intl';
import { InputAdornment } from '@material-ui/core';
import FormikTextField, { FormikTextFieldProps } from '../FormikTextField';

type newProps = Omit<FormikTextFieldProps, "type" | "InputProps">

const FormikPrice: React.ComponentType<newProps> = (props) => (
  <FormikTextField
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
  />
)


export default injectIntl(FormikPrice)

