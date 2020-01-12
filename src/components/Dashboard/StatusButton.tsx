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
  ButtonBase,
} from "@material-ui/core"
import * as React from "react"
import { ILead, IStatus, ICompressedLead } from "../../interfaces/ILead"
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye"
import ContactsIcon from "@material-ui/icons/Contacts"
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import { green, red } from "@material-ui/core/colors"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import { injectIntl, InjectedIntlProps } from "react-intl"
import { IOfflineLead } from "../../routes/Dashboard2"
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver"
import HomeIcon from "@material-ui/icons/Home"
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ArchiveIcon from "@material-ui/icons/Archive"
import PlainLink from "../PlainLink"
import OfflinePinIcon from "@material-ui/icons/OfflinePin"
import IntlTooltip from "../Intl/IntlTooltip"

const styles = (theme: Theme) =>
  createStyles({
    round: {
      borderRadius: "50%",
    },
    relative: {
      position: "relative",
    },
    topRight: {
      position: "absolute",
      right: -8,
      top: -15,
      backgroundColor: "white",
      borderRadius: "50%",
    },
  })

interface Props extends WithStyles<typeof styles>, InjectedIntlProps {
  lead: ICompressedLead
}

class TableDashboard extends React.Component<Props> {
  getBeloningStatusIconAndLink(lastStatus: IStatus): { icon: React.ReactNode; color: string; link: string } {
    if (lastStatus.StatusId == 1) {
      return {
        icon: <RecordVoiceOverIcon fontSize="small" />,
        color: red[500],
        link: "/building",
      }
    }

    return {
      icon: <RecordVoiceOverIcon fontSize="small" />,
      color: "red",
      link: "/building",
    }
    // green[500]
    {
      /* <IconButton><HomeIcon fontSize="small" /></IconButton>
            <IconButton><MonetizationOnIcon fontSize="small" /></IconButton>
            <IconButton><CheckCircleIcon fontSize="small" /></IconButton>
            <IconButton><ArchiveIcon fontSize="small" /></IconButton> */
    }
  }

  public render() {
    const { classes, intl, lead } = this.props

    const { color, icon, link } = this.getBeloningStatusIconAndLink(lead.Status)

    return (
      <PlainLink to={`/lead/${lead.LeadId}${link}`} className={classes.relative}>
        <ButtonBase className={classes.round}>
          <Avatar style={{ backgroundColor: color }}>{icon}</Avatar>
        </ButtonBase>

        {/* {isCached ? (
          <IntlTooltip title="LOADED_FROM_CACHE">
            <OfflinePinIcon color="primary" fontSize="small" className={classes.topRight} />
          </IntlTooltip>
        ) : null} */}
      </PlainLink>
    )
  }
}

export default injectIntl(withStyles(styles)(TableDashboard))
