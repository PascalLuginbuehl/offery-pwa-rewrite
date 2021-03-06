import React from "react"
import ReactSelect from "react-select"
import  {
  TextFieldProps as MuiTextFieldProps,
} from "@material-ui/core/TextField"
import { FieldProps, getIn } from "formik"
import { injectIntl, WrappedComponentProps } from "react-intl"
import Grid from "@material-ui/core/Grid"
import { components, styles } from "./../ReactSelectComponents"
import { WithStyles, withStyles } from "@material-ui/styles"
import { OptionsType, ValueType } from "react-select/src/types"

interface Option {
  label: string
  value: string
}


export interface SelectProps extends WrappedComponentProps, WithStyles<typeof styles>, FieldProps, Omit<MuiTextFieldProps, "error" | "name" | "onChange" | "value" | "classes"> {
  options: OptionsType<Option>
  isMulti?: boolean

  label: string
}


class Select extends React.Component<SelectProps> {
  displayName = "FormikMaterialUISelect"

  render() {
    const {
      intl,

      label,

      field,
      form,
      options: tempOptions,
      isMulti = false,
      classes,

      required,
      disabled,

      ...props
    } = this.props

    const { name } = field
    const { touched, errors, isSubmitting } = form


    const onChange = (option: ValueType<Option | Option[]>) => {
      form.setFieldValue(
        field.name,
        isMulti
          ? (option as Option[]).map((item: Option) => item.value)
          : (option as Option).value
      )
    }

    const options = tempOptions.map(e => ({ ...e, label: intl.formatMessage({ id: e.label }) }))

    const getValue = () => {
      if (options) {
        return isMulti
          ? options.filter(option => field.value.indexOf(option.value) >= 0)
          : options.find(option => option.value === field.value)
      } else {
        return isMulti ? [] : ("" as any)
      }
    }

    const isDisabled = disabled != undefined ? disabled : isSubmitting

    const fieldError = getIn(errors, name)
    const showError = getIn(touched, name) && !!fieldError

    return (
      <Grid item xs={12} md={6}>
        <ReactSelect
          name={field.name}
          value={getValue()}
          onChange={onChange}
          options={options}
          isMulti={isMulti}

          classes={classes}
          // styles={selectStyles}
          components={components}

          TextFieldProps={{
            label: intl.formatMessage({ id: label }),
            InputLabelProps: {
              shrink: true,
            },

            error: showError,
            helperText: showError ? fieldError : props.helperText,
            disabled: isDisabled,

            ...field,
            ...props,
          }}

          placeholder={intl.formatMessage({ id: "SELECT" })}
          isDisabled={isDisabled}
        />
      </Grid>
    )
  }
}

export default withStyles(styles)(injectIntl(Select))
