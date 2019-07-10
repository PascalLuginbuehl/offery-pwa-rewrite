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
              <TableCell align="center" padding="none">
                <OfflinePinIcon fontSize="small" />
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
                  <TableCell padding="none">
                    <StatusButton lead={{isCached, Lead: lead}} />
                  </TableCell>

                  <TableCell>
                    {lead.Customer.Firstname + " " + lead.Customer.Lastname}
                  </TableCell>
                  <TableCell>{lead.VisitDate ? <FormattedDate year="numeric" month="long" day="2-digit" value={lead.VisitDate} /> : <FormattedMessage id="NOT_DEFINED" />}</TableCell>
                  <TableCell>
                    {lead.FromAddress ? `${lead.FromAddress.PLZ} ${lead.FromAddress.City}` : <FormattedMessage id="NO_ADDRESS" />}
                    &nbsp;/&nbsp;
                    {lead.ToAddress ? `${lead.ToAddress.PLZ} ${lead.ToAddress.City}` : <FormattedMessage id="NO_ADDRESS" />}
                  </TableCell>

                  <TableCell></TableCell>

                  <TableCell padding="checkbox" style={{whiteSpace: "nowrap"}} align="center">
                    <PlainLink to={`/lead/${lead.LeadId}/building`}>
                      <IntlTooltip title="SHOW_LEAD">
                        <IconButton><RemoveRedEyeIcon fontSize="small" /></IconButton>
                      </IntlTooltip>
                    </PlainLink>
                  </TableCell>
                </TableRow>
              )
            })}

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
