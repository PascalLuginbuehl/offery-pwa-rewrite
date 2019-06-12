import * as React from 'react'
import { green } from '@material-ui/core/colors';
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { NavLink } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add'
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye'
import { FormattedDate, FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import ContactsIcon from '@material-ui/icons/Contacts'
import { createStyles, Grid, Theme, WithStyles, withStyles, Table, TableHead, TableCell, TableRow, TableBody, IconButton, Typography, Tabs, Tab, ListItem, List, Avatar, ListItemText, ListItemSecondaryAction, Collapse } from '@material-ui/core'
import IntlTooltip from '../Intl/IntlTooltip';
import { ILead } from '../../interfaces/ILead';

const styles = (theme: Theme) =>
  createStyles({
    progress: {
      position: "absolute",
      left: "calc(50% - 20px)",
      top: "calc(50% - 20px)",
      // position: 'fixed',
      // bottom: theme.spacing.unit * 2,
      // right: theme.spacing.unit * 3,
    },
  })

interface State {

}

interface Props extends WithStyles<typeof styles> {
  leads: ILead[]
}

class TableDashboard extends React.Component<Props, State> {

  public render() {
    const { classes, leads } = this.props

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><FormattedMessage id="CUSTOMER" /></TableCell>
            <TableCell><FormattedMessage id="VISITING_DATE" /></TableCell>
            <TableCell><FormattedMessage id="START_DESTINATION_ADDRESSES" /></TableCell>
            <TableCell><FormattedMessage id="PROJECT_START" /></TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map(lead => {
            return (
              <TableRow key={lead.LeadId}>
                <TableCell component="th" scope="row">
                  {lead.Customer.Firstname + " " + lead.Customer.Lastname}
                </TableCell>
                <TableCell>{lead.VisitDate ? <FormattedDate value={lead.VisitDate} /> : <FormattedMessage id="NOT DEFINED" />}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>

                <TableCell padding="checkbox">
                  <IntlTooltip title="SHOW_LEAD"><NavLink to={`/lead/${lead.LeadId}/customer`}><IconButton><RemoveRedEyeIcon fontSize="small" /></IconButton></NavLink></IntlTooltip>
                  <IconButton><ContactsIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            )
          })}
          <TableRow>
            <TableCell padding="checkbox">
              <NavLink to="/lead/new/customer">
                <Fab color="primary" size="small">
                  <AddIcon fontSize="small" />
                </Fab>
              </NavLink>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }
}

export default withStyles(styles)(TableDashboard)
