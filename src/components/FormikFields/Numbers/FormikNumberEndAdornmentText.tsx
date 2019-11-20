import * as React from 'react';
import { injectIntl } from 'react-intl';
import { InputAdornment } from '@material-ui/core';
import FormikTextField, { FormikTextFieldProps } from '../FormikTextField';

type newProps = Omit<FormikTextFieldProps, "type" | "InputProps"> & { adornmentText: string }

const FormikNumberEndAdornmentText: React.ComponentType<newProps> = ({ adornmentText, ...props}) => (
  <FormikTextField
    InputProps={{
      //@ts-ignore
      step: 1,
      min: 0,
      endAdornment: (
        <InputAdornment position="end">
          {adornmentText}
        </InputAdornment>
      ),
    }}
    type="number"

    {...props}
  />
)


export default injectIntl(FormikNumberEndAdornmentText)
