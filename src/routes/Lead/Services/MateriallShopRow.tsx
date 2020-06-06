import React, { useState } from "react"
import { ArrayHelpers } from "formik"
import { IProduct } from "../../../interfaces/IProduct"
import { IOrderPosition, CurrentlyOpenStateEnum } from "../../../interfaces/IShop"
import {  IconButton, TableRow,         Theme } from "@material-ui/core"
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"


import { makeStyles, createStyles } from "@material-ui/styles"
import { StyledTableCell } from "../LeadOverview"
import { AmountDialog } from "../../../components/AmountDialog"

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
        <StyledTableCell>
          <FormattedMessage id={product.NameTextKey} />
        </StyledTableCell>
        <StyledTableCell align="right">{item.Amount} Stk.</StyledTableCell>
        <StyledTableCell align="right">
          {currentlyOpen != CurrentlyOpenStateEnum.Free ? (
            <FormattedNumber
              value={(currentlyOpen == CurrentlyOpenStateEnum.Rent ? product.RentPrice : product.SellPrice) * item.Amount}
              style="currency"
              currency="CHF"
            />
          ) : (
            "-"
          )}
        </StyledTableCell>

        <StyledTableCell padding="none" align="center" style={{ whiteSpace: "nowrap" }}>
          <IconButton onClick={() => arrayHelpers.replace(item.originalIndex, {...item, Amount: item.Amount > 1 ? item.Amount - 1 : 1})}>
            <RemoveCircleOutlineIcon />
          </IconButton>

          <IconButton onClick={() => arrayHelpers.remove(item.originalIndex)}>
            <DeleteForeverIcon />
          </IconButton>
        </StyledTableCell>
      </TableRow>


      <AmountDialog
        dialogOpen={dialogOpen}
        handleClose={handleClose}
        ProductNameTextKey={product.NameTextKey}
        amount={item.Amount}
        setItemAmount={(amount) => arrayHelpers.replace(item.originalIndex, { ...item, Amount: amount })}

        itemPrice={currentlyOpen != CurrentlyOpenStateEnum.Free ? currentlyOpen == CurrentlyOpenStateEnum.Rent ? product.RentPrice : product.SellPrice : undefined}
      />
    </>
  )
}
