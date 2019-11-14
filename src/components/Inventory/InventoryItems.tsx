import { createStyles, Grid, Theme, WithStyles, withStyles, IconButton, ButtonBase, Paper, InputAdornment, TextField as MuiTextfield, Typography, ButtonGroup, Button, Switch, Collapse } from '@material-ui/core'
import * as React from 'react'
import { IProduct } from '../../interfaces/IProduct'
import IntlTypography from '../Intl/IntlTypography';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Filter9PlusIcon from '@material-ui/icons/Filter9Plus'
import { thisExpression } from '@babel/types';
import { TextFieldProps } from '@material-ui/core/TextField';
import { CurrentlyOpenStateEnum } from '../../interfaces/IShop';
import { IFurnitureCategory, IFurniture } from '../../interfaces/IResource';
import { IFSize, IFMaterial } from '../../interfaces/IInventars';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
    },
    fullButton: {
      width: "100%"
    },
    fullPaper: {
      width: "100%",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    moreButton: {
      position: "absolute",
      right: 0,
      top: 0,
    }
  })

interface State {
  moreOpen: boolean
  selectedMaterialId: number | null
  selectedSizeId: number | null
}

interface Props extends WithStyles<typeof styles> {
  onSelect: () => void
  furniture: IFurniture
}

class InventoryItems extends React.Component<Props, State> {
  state: State = {
    moreOpen: false,
    selectedSizeId: null,
    selectedMaterialId: null,
  }

  // handleOpenAmount = (event: React.SyntheticEvent) => {
  //   event.stopPropagation()

  //   this.setState({ amountOpen: 1 })
  // }

  // handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const prasedNumber: number = parseInt(event.target.value)

  //   if (prasedNumber !== NaN) {
  //     this.setState({ amount: prasedNumber })
  //   }
  // }

  toggleMore = (event: React.MouseEvent) => {
    this.setState({ moreOpen: !this.state.moreOpen})
    event.stopPropagation()
  }

  public render() {
    const { classes, furniture, onSelect } = this.props
    const { moreOpen, selectedSizeId, selectedMaterialId } = this.state

    return (
      <>
        <Grid item xs={4} sm={3} md={3} lg={2} className={classes.root}>
          <ButtonBase className={classes.fullButton}>
            <Paper elevation={1} className={classes.fullPaper} onClick={() => onSelect()}>
              <IntlTypography >{furniture.NameTextKey}</IntlTypography>
            </Paper>
          </ButtonBase>

          {furniture.FMaterials.length > 0 || furniture.FSizes.length > 0 ?
            <IconButton className={classes.moreButton} size="small" onClick={this.toggleMore}>
              <MoreVertIcon />
            </IconButton>
            : null}
        </Grid>

        { moreOpen ? (
          <Grid item xs={12}>
            <Collapse in={moreOpen}>
              <Paper elevation={1} className={classes.fullPaper} onClick={() => onSelect()}>
                <ButtonGroup>
                  {furniture.FMaterials.map((e, index) => {
                    if (e.FMaterialId == selectedMaterialId) {
                      return <Button key={index} color="primary"><FormattedMessage id={e.NameTextKey} /></Button>
                    } else {
                      return <Button key={index} onClick={() => this.setState({selectedMaterialId: e.FMaterialId})}><FormattedMessage id={e.NameTextKey} /></Button>
                    }
                  }
                  )}
                </ButtonGroup>

                <br />

                <ButtonGroup>
                  {furniture.FSizes.map((e, index) => {
                    if (e.FSizeId == selectedSizeId) {
                      return <Button key={index} color="primary"><FormattedMessage id={e.NameTextKey} /></Button>
                    } else {
                      return <Button key={index} onClick={() => this.setState({ selectedSizeId: e.FSizeId })}><FormattedMessage id={e.NameTextKey} /></Button>
                    }
                  }
                  )}
                </ButtonGroup>


                <Button><FormattedMessage id="ADD" /></Button>
              </Paper>
            </Collapse>
          </Grid>
        ) : null}
      </>
    )
  }
}

export default withStyles(styles)(InventoryItems)


