import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
  ListItem,
  List,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  ListItemAvatar,
} from "@material-ui/core"
import * as React from "react"
import { ILead, ICompressedLead } from "../../interfaces/ILead"
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye"
import ContactsIcon from "@material-ui/icons/Contacts"
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import { green } from "@material-ui/core/colors"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import { injectIntl, WrappedComponentProps } from "react-intl"
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

interface Props extends WithStyles<typeof styles>, WrappedComponentProps {
  leads: ICompressedLead[]
}

class MobileDashboard extends React.Component<Props, State> {
  state: State = {
    openListActions: null,
  }

  public render() {
    const { openListActions } = this.state
    const { classes, intl } = this.props
    const leads = this.props.leads.sort((a,b)=>a.Created.getTime()-b.Created.getTime()).reverse()

    return (
      <>
        <List className={classes.root}>
          {leads.map((lead) => (
            <div key={lead.LeadId}>
              <PlainLink to={`/lead/${lead.LeadId}/building`}>
                <ListItem disableGutters>
                  <ListItemAvatar>
                    <StatusButton lead={lead} />
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
