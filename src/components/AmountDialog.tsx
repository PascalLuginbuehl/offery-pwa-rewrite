import React from "react"
import {  Formik, Field } from "formik"
import { IconButton,  Dialog, DialogTitle, DialogContent, Grid, Typography, InputAdornment, DialogActions, Button } from "@material-ui/core"
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl"
import Form from "./../components/FormikFields/Form"
import FormikTextField from "./../components/FormikFields/FormikTextField"




interface Props {
  dialogOpen: boolean
  handleClose: () => void
  amount: number
  setItemAmount: (amount: number) => void
  ProductNameTextKey: string

  itemPrice?: number
}

export function AmountDialog(props: Props) {
  const {
    dialogOpen,
    handleClose,
    amount,
    setItemAmount,
    ProductNameTextKey,
    itemPrice
  } = props

  const intl = useIntl()

  return (
    <Dialog open={dialogOpen} onClose={() => handleClose()}>
      <Formik<{ Amount: number }>
        initialValues={{
          Amount: amount,
        }}

        onSubmit={(values, actions) => {
          // onSave(values)

          handleClose()

          setItemAmount(values.Amount)

          //

          actions.setSubmitting(false)
          actions.resetForm()
        }}
      >

        {({ values, isSubmitting, handleSubmit, setFieldValue }) => (
          <Form disableSubmit disableGridContainer>
            <DialogTitle>
              <FormattedMessage id="EDIT_AMOUNT_" values={{ item: intl.formatMessage({ id: ProductNameTextKey }) }} />
            </DialogTitle>

            <DialogContent>
              <Grid container spacing={1}>
                <Field component={FormikTextField} name="Amount" label="AMOUNT" type="number" disabled={false} autoFocus overrideGrid={{ xs: 12 }} InputProps={{
                  min: 1,
                  step: 1,
                  max: 10000,
                  startAdornment: <InputAdornment position="start">
                    <IconButton onClick={() => setFieldValue("Amount", (values.Amount * 1 - 10 > 0 ? values.Amount - 10 : 1))}>
                      <Typography>
                        -10
                      </Typography>
                    </IconButton>
                  </InputAdornment>,
                  endAdornment: <InputAdornment position="start">
                    <IconButton onClick={() => setFieldValue("Amount", values.Amount * 1 + 10)}>
                      <Typography>
                        +10
                      </Typography>
                    </IconButton>
                  </InputAdornment>,
                }} />

                {
                  itemPrice ? (
                    <Grid item xs={12}>
                      <Typography>
                        <FormattedMessage id="NEW_PRICE" />: &nbsp;
                        <FormattedNumber
                          value={itemPrice * values.Amount}
                          style="currency"
                          currency="CHF"
                        />
                      </Typography>
                    </Grid>
                  ) : null
                }
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => handleClose()} color="primary">
                <FormattedMessage id="CANCEL" />
              </Button>
              <Button color="primary" type="submit" disabled={isSubmitting}>
                <FormattedMessage id={"CHANGE"} />
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
