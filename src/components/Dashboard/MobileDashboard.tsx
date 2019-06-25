
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

const styles = (theme: Theme) =>
  createStyles({
    noLink: {
      textDecoration: "none",
      color: "inherit",
    },
    root: {
      padding: theme.spacing(2)
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
  leads: ILead[]
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
        <List className={classes.root}>
          {leads.map(lead => (
            <>
              <ListItem key={lead.LeadId} disableGutters>
                <Avatar style={{ backgroundColor: green[500] }}>
                  <RemoveRedEyeIcon fontSize="small" />
                </Avatar>
                <ListItemText primary={lead.Customer.Firstname + " " + lead.Customer.Lastname} secondary={lead.VisitDate ? intl.formatDate(lead.VisitDate) : null} />
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
                    <IconButton><ContactsIcon fontSize="small" /></IconButton>
                    <IconButton><ContactsIcon fontSize="small" /></IconButton>
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

export default withStyles(styles)(injectIntl(TableDashboard))
