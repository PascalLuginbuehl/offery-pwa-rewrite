import { createStyles, Grid, Theme, WithStyles, withStyles, ButtonBase, Paper, InputAdornment,  Typography, ClickAwayListener, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core"
import * as React from "react"
import { IProduct } from "../../interfaces/IProduct"
import IntlTypography from "../Intl/IntlTypography"
import { FormattedNumber } from "react-intl"
import { CurrentlyOpenStateEnum } from "../../interfaces/IShop"


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

interface Props extends WithStyles<typeof styles> {
  onSelectProduct: (amount: number) => void
  product: IProduct
  currentlyOpenState: CurrentlyOpenStateEnum
}

class GridSelect extends React.Component<Props> {
  public render() {
    const { classes, product, onSelectProduct, currentlyOpenState } = this.props

    return (
      <Grid item xs={4} sm={3} md={2} lg={2} >
        <ButtonBase className={classes.fullButton} onClick={() => onSelectProduct(1)} >
          <Paper elevation={1} className={classes.fullPaper}>
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
          </Paper>
        </ButtonBase>
      </Grid>
    )
  }
}

export default withStyles(styles)(GridSelect)


