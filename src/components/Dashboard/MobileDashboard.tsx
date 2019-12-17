import {
  createStyles,
  Grid,
  Theme,
  WithStyles,
  withStyles,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  IconButton,
  Typography,
  Tabs,
  Tab,
  ListItem,
  List,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  ListItemAvatar,
} from "@material-ui/core"
import * as React from "react"
import { ILead } from "../../interfaces/ILead"
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye"
import ContactsIcon from "@material-ui/icons/Contacts"
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import { green } from "@material-ui/core/colors"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import { injectIntl, InjectedIntlProps } from "react-intl"
import { IOfflineLead } from "../../routes/Dashboard"
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver"
import HomeIcon from "@material-ui/icons/Home"
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ArchiveIcon from "@material-ui/icons/Archive"
import ControlPointDuplicateIcon from "@material-ui/icons/ControlPointDuplicate"

import PlainLink from "../PlainLink"
import StatusButton from "./StatusButton"
import IntlTooltip from "../Intl/IntlTooltip"


const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
    },
    nested: {
      paddingTop: 0,
      paddingBottom: 0,
    },

    fab: {
      position: "fixed",
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

class MobileDashboard extends React.Component<Props, State> {
  state: State = {
    openListActions: null,
  }

  public render() {
    const { openListActions } = this.state
    const { classes, leads, intl } = this.props

    return (
      <>
        <List className={classes.root}>
          {leads.map(({ isCached, Lead: lead }) => (
            <div key={lead.LeadId}>
              <PlainLink to={`/lead/${lead.LeadId}/building`}>
                <ListItem disableGutters>
                  <ListItemAvatar>
                    <StatusButton lead={{ isCached, Lead: lead }} />
                  </ListItemAvatar>

                  <ListItemText
                    primary={lead.Customer.Firstname + " " + lead.Customer.Lastname}
                    secondary={lead.VisitDate ? intl.formatDate(lead.VisitDate, { year: "numeric", month: "long", day: "2-digit" }) : null}
                  />
                </ListItem>
              </PlainLink>
            </div>
          ))}
        </List>

        <PlainLink to="/lead/new/building" className={classes.fab}>
          <Fab color="primary">
            <AddIcon />
          </Fab>
        </PlainLink>
      </>
    )
  }
}

export default injectIntl(withStyles(styles)(MobileDashboard))
