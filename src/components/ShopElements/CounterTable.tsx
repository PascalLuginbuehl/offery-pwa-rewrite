import { createStyles, Table, TableBody, TableCell, TableHead, TableRow, Theme, WithStyles, withStyles } from '@material-ui/core'
import * as React from 'react'

const styles = (theme: Theme) =>
  createStyles({
    table: {

    },
  })

const CustomTableRow = withStyles(theme => ({
  [theme.breakpoints.down("sm")]: {
    root: {
      height: 24,
    },
  }
}))(TableRow)

export interface Cart {
  id: string
  name: string
  quantity: number
}

interface Props extends WithStyles<typeof styles> {
  cart: Array<Cart>
  // value: string
}

class CounterTable extends React.Component<Props, {}> {

  public render() {
    const { classes, cart } = this.props

    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">QT.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map((item, index) =>
            <CustomTableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
            </CustomTableRow>
          )}

        </TableBody>
      </Table>
    )
  }
}

export default withStyles(styles)(CounterTable)
