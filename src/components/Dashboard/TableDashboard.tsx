import * as React from 'react'
import { green } from '@material-ui/core/colors';
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add'
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye'
import { FormattedDate, FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import ContactsIcon from '@material-ui/icons/Contacts'
import { createStyles, Grid, Theme, WithStyles, withStyles, Table, TableHead, TableCell, TableRow, TableBody, IconButton, Typography, Tabs, Tab, ListItem, List, Avatar, ListItemText, ListItemSecondaryAction, Collapse, TableFooter } from '@material-ui/core'
import IntlTooltip from '../Intl/IntlTooltip';
import { ILead } from '../../interfaces/ILead';
import { IOfflineLead } from '../../routes/Dashboard';
import OfflinePinIcon from '@material-ui/icons/OfflinePin'
import PlainLink from '../PlainLink';
import StatusButton from './StatusButton';


const styles = (theme: Theme) =>
  createStyles({
    positionAddRight: {
      padding: theme.spacing(2),
      textAlign: "right",
    }
  })

interface State {

}

interface Props extends WithStyles<typeof styles> {
  leads: IOfflineLead[]
}

class TableDashboard extends React.Component<Props, State> {

  public render() {
    const { classes, leads } = this.props

    return (
      <>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell variant="head" align="center" padding="none"><FormattedMessage id="ACTIONS" /></TableCell>
              <TableCell variant="head"><FormattedMessage id="CUSTOMER" /></TableCell>
              <TableCell variant="head"><FormattedMessage id="VISITING_DATE" /></TableCell>
              <TableCell variant="head"><FormattedMessage id="START_DESTINATION_ADDRESSES" /></TableCell>
              <TableCell variant="head"><FormattedMessage id="PROJECT_START" /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map(({isCached, Lead}) =>
              <TableRow key={Lead.LeadId}>
                <TableCell padding="none" align="center">
                  <StatusButton lead={{isCached, Lead: Lead}} />
                </TableCell>

                <TableCell>
                  {Lead.Customer.Firstname + " " + Lead.Customer.Lastname}
                </TableCell>
                <TableCell>{Lead.VisitDate ? <FormattedDate year="numeric" month="long" day="2-digit" value={Lead.VisitDate} /> : <FormattedMessage id="NOT_DEFINED" />}</TableCell>
                {/* <TableCell>
                  {Lead.FromAddress ? `${Lead.FromAddress.PLZ} ${Lead.FromAddress.City}` : <FormattedMessage id="NO_ADDRESS" />}
                  &nbsp;/&nbsp;
                  {Lead.ToAddress ? `${Lead.ToAddress.PLZ} ${Lead.ToAddress.City}` : <FormattedMessage id="NO_ADDRESS" />}
                </TableCell> */}

                <TableCell></TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>

        <div className={classes.positionAddRight}>
          <PlainLink to="/lead/new/building">
            <Fab color="primary" size="small">
              <AddIcon fontSize="small" />
            </Fab>
          </PlainLink>
        </div>


      </>
    )
  }
}

export default withStyles(styles)(TableDashboard)
