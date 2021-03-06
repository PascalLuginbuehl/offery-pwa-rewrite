import { createStyles, Grid, Theme, WithStyles, withStyles,  ButtonBase, Paper } from "@material-ui/core"
import * as React from "react"
import IntlTypography from "../Intl/IntlTypography"

import { IFurnitureCategory } from "../../interfaces/IResource"

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
  category: IFurnitureCategory
}

class InventoryCategoryFolder extends React.Component<Props, State> {
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
    const { classes, category, onSelect } = this.props

    return (
      <Grid item xs={4} sm={3} md={2} lg={2} >
        <ButtonBase className={classes.fullButton}>
          <Paper elevation={1} className={classes.fullPaper} onClick={() => onSelect()}>
            <IntlTypography>{category.NameTextKey}</IntlTypography>
          </Paper>
        </ButtonBase>
      </Grid>
    )
  }
}

export default withStyles(styles)(InventoryCategoryFolder)


