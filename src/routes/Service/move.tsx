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
  public state: State = {
    cartSelected: []
  }


  public render() {

    return (
      <>

      </>
    )
  }
}

export default withStyles(styles)(Index)
