
import React from "react"
import { Button, DialogContent, DialogTitle, DialogActions, Dialog, Grid, Typography, Chip } from "@material-ui/core"
import { FormattedMessage, useIntl } from "react-intl"
import { IInventar, ICustomInventar } from "../../interfaces/IInventars"
import { IFurniture } from "../../interfaces/IResource"

interface Props {
  open: boolean
  onClose: () => void
  onRemove: () => void
  furniture: IFurniture | null
  removeItem: IInventar | null
}

export default function RemoveItemModal(props: Props) {
  const { open, onClose, onRemove, removeItem, furniture } = props

  console.log(removeItem)
  const intl = useIntl()

  if (!removeItem || !furniture) {
    return null
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage id="REMOVE_ITEM" />
      </DialogTitle>
      <DialogContent>
        <Typography>
          <FormattedMessage id={furniture.NameTextKey} />
          <br />

          {removeItem.FSize ? <Chip size="small" label={intl.formatMessage({ id: removeItem.FSize.NameTextKey })} /> : null}
          {removeItem.FMaterial ? <Chip size="small" label={intl.formatMessage({ id: removeItem.FMaterial.NameTextKey })} /> : null}
          <br />
          {removeItem.Amount} Stk.

        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button color="primary" onClick={() => {
          onRemove()
          onClose()
        }}>
          <FormattedMessage id={"REMOVE"} />
        </Button>
      </DialogActions>
    </Dialog>
  )
}
