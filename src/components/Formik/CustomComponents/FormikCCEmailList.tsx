import React, { useState } from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, Button, ListItem, List, IconButton, ListItemText, ListItemSecondaryAction, TextField, ListSubheader } from "@material-ui/core"
import { FormikProps, withFormik, Field, FieldArray, Formik, useFormikContext } from "formik"
import { injectIntl, WrappedComponentProps, FormattedMessage, useIntl } from "react-intl"
import AddIcon from "@material-ui/icons/Add"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import { useFormikField } from ".."

export interface CCEMailListProps<FormValues> {
  name: keyof FormValues & string
}

// KWIKFIX for email
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default function FormikCCEmailList<FormValues>(props: CCEMailListProps<FormValues>) {
  const { name } = props

  const [ field ] = useFormikField<string[], FormValues>(props)
  const intl = useIntl()

  const { isSubmitting } = useFormikContext()

  const [emailValue, setEmailValue] = useState<string>("")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value)
  }
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
            <ListItemText primary={<TextField label={intl.formatMessage({ id: "EMAIL" })} value={emailValue} type="email" onChange={handleChange} />} />

            <ListItemSecondaryAction>
              <IconButton
                disabled={isSubmitting || !emailValue || !EMAIL_REGEX.test(emailValue.toLowerCase())}
                onClick={() => {
                  arrayHelpers.push(emailValue)
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
