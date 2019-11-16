import { createStyles, Grid, Theme, WithStyles, withStyles, IconButton, ButtonBase, Paper, InputAdornment, TextField as MuiTextfield, Typography } from '@material-ui/core'
import * as React from 'react'
import CheckGrid from './CheckGrid'
import { IProduct } from '../../interfaces/IProduct'
import IntlTypography from '../Intl/IntlTypography';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Filter9PlusIcon from '@material-ui/icons/Filter9Plus'
import { thisExpression } from '@babel/types';
import { TextFieldProps } from '@material-ui/core/TextField';
import { CurrentlyOpenStateEnum } from '../../interfaces/IShop';

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
  amount: number
  amountOpen: boolean
}

interface Props extends WithStyles<typeof styles> {
  onSelectProduct: (amount: number) => void
  product: IProduct
  currentlyOpenState: CurrentlyOpenStateEnum
}

class GridSelect extends React.Component<Props, State> {
  state: State = {
    amount: 1,
    amountOpen: false,
  }

  handleOpenAmount = (event: React.SyntheticEvent) => {
    event.stopPropagation()

    this.setState({amountOpen: !this.state.amountOpen})
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const prasedNumber: number = parseInt(event.target.value)

    if (prasedNumber !== NaN) {
      this.setState({ amount: prasedNumber})
    }
  }

  public render() {
    const { classes, product, onSelectProduct, currentlyOpenState } = this.props
    const { amount, amountOpen } = this.state

    return (
      <Grid item xs={4} sm={3} md={2} lg={2} >
        {/* Button exported into better position so it isn't child of something */}
        {/* <IconButton
          onClick={this.handleOpenAmount}
          className={classes.buttonCorner}
        >
          <Filter9PlusIcon />
        </IconButton> */}

        <ButtonBase className={classes.fullButton}>
          <Paper elevation={1} onClick={() => onSelectProduct(amount)} className={classes.fullPaper}>
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


            { amountOpen ?
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
            : null }
          </Paper>
        </ButtonBase>
      </Grid>
    )
  }
}

export default withStyles(styles)(GridSelect)


