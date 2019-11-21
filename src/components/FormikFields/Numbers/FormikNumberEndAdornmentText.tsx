import * as React from 'react';
import { injectIntl } from 'react-intl';
import { InputAdornment, Theme } from '@material-ui/core';
import FormikTextField, { FormikTextFieldProps } from '../FormikTextField';
import { withStyles, WithStyles, createStyles } from '@material-ui/styles';

type newProps = Omit<FormikTextFieldProps, "type" | "InputProps"> & { adornmentText: string } &  WithStyles<typeof styles>

const styles = (theme: Theme) =>
  createStyles({
    input: {
      "textAlign": "right"
    },
  })

const FormikNumberEndAdornmentText: React.ComponentType<newProps> = ({ adornmentText, overrideGrid = { xs: 6, md: 3 }, classes, ...props}) => (
  //@ts-ignore
  <FormikTextField
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          {adornmentText}
        </InputAdornment>
      ),
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


export default withStyles(styles)(injectIntl(FormikNumberEndAdornmentText))
