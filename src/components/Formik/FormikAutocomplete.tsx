import React from "react"

import { makeStyles } from "@material-ui/core"
import { Autocomplete, AutocompleteProps } from "@material-ui/lab"
import TextField, { TextFieldProps as MuiTextFieldProps } from "@material-ui/core/TextField"
import { useField, useFormikContext } from "formik"
import { FormikFieldConfig } from "./FormikFieldConfig"
import clsx from "clsx"

const useStyles = makeStyles({
  fullWidth: {
    width: "100%",
  },
})

export interface FormikAutocompleteProps<FormValues, T, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined>
  extends
  FormikFieldConfig<FormValues>,
  Omit<MuiTextFieldProps, "error" | "name" | "onChange" | "value" | "variant">,
  Pick<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "getOptionLabel" | "groupBy" | "renderOption" | "ListboxComponent" | "disableClearable" | "disableListWrap"> {

  optionValueField: string  // name of the value within T (e.g. id for user.id or value)
  options: Array<T>
  multiple?: boolean
}

export default function FormikAutocomplete<
  FormValues,
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>
(
  props: FormikAutocompleteProps<
      FormValues,
      T,
      Multiple,
      DisableClearable,
      FreeSolo
    >
) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    optionValueField,

    name,
    options,
    multiple,

    // AutocompleteProps
    getOptionLabel,
    groupBy,
    renderOption,
    ListboxComponent,
    disableClearable,
    disableListWrap,

    disabled,
    helperText,

    // removed from textFieldProps, used below
    validate,
    enableAutoSubmit,
    onChange,

    fullWidth = true,
    className,
    ...textFieldProps
  } = props

  const classes = useStyles()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ onChange: unused, ...field }, meta, helpers] = useField({ name, validate })
  const { isSubmitting, submitForm } = useFormikContext()

  const getValue = () => {
    if (!options) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return multiple ? [] : (null as any)
    }

    // @ts-ignore
    const value = multiple ? options.filter(option => field.value.indexOf(option[optionValueField]) >= 0)
    // @ts-ignore
      : options.find(option => option[optionValueField] === field.value)
    return value === undefined ? multiple ? [] : null : value
  }

  const handleChange = (event: React.ChangeEvent<{}>, option: T | T[] | null) => {
    if (!option) {
      helpers.setValue(null)
      return
    }

    // @ts-ignore
    const value = multiple ? (option as T[]).map((item: T) => item[optionValueField])
    // @ts-ignore
      : (option as T)[optionValueField]
    helpers.setValue(value)

    if (onChange) {
      onChange(event)
    }

    if (enableAutoSubmit) {
      submitForm()
    }
  }

  const isDisabled = disabled !== undefined ? disabled : isSubmitting

  const fieldError = meta.error
  const showError = meta.touched && !!fieldError

  return <Autocomplete
    onChange={handleChange}
    value={getValue()}
    options={options}
    multiple={multiple || false}
    getOptionLabel={getOptionLabel}
    groupBy={groupBy}
    className={clsx(className, { [classes.fullWidth]: fullWidth })}

    renderInput={(params) => (
      <TextField
        error={showError}
        helperText={showError ? fieldError : helperText}

        {...field}
        {...params}
        {...textFieldProps}
        fullWidth

        disabled={isDisabled}
        InputLabelProps={{ ...textFieldProps.InputLabelProps }}
      />
    )}
    renderOption={renderOption}
    ListboxComponent={ListboxComponent}
    disableClearable={disableClearable}
    disableListWrap={disableListWrap}
    disabled={isDisabled}
  />
}
