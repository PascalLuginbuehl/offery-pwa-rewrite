
import { createStyles, Grid, Theme, WithStyles, withStyles, Table, TableHead, TableCell, TableRow, TableBody, IconButton, Typography, Tabs, Tab, ListItem, List, Avatar, ListItemText, ListItemSecondaryAction, Collapse } from '@material-ui/core'
import * as React from 'react'
import { ILead } from '../../interfaces/ILead';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye'
import ContactsIcon from '@material-ui/icons/Contacts'
import { NavLink } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add'
import { green } from '@material-ui/core/colors';
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { IOfflineLead } from '../../routes/Dashboard';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver'
import HomeIcon from '@material-ui/icons/Home'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ArchiveIcon from '@material-ui/icons/Archive'


const styles = (theme: Theme) =>
  createStyles({
    noLink: {
      textDecoration: "none",
      color: "inherit",
    },
    root: {
      padding: 0
    },
    nested: {
      paddingTop: 0,
      paddingBottom: 0,
    },

    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })

interface State {
  openListActions: number | null
}

interface Props extends WithStyles<typeof styles>, InjectedIntlProps {
  leads: IOfflineLead[]
}

class TableDashboard extends React.Component<Props, State> {
  state: State = {
    openListActions: null,
  }

  public render() {
    const { openListActions } = this.state
    const { classes, leads, intl } = this.props

    return (
      <>
        <List className={classes.root} >
          {leads.map(({Lead: lead}) => (
            <>
              <ListItem key={lead.LeadId} disableGutters>

                <Avatar style={{ backgroundColor: green[500] }}>
                  <RemoveRedEyeIcon fontSize="small" />
                </Avatar>

                <ListItemText primary={lead.Customer.Firstname + " " + lead.Customer.Lastname} secondary={lead.VisitDate ? intl.formatDate(lead.VisitDate, { year: "numeric", month:"long", day: "2-digit" }) : null} />

                <ListItemSecondaryAction>
                  <IconButton onClick={() => this.setState({ openListActions: openListActions === lead.LeadId ? null : lead.LeadId })}>
                    {openListActions === lead.LeadId ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Collapse in={openListActions === lead.LeadId} timeout="auto" unmountOnExit>
                <List disablePadding>
                  <ListItem className={classes.nested} selected>
                    <NavLink to={`/lead/${lead.LeadId}/customer`}><IconButton><RemoveRedEyeIcon fontSize="small" /></IconButton></NavLink>


                    <Collapse in={openListActions === lead.LeadId} timeout="auto" unmountOnExit>
                      <IconButton><RecordVoiceOverIcon fontSize="small" /></IconButton>
                      <IconButton><HomeIcon fontSize="small" /></IconButton>
                      <IconButton><MonetizationOnIcon fontSize="small" /></IconButton>
                      <IconButton><CheckCircleIcon fontSize="small" /></IconButton>
                      <IconButton><ArchiveIcon fontSize="small" /></IconButton>
                    </Collapse>
                  </ListItem>
                </List>
              </Collapse>
            </>))
          }
        </List>

        <NavLink to="/lead/new/customer" className={classes.fab}>
          <Fab color="primary" >
            <AddIcon />
          </Fab>
        </NavLink>
      </>
    )
  }
}

export default injectIntl(withStyles(styles)(TableDashboard))
