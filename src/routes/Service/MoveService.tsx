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
import { IPostMoveService } from '../../interfaces/IService';
import ValidatedDatePicker from '../../components/Validator/ValidatedDatePicker';
// import TestService from 'services/TestService'

const styles = (theme: Theme) =>
  createStyles({

  })

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  onChange: (data: IPostMoveService) => void
  data: IPostMoveService
  save: () => Promise<void>
}

class Index extends React.Component<Props, {}> {

  private handleChange = (value: string, target: string) => {
    // this.props.onChange(Object.assign({}, this.props.data, { [target]: value }))
  }

  public render() {
    const { BoreService, DeMontageService, FurnitureLiftService, LampDemontageService, MontageService, MoveDate, PianoService } = this.props.data
    return (
      <>
        <Grid item xs={12}>
          <IntlTypography variant="h5">SERVICES</IntlTypography>
        </Grid>

        <BigCheckbox name="BoreService" value={BoreService} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox>

        <BigCheckbox name="DeMontageService" value={DeMontageService} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox>


        <BigCheckbox name="FurnitureLiftService" value={FurnitureLiftService} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox>

        <BigCheckbox name="LampDemontageService" value={LampDemontageService} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox>

        <BigCheckbox name="MontageService" value={MontageService} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox>

        <BigCheckbox name="PianoService" value={PianoService} onChange={this.handleChange}>
          DISPOSAL_BUILDING
        </BigCheckbox>

        <ValidatedDatePicker name="MoveDate" value={MoveDate} onChange={this.handleChange} label="" />


      </>
    )
  }
}

export default withStyles(styles)(withResource(Index))
