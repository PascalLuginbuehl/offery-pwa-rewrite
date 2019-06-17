import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles } from '@material-ui/core'
import ResponsiveContainer from '../../components/ResponsiveContainer'
// import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import CounterTable, { Cart } from '../../components/ShopElements/CounterTable'
import GridSelect, { GridSelectItem } from '../../components/ShopElements/GridSelect'
import * as React from 'react'
// import TestService from 'services/TestService'

const styles = (theme: Theme) =>
  createStyles({
    floatingButton: {
      position: "fixed",
      bottom: 10,
      right: 10,
    }
  })


interface State {
  cartSelected: Cart[]
}

class Index extends React.Component<WithStyles<typeof styles>, State> {

  public static options = [{
    id: "chair",
    name: "Stuhl",
  }, {
    id: "table",
    name: "Tisch"
  }, {
    id: "test1",
    name: "Test1",
  }, {
    id: "test2",
    name: "Test2"
  }, {
    id: "test3",
    name: "Test3"
  }, {
    id: "test4",
    name: "Test4"
  }, {
    id: "test5",
    name: "Test7"
  }]

  public state: State = {
    cartSelected: []
  }

  public addToCart = (item: GridSelectItem) => {
    const cartSelected = [...this.state.cartSelected]

    const itemIndex = cartSelected.findIndex(e => e.id == item.id)

    if (itemIndex !== -1) {
      const original = cartSelected[itemIndex]

      cartSelected.splice(itemIndex, 1)
      const newItem = Object.assign({}, original, { quantity: original.quantity + 1 })

      cartSelected.unshift(newItem)
    } else {
      cartSelected.unshift({ id: item.id, name: item.name, quantity: 1 })
    }


    this.setState({ cartSelected })
  }

  public render() {
    // const { classes } = this.props
    const { cartSelected } = this.state

    // TestService.fetchStuff()

    return (
      <ResponsiveContainer>

        <GridSelect options={Index.options} onSelect={this.addToCart} />

        <Tabs
          value={0}
          // onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          // fullWidth
          centered
        >
          <Tab label="Umzug" />
          <Tab label="Enstorgung" />
          <Tab label="Lager" />
        </Tabs>

        <CounterTable cart={cartSelected} />

        {/* <div>
          <Button variant="fab" color="primary" aria-label="Next" className={classes.floatingButton}>
            <NavigateNextIcon />
          </Button>
        </div> */}

        {/* <NextDial /> */}
      </ResponsiveContainer>
    )
  }
}

export default withStyles(styles)(Index)
