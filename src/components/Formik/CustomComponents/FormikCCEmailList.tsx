import React, { useState } from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, Button, ListItem, List, IconButton, ListItemText, ListItemSecondaryAction, TextField, ListSubheader } from "@material-ui/core"
import { FormikProps, withFormik, Field, FieldArray, Formik, useFormikContext } from "formik"
import { injectIntl, WrappedComponentProps, FormattedMessage, useIntl } from "react-intl"
import AddIcon from "@material-ui/icons/Add"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import { useFormikField } from ".."
import { useTranslation } from "react-i18next"

export interface CCEMailListProps<FormValues> {
  name: keyof FormValues & string
}

// KWIKFIX for email
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default function FormikCCEmailList<FormValues>(props: CCEMailListProps<FormValues>) {
  const { name } = props

  const { t } = useTranslation()
  const intl = useIntl()
  const [emailValue, setEmailValue] = useState<string>("")

  const { isSubmitting } = useFormikContext()
  const [field, meta, helpers] = useFormikField<string[], FormValues>({
    ...props,
    validate: () => {
      if (emailValue.length > 0) {
        return t<string>("EMAIL.NOT_ADDED_TO_LIST")
      }

      return
    }
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value)
  }

  const fieldError = meta.error
  const showError = meta.touched && !!fieldError

  return (
    <FieldArray
      name={name}
      render={arrayHelpers => (
        <List
          dense
          subheader={
            <ListSubheader>
              <FormattedMessage id="CC_EMAILS"></FormattedMessage>
            </ListSubheader>
          }
        >
          {field.value.map((email, index) => (
            <ListItem key={index} dense>
              <ListItemText primary={email} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => arrayHelpers.remove(index)}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}

          <ListItem>
            <ListItemText primary={<TextField label={intl.formatMessage({ id: "EMAIL" })} value={emailValue} type="email" onChange={handleChange} error={showError} helperText={showError ? fieldError : undefined} onBlur={field.onBlur}/>}  />

            <ListItemSecondaryAction>
              <IconButton
                disabled={isSubmitting || !emailValue || !EMAIL_REGEX.test(emailValue.toLowerCase())}
                onClick={() => {
                  arrayHelpers.push(emailValue)

                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  helpers.setError("")
                  setEmailValue("")
                }}
                edge="end"
              >
                <AddIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      )}
    />
  )
}
