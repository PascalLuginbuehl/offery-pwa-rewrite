import { createStyles, Grid, Theme, WithStyles, withStyles, IconButton, ButtonBase, Paper, InputAdornment, TextField as MuiTextfield } from '@material-ui/core'
import * as React from 'react'
import CheckGrid from './CheckGrid'
import { IProduct } from '../../interfaces/IProduct'
import IntlTypography from '../Intl/IntlTypography';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Filter9PlusIcon from '@material-ui/icons/Filter9Plus'

const styles = (theme: Theme) =>
  createStyles({
    root: {

    },
  })

interface State {
 amount: number
}

interface Props extends WithStyles<typeof styles> {
  onSelectProduct: (amount: number) => void
  product: IProduct
}

class GridSelect extends React.Component<Props, State> {
  state: State = {
    amount: 1
  }

  public render() {
    const { classes, product, onSelectProduct } = this.props
    const { amount } = this.state

    return (
      <Grid item xs={4} sm={3} md={2} lg={2}>
        <ButtonBase>
          <Paper elevation={1} onClick={() => onSelectProduct(amount)}>

            <IconButton
              onClick={(event) => event.stopPropagation()}
            >
              <Filter9PlusIcon />
            </IconButton>
            <IntlTypography variant="h6">{product.NameTextKey}</IntlTypography>



            <IntlTypography variant="body2">
              <FormattedMessage id={"BUY"} />
              :&nbsp;
              <FormattedNumber
                value={product.RentPrice}
                style="currency"
                currency="CHF"
              />
            </IntlTypography>


            <IntlTypography variant="body2">
              <FormattedMessage id={"RENT"} />
              :&nbsp;
              <FormattedNumber
                value={product.SellPrice}
                style="currency"
                currency="CHF"
              />
            </IntlTypography>

            <MuiTextfield
              type="number"
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
          </Paper>
        </ButtonBase>
      </Grid>
    )
  }
}

export default withStyles(styles)(GridSelect)


