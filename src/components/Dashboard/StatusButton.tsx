import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
  Avatar,
  ButtonBase,
} from "@material-ui/core"
import * as React from "react"
import {  IStatus, ICompressedLead } from "../../interfaces/ILead"
import {  red } from "@material-ui/core/colors"
import { injectIntl, WrappedComponentProps } from "react-intl"
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver"


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

interface Props extends WithStyles<typeof styles>, WrappedComponentProps {
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
      <ButtonBase className={classes.round}>
        <Avatar style={{ backgroundColor: color }}>{icon}</Avatar>
      </ButtonBase>

    /*{ {isCached ? (
          <IntlTooltip title="LOADED_FROM_CACHE">
            <OfflinePinIcon color="primary" fontSize="small" className={classes.topRight} />
          </IntlTooltip>
        ) : null} }*/
    )
  }
}

export default injectIntl(withStyles(styles)(TableDashboard))
