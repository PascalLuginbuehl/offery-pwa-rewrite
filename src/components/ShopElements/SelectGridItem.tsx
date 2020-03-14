import { createStyles, Grid, Theme, WithStyles, withStyles, IconButton, ButtonBase, Paper, InputAdornment,  Typography, ClickAwayListener, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core"
import * as React from "react"

import { IProduct } from "../../interfaces/IProduct"
import IntlTypography from "../Intl/IntlTypography"
import { FormattedMessage, FormattedNumber } from "react-intl"



import { CurrentlyOpenStateEnum } from "../../interfaces/IShop"
import { Formik, Field } from "formik"
import FormikTextField from "../FormikFields/FormikTextField"

import Form from "../FormikFields/Form"




const styles = (theme: Theme) =>
  createStyles({
    root: {

    },
    fullButton: {
      width: "100%"
    },
    fullPaper: {
      width: "100%",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    buttonCorner: {
      position: "absolute",
      right: 0,
      top: 0,

    }
  })

interface State {
  amountOpen: boolean
  timer: NodeJS.Timeout | null
  readyToOpen: boolean
}

interface Props extends WithStyles<typeof styles> {
  onSelectProduct: (amount: number) => void
  product: IProduct
  currentlyOpenState: CurrentlyOpenStateEnum
}

class GridSelect extends React.Component<Props, State> {
  state: State = {
    amountOpen: false,
    timer: null,
    readyToOpen: false
  }

  touchStart = (e: React.TouchEvent | React.MouseEvent) => {
    this.setState({ timer: setTimeout(this.enableReadyToOpen, 300)})
  }

  touchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation()

    const { timer, readyToOpen } = this.state
    //stops short touches from firing the event

    if (readyToOpen) {
      this.showMultipleInputMenu()
    }

    if (timer) {
      clearTimeout(timer) // clearTimeout, not cleartimeout..
      this.setState({timer: null})
    }
  }

  onClickAway = (e: React.MouseEvent<Document, MouseEvent>) => {

    const { timer, readyToOpen } = this.state
    if (timer) {
      clearTimeout(timer) // clearTimeout, not cleartimeout..
      this.setState({ timer: null, readyToOpen: false })
      e.preventDefault()
    }
  }

  enableReadyToOpen = () => {
    const { timer, readyToOpen } = this.state

    this.setState({readyToOpen: true})
    console.log("longpressdetected")
  }

  showMultipleInputMenu = () => {
    const { timer, readyToOpen } = this.state

    if (readyToOpen) {
      this.setState({ amountOpen: true, readyToOpen: false})
      // TODO: Fix this -1
      this.props.onSelectProduct(-1)
    }
  }

  handleClose = () => {
    this.setState({amountOpen: false})
  }

  public render() {
    const { classes, product, onSelectProduct, currentlyOpenState } = this.props
    const { amountOpen, readyToOpen } = this.state

    return (
      <Grid item xs={4} sm={3} md={2} lg={2} >

        <ClickAwayListener onClickAway={this.onClickAway} mouseEvent="onMouseUp" touchEvent="onTouchEnd">
          <ButtonBase className={classes.fullButton} onTouchEnd={this.touchEnd} onTouchStart={this.touchStart} onMouseDown={this.touchStart} onMouseUp={this.touchEnd} onClick={() => readyToOpen ? null : onSelectProduct(1)} >
            <Paper elevation={readyToOpen ? 10 : 1} className={classes.fullPaper}>
              <IntlTypography>{product.NameTextKey}</IntlTypography>

              {currentlyOpenState == CurrentlyOpenStateEnum.Rent ?
                <Typography variant="body2">
                  {/* <FormattedMessage id={"RENT"} />
                  :&nbsp; */}
                  <FormattedNumber
                    value={product.RentPrice}
                    style="currency"
                    currency="CHF"
                    minimumFractionDigits={0}
                    maximumFractionDigits={2}
                  />
                </Typography>
                : null
              }

              {currentlyOpenState == CurrentlyOpenStateEnum.Buy ?
                <Typography variant="body2">
                  {/* <FormattedMessage id={"BUY"} />
                  :&nbsp; */}
                  <FormattedNumber
                    value={product.SellPrice}
                    style="currency"
                    currency="CHF"
                    minimumFractionDigits={0}
                    maximumFractionDigits={2}
                  />
                </Typography>
                : null
              }

              {/* { amountOpen ?
                <MuiTextfield
                  value={amount}
                  type="number"
                  onChange={this.handleChange}
                  // step={1}
                  // value={5}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      <IconButton>
                        -
                      </IconButton>
                    </InputAdornment>,
                    endAdornment: <InputAdornment position="start">
                      <IconButton>
                        +
                      </IconButton>
                    </InputAdornment>,
                  }}
                />
                : null } */}
            </Paper>
          </ButtonBase>
        </ClickAwayListener>

        <Dialog open={amountOpen} onClose={this.handleClose}>
          <Formik<{ Amount: number }>
            initialValues={{
              Amount: 10,
            }}

            onSubmit={(values, actions) => {
              // onSave(values)

              this.handleClose()
              onSelectProduct(values.Amount)
              actions.setSubmitting(false)
              actions.resetForm()
            }}
          >

            {({ submitForm, values, isSubmitting, handleSubmit, setFieldValue }) => (
              <Form disableSubmit disableGridContainer>
                <DialogTitle>
                  <FormattedMessage id="SELECT_AMOUNT" />
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
                  </Grid>
                </DialogContent>

                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    <FormattedMessage id="CANCEL" />
                  </Button>
                  <Button color="primary" type="submit" disabled={isSubmitting}>
                    <FormattedMessage id={"ADD"} />
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>
      </Grid>
    )
  }
}

export default withStyles(styles)(GridSelect)


