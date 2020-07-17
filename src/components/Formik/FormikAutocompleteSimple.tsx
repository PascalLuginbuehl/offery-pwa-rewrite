import React from "react"

import { Typography } from "@material-ui/core"

import FormikAutocomplete, { FormikAutocompleteProps } from "./FormikAutocomplete"

export interface FormikAutocompleteSimpleOptions {
  value: string | number
  label: string
  secondaryLabel?: string
}

export type FormikAutocompleteSimpleProps<
  FormValues,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
  > = Omit<
    FormikAutocompleteProps<
      FormValues,
      FormikAutocompleteSimpleOptions,
      Multiple,
      DisableClearable,
      FreeSolo
    >,
    "optionValueField"
  >

export default function FormikAutocompleteSimple<
  FormikValues,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>(
  props: FormikAutocompleteSimpleProps<
    FormikValues,
    Multiple,
    DisableClearable,
    FreeSolo
  >
) {
  const {
    ...otherProps
  } = props

  return <FormikAutocomplete<FormikValues, FormikAutocompleteSimpleOptions, Multiple, DisableClearable, FreeSolo>
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    ref={otherProps.ref}
    {...otherProps}

    optionValueField={"value"} // see FormikSelectOption.value
    getOptionLabel={option => (option ? option.label : "")}
    renderOption={(option, { selected }) => (
      <div>
        <Typography variant="body1" noWrap style={selected ? { fontWeight: "bold" } : {}}>
          {option.label}
        </Typography>
        {
          option.secondaryLabel ? (
            <Typography component="p" variant="caption" noWrap>
              {option.secondaryLabel}
            </Typography>
          ) : null
        }
      </div>
    )}
  />
}
