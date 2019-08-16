import * as React from 'react';
import MuiSwitch, {
  SwitchProps as MuiSwitchProps,
} from '@material-ui/core/Switch';
import { FieldProps, getIn } from 'formik';
import { injectIntl, InjectedIntlProps, InjectedIntl } from 'react-intl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { DatePicker as DatePickerOriginal, DatePickerProps as MuiDatePickerProps } from "@material-ui/pickers"
import { InputAdornment, IconButton } from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"

export interface DatePickerProps
  extends FieldProps,
  Omit<
    MuiDatePickerProps,
    'form' | 'name' | 'onChange' | 'value' | 'defaultChecked'
  > { }

export const fieldToDate = ({
  field,
  form,
  disabled,
  label,
  ...props
}: DatePickerProps, intl: InjectedIntl): MuiDatePickerProps => {
  const { name, onChange } = field;
  const { touched, errors, isSubmitting } = form;

  const fieldError = getIn(errors, name);
  const showError = getIn(touched, name) && !!fieldError;

  return {
    ...props,
    ...field,
    // Bugfix so custom change event works (Material UI Picker is stupid)
    onChange: (date: Date | null) => { onChange({ target: { value: date, name }})},
    error: showError,
    helperText: showError ? fieldError : props.helperText,
    // helperText = intl.formatMessage({ id: errorMessage }, messageValues)

    disabled: disabled != undefined ? disabled : isSubmitting,

    // translations
    // @ts-ignore
    label: intl.formatMessage({ id: label }),
  }
}

const DatePicker: React.ComponentType<DatePickerProps & { label: string }> = injectIntl((
  {
    intl,
    ...props
  }: DatePickerProps & InjectedIntlProps & { label: string }
) =>
  <Grid xs={12} sm={6} item>
    <DatePickerOriginal
      {...fieldToDate(props, intl)}

      okLabel={intl.formatMessage({ id: "OK" })}
      cancelLabel={intl.formatMessage({ id: "CANCEL" })}

      views={["year", "month", "date"]}
      format={"dd.MM.yyyy"}

      fullWidth

      // InputProps={value ? {
      //   endAdornment: (
      //     <InputAdornment position="end">
      //       <IconButton
      //         onClick={() => {handleChange(null)}}
      //       >
      //         <CloseIcon />
      //       </IconButton>
      //     </InputAdornment>
      //   ),
      // } : {}}
    />
  </Grid>
)

DatePicker.displayName = 'FormikMaterialUIDatePicker';

export default DatePicker
