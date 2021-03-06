
import React from "react"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import { Button, DialogContent,  DialogTitle, DialogActions, Dialog, Grid } from "@material-ui/core"
import { FormattedMessage } from "react-intl"
import {  Formik, Field } from "formik"
import Form from "../../../components/FormikFields/Form"
import { ICustomInventar } from "../../../interfaces/IInventars"
import FormikNumberEndAdornmentText from "../../../components/FormikFields/Numbers/FormikNumberEndAdornmentText"

interface Props {
  open: boolean
  handleClose: () => void
  onSave: (customInventar: ICustomInventar) => void
  editItem?: ICustomInventar
  initialItemName?: string
}

const capitalize = (s: string | unknown) => {
  if (typeof s !== "string") return ""

  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function CustomInventory(props: Props) {
  const { open, handleClose, editItem, onSave, initialItemName } = props

  console.log(editItem)
  return (
    <Dialog open={open} onClose={handleClose}>
      <Formik<ICustomInventar>
        initialValues={editItem ? editItem : {
          Name: capitalize(initialItemName) ?? "",
          Description: "",
          Amount: 1,
        }}

        onSubmit={(values, actions) => {
          onSave(values)

          actions.setSubmitting(false)
          actions.resetForm()
        }}
      >
        {({ submitForm, values, isSubmitting, handleSubmit }) => (
          <Form disableSubmit disableGridContainer>
            <DialogTitle>
              <FormattedMessage id="CUSTOM_ITEM" />
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={1}>
                <Field component={FormikTextField} name="Name" label="NAME" required overrideGrid={{ xs: 12, md: 6 }} />
                <Field component={FormikNumberEndAdornmentText} name="Amount" required label="AMOUNT" disabled={false} overrideGrid={{ xs: 12, md: 6 }} />

                <Field component={FormikTextField} name="Description" label="DESCRIPTION" disabled={false} multiline overrideGrid={{ xs: 12, md: 12 }} />
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} color="primary">
                <FormattedMessage id="CANCEL" />
              </Button>
              <Button color="primary" type="submit" disabled={isSubmitting}>
                <FormattedMessage id={editItem ? "SAVE" : "CREATE"} />
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
