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
import { createStyles, Grid, Theme, WithStyles, withStyles, Table, TableHead, TableCell, TableRow, TableBody, IconButton, Typography, Tabs, Tab, ListItem, List, Avatar, ListItemText, ListItemSecondaryAction, Collapse, TableFooter } from '@material-ui/core'
import IntlTooltip from '../Intl/IntlTooltip';
import { ILead } from '../../interfaces/ILead';
import { IOfflineLead } from '../../routes/Dashboard';
import OfflinePinIcon from '@material-ui/icons/OfflinePin'


const styles = (theme: Theme) =>
  createStyles({

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
              <TableCell>
                <OfflinePinIcon/>
              </TableCell>
              <TableCell><FormattedMessage id="CUSTOMER" /></TableCell>
              <TableCell><FormattedMessage id="VISITING_DATE" /></TableCell>
              <TableCell><FormattedMessage id="START_DESTINATION_ADDRESSES" /></TableCell>
              <TableCell><FormattedMessage id="PROJECT_START" /></TableCell>
              <TableCell><FormattedMessage id="ACTIONS" /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map(({isCached, Lead: lead}) => {
              return (
                <TableRow key={lead.LeadId}>
                  <TableCell component="th" scope="row">

                    {isCached ? (
                      <IntlTooltip title="LOADED_FROM_CACHE">
                        <OfflinePinIcon color="primary" />
                      </IntlTooltip>
                      ) : null
                    }
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {lead.Customer.Firstname + " " + lead.Customer.Lastname}
                  </TableCell>
                  <TableCell>{lead.VisitDate ? <FormattedDate value={lead.VisitDate} /> : <FormattedMessage id="NOT_DEFINED" />}</TableCell>
                  <TableCell>
                    {lead.FromAddress ? `${lead.FromAddress.PLZ} ${lead.FromAddress.City}` : <FormattedMessage id="NO_ADDRESS" />}
                    &nbsp;/&nbsp;
                    {lead.ToAddress ? `${lead.ToAddress.PLZ} ${lead.ToAddress.City}` : <FormattedMessage id="NO_ADDRESS" />}
                  </TableCell>

                  <TableCell></TableCell>

                  <TableCell padding="checkbox" style={{whiteSpace: "nowrap"}} align="center">
                    <NavLink to={`/lead/${lead.LeadId}/building`}>
                      <IntlTooltip title="SHOW_LEAD">
                        <IconButton><RemoveRedEyeIcon fontSize="small" /></IconButton>
                      </IntlTooltip>
                    </NavLink>
                  </TableCell>
                </TableRow>
              )
            })}

          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell variant="footer" />
              <TableCell variant="footer" />
              <TableCell variant="footer" />
              <TableCell variant="footer" />
              <TableCell variant="footer" />

              <TableCell variant="footer" align="right">
                <NavLink to="/lead/new/building">
                  <Fab color="primary" size="small">
                    <AddIcon fontSize="small" />
                  </Fab>
                </NavLink>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>


      </>
    )
  }
}

export default withStyles(styles)(TableDashboard)
