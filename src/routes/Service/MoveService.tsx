import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid } from '@material-ui/core'
import ResponsiveContainer from '../../components/ResponsiveContainer'
// import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import CounterTable, { Cart } from '../../components/ShopElements/CounterTable'
import GridSelect, { GridSelectItem } from '../../components/ShopElements/GridSelect'
import * as React from 'react'
import BigCheckbox from '../../components/Validator/BigCheckbox';
import { withResource, WithResourceProps } from '../../providers/withResource';
import { IPostMoveInBuilding } from '../../interfaces/IBuilding';
import IntlTypography from '../../components/Intl/IntlTypography';
// import TestService from 'services/TestService'

const styles = (theme: Theme) =>
  createStyles({

  })

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  onChange: (data: IPostMoveInBuilding) => void
}

interface State {
  cartSelected: Cart[]
}

class Index extends React.Component<Props, State> {
  public state: State = {
    cartSelected: []
  }

  private handleChange = (value: string, target: string) => {
    this.props.onChange(Object.assign({}, this.props.data, { [target]: value }))
  }

  public render() {

    return (
      <>
        <Grid item xs={12}>
          <IntlTypography variant="h5">SERVICES</IntlTypography>
        </Grid>

        <BigCheckbox name="HasDisposalOutBuilding" value={HasDisposalOutBuilding} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox>


      </>
    )
  }
}

export default withStyles(styles)(withResource(Index))
