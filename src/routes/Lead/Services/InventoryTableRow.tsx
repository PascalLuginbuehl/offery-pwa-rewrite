import {          TableCell,  TableRow, IconButton,   Chip, makeStyles, } from "@material-ui/core"
import * as React from "react"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import { FormattedMessage, useIntl } from "react-intl"
import {  IFurniture } from "../../../interfaces/IResource"
import {   IInventar } from "../../../interfaces/IInventars"
import { AmountDialog } from "../../../components/AmountDialog"

interface Props {
  furniture: IFurniture
  item: IInventar
  setItemAmount: (amount: number) => void
}

const useStyles = makeStyles({
  buttonSmallPadding: {
    padding: 5,
    paddingLeft: 15,
  },
})

export default function InventoryTableRow(props: Props) {
  const {
    furniture,
    item,
    setItemAmount,
  } = props

  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null)
  const [dialogOpen, setDialog] = React.useState<boolean>(false)
  const intl = useIntl()
  const classes = useStyles()

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
      <TableRow onTouchEnd={touchEnd} onTouchStart={touchStart} onMouseDown={touchStart} onMouseUp={touchEnd} selected={!!timer}>
        <TableCell padding="checkbox">
          <FormattedMessage id={furniture.NameTextKey} />

          {item.FSize ? <Chip size="small" label={intl.formatMessage({ id: item.FSize.NameTextKey })} /> : null}
          {item.FMaterial ? <Chip size="small" label={intl.formatMessage({ id: item.FMaterial.NameTextKey })} /> : null}
        </TableCell>

        <TableCell align="right" padding="checkbox">
          {item.Amount} Stk.
        </TableCell>

        <TableCell padding="none" align="right" style={{ whiteSpace: "nowrap" }}>
          {/* <IconButton onClick={() => setItemAmount(item.Amount - 1)} classes={{ root: classes.buttonSmallPadding }}>
            <RemoveCircleOutlineIcon />
          </IconButton> */}

          <IconButton onClick={() => setItemAmount(0)} classes={{ root: classes.buttonSmallPadding }}>
            <DeleteForeverIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <AmountDialog
        dialogOpen={dialogOpen}
        handleClose={handleClose}
        ProductNameTextKey={furniture.NameTextKey}
        amount={item.Amount}
        setItemAmount={(amount) => setItemAmount(amount)}
      />
    </>
  )
}
