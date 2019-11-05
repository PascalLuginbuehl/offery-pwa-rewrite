import { createStyles, Grid, Theme, WithStyles, withStyles, IconButton, ButtonBase, Paper, InputAdornment, TextField as MuiTextfield, Typography } from '@material-ui/core'
import * as React from 'react'
import { IProduct } from '../../interfaces/IProduct'
import IntlTypography from '../Intl/IntlTypography';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Filter9PlusIcon from '@material-ui/icons/Filter9Plus'
import { thisExpression } from '@babel/types';
import { TextFieldProps } from '@material-ui/core/TextField';
import { CurrentlyOpenStateEnum } from '../../interfaces/IShop';
import { IFurnitureCategory, IFurniture } from '../../interfaces/IResource';

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
  })

interface State {

}

interface Props extends WithStyles<typeof styles> {
  onSelect: () => void
  furniture: IFurniture
}

class InventoryItems extends React.Component<Props, State> {
  state: State = {

  }

  handleOpenAmount = (event: React.SyntheticEvent) => {
    event.stopPropagation()

    this.setState({ amountOpen: 1 })
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const prasedNumber: number = parseInt(event.target.value)

    if (prasedNumber !== NaN) {
      this.setState({ amount: prasedNumber })
    }
  }

  public render() {
    const { classes, furniture, onSelect } = this.props

    return (
      <Grid item xs={4} sm={3} md={2} lg={2} >
        <ButtonBase className={classes.fullButton}>
          <Paper elevation={1} className={classes.fullPaper} onClick={() => onSelect()}>
            <IntlTypography variant="h6">{furniture.NameTextKey}</IntlTypography>

            {furniture.FMaterials.map(e => e.NameTextKey)}

            {furniture.FSizes.map(e => e.NameTextKey)}
          </Paper>
        </ButtonBase>
      </Grid>
    )
  }
}

export default withStyles(styles)(InventoryItems)

