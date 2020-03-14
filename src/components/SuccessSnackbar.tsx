import React, { SyntheticEvent } from "react"
import PropTypes from "prop-types"
import clsx from "clsx"
import Button from "@material-ui/core/Button"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"
import InfoIcon from "@material-ui/icons/Info"
import CloseIcon from "@material-ui/icons/Close"
import { amber, green } from "@material-ui/core/colors"
import IconButton from "@material-ui/core/IconButton"
import OriginalSnackbar from "@material-ui/core/Snackbar"
import SnackbarContent from "@material-ui/core/SnackbarContent"
import WarningIcon from "@material-ui/icons/Warning"
import { makeStyles, Theme } from "@material-ui/core/styles"
import { withStyles, WithStyles } from "@material-ui/styles"

const styles = ((theme: Theme) => ({
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
}))

export interface Props extends WithStyles<typeof styles> {
  className?: string
  message?: string
  onClose?: () => void
  open: boolean
}

function Snackbar(props: Props) {
  const classes = props.classes
  const { open, className, message, onClose, ...other } = props

  return (
    <OriginalSnackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <SnackbarContent
        aria-describedby="client-snackbar"
        message={message}
        action={[
          <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
        {...other}
      />
    </OriginalSnackbar>

  )
}

export default withStyles(styles)(Snackbar)
