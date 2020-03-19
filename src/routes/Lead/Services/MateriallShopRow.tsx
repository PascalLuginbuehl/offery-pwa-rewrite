import React, { useState } from "react"
import { ArrayHelpers, Formik, Field } from "formik"
import { IProduct } from "../../../interfaces/IProduct"
import { IOrderPosition, CurrentlyOpenStateEnum } from "../../../interfaces/IShop"
import { TableCell, IconButton, TableRow, Dialog, DialogTitle, DialogContent, Grid, Typography, InputAdornment, DialogActions, Button, Theme } from "@material-ui/core"
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import Form from "../../../components/FormikFields/Form";
import FormikTextField from "../../../components/FormikFields/FormikTextField";
import { makeStyles, createStyles } from "@material-ui/styles";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      cursor: "pointer"
    }
  })
)

interface Props {
  product: IProduct
  item: IOrderPosition & {originalIndex: number}
  arrayHelpers: ArrayHelpers
  currentlyOpen: CurrentlyOpenStateEnum
}

export function MaterialShopRow({ item, product, arrayHelpers, currentlyOpen}: Props) {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [dialogOpen, setDialog] = useState<boolean>(false)
  const { formatMessage } = useIntl()
  const classes = useStyle()

  function touchStart(e: React.TouchEvent | React.MouseEvent) {
    setTimer(setTimeout(() => setDialog(true), 500))
  }

  function touchEnd(e: React.TouchEvent | React.MouseEvent) {
    if (timer) {
      clearTimeout(timer) // clearTimeout, not cleartimeout..
      setTimer(null)
    }
  }

  function handleClose() {
    setTimer(null)
    setDialog(false)
  }


  return (
    <>
      <TableRow key={item.originalIndex} onTouchEnd={touchEnd} onTouchStart={touchStart} onMouseDown={touchStart} onMouseUp={touchEnd} selected={!!timer} className={classes.root}>
        <TableCell>
          <FormattedMessage id={product.NameTextKey} />
        </TableCell>
        <TableCell align="right">{item.Amount} Stk.</TableCell>
        <TableCell align="right">
          {currentlyOpen != CurrentlyOpenStateEnum.Free ? (
            <FormattedNumber
              value={(currentlyOpen == CurrentlyOpenStateEnum.Rent ? product.RentPrice : product.SellPrice) * item.Amount}
              style="currency"
              currency="CHF"
            />
          ) : (
            "-"
          )}
        </TableCell>

        <TableCell padding="none" align="center" style={{ whiteSpace: "nowrap" }}>
          <IconButton onClick={() => arrayHelpers.replace(item.originalIndex, {...item, Amount: item.Amount > 1 ? item.Amount - 1 : 1})}>
            <RemoveCircleOutlineIcon />
          </IconButton>

          <IconButton onClick={() => arrayHelpers.remove(item.originalIndex)}>
            <DeleteForeverIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <Dialog open={dialogOpen} onClose={handleClose}>
        <Formik<{ Amount: number }>
          initialValues={{
            Amount: item.Amount,
          }}

          onSubmit={(values, actions) => {
            // onSave(values)

            handleClose()

            arrayHelpers.replace(item.originalIndex, { ...item, Amount: values.Amount })

            actions.setSubmitting(false)
            actions.resetForm()
          }}
        >

          {({ submitForm, values, isSubmitting, handleSubmit, setFieldValue }) => (
            <Form disableSubmit disableGridContainer>
              <DialogTitle>
                <FormattedMessage id="EDIT_AMOUNT_" values={{item: formatMessage({id: product.NameTextKey})}} />
              </DialogTitle>

              <DialogContent>
                <Grid container spacing={1}>
                  <Field component={FormikTextField} name="Amount" label="AMOUNT" type="number" disabled={false} autoFocus overrideGrid={{ xs: 12 }} InputProps={{
                    min: 1,
                    step: 1,
                    max: 10000,
                    startAdornment: <InputAdornment position="start">
                      <IconButton onClick={() => setFieldValue("Amount", (values.Amount - 10 > 0 ? values.Amount - 10 : 1))}>
                        <Typography>
                          -10
                        </Typography>
                      </IconButton>
                    </InputAdornment>,
                    endAdornment: <InputAdornment position="start">
                      <IconButton onClick={() => setFieldValue("Amount", values.Amount + 10)}>
                        <Typography>
                          +10
                        </Typography>
                      </IconButton>
                    </InputAdornment>,
                  }} />


                  <Typography>
                    <FormattedMessage id="NEW_PRICE"/>: &nbsp;
                    {currentlyOpen != CurrentlyOpenStateEnum.Free ? (
                      <FormattedNumber
                        value={(currentlyOpen == CurrentlyOpenStateEnum.Rent ? product.RentPrice : product.SellPrice) * values.Amount}
                        style="currency"
                        currency="CHF"
                      />
                    ) : (
                      "-"
                    )}
                  </Typography>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose} color="primary">
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
    </>
  )
}
