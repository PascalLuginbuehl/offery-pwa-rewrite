
import React from "react"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import { Button, DialogContent, DialogContentText, DialogTitle, DialogActions, Dialog, Grid } from "@material-ui/core"
import { FormattedMessage } from "react-intl"
import { FieldArray, Formik, Field, ArrayHelpers } from "formik"
import Form from "../../../components/FormikFields/Form"
import { ICustomInventar } from "../../../interfaces/IInventars"
import FormikNumberEndAdornmentText from "../../../components/FormikFields/Numbers/FormikNumberEndAdornmentText"

interface Props {
  open: boolean
  handleClose: () => void
  onSave: (customInventar: ICustomInventar) => void
  editItem?: ICustomInventar
}

export default function CustomInventory({ open, handleClose, editItem, onSave}: Props) {

  console.log(editItem)
  return (
    <Dialog open={open} onClose={handleClose}>
      <Formik<ICustomInventar>
        initialValues={editItem ? editItem : {
          Name: "",
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
                <Field component={FormikTextField} name="Name" label="NAME" overrideGrid={{ xs: 12, md: 6 }} />
                <Field component={FormikNumberEndAdornmentText} name="Amount" label="AMOUNT" disabled={false} overrideGrid={{ xs: 12, md: 6 }} />

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
