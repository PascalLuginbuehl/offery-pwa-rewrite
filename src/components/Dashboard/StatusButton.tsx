import {  Theme, Avatar,  Icon } from "@material-ui/core"
import * as React from "react"
import {  IStatus, ICompressedLead } from "../../interfaces/ILead"
import {  red, grey, blue, green } from "@material-ui/core/colors"
import { makeStyles } from "@material-ui/styles"
import { ReactComponent as CheckIcon } from "./StatusIcons/check.svg"
import { ReactComponent as ClearIcon } from "./StatusIcons/clear-button.svg"
import { ReactComponent as DoubleCheckIcon } from "./StatusIcons/double-checking.svg"
import { ReactComponent as PersonIcon } from "./StatusIcons/person.svg"
import { ReactComponent as SurveillanceIcon } from "./StatusIcons/surveillance.svg"
import { ReactComponent as InvoiceIcon } from "./StatusIcons/invoice.svg"
import { ReactComponent as FileCheckIcon } from "./StatusIcons/file-check.svg"
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye"
import IntlTooltip from "../Intl/IntlTooltip"

const useStyles = makeStyles((theme: Theme) => ({
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
}))

interface Props {
  lead: ICompressedLead
}

export default function StatusButton(props: Props) {
  const classes = useStyles()
  const { lead } = props


  // 0: { StatusId: 1, NameTextKey: "Offen (Kunde erfasst)" }
  // 1: { StatusId: 2, NameTextKey: "Kundendaten-Erfragung versandt" }
  // 2: { StatusId: 3, NameTextKey: "Richtofferte versandt" }
  // 3: { StatusId: 4, NameTextKey: "Besichtigungsbestätigung versandt" }
  // 4: { StatusId: 5, NameTextKey: "Offerte versandt" }
  // 5: { StatusId: 6, NameTextKey: "Auftragszusage erhalten" }
  // 6: { StatusId: 7, NameTextKey: "Auftrag bestätigt" }
  // 7: { StatusId: 13, NameTextKey: "Auftrag durchgeführt" }
  // 8: { StatusId: 15, NameTextKey: "Absage erhalten" }
  // 9: { StatusId: 16, NameTextKey: "Teilzahlung erhalten" }
  // 10: { StatusId: 17, NameTextKey: "Gesamt-Zahlung erhalten" }
  // 11: { StatusId: 18, NameTextKey: "Abgeschlossen" }


  function getBeloningStatusIconAndLink(lastStatus: IStatus): { icon: React.ReactNode; color: string; link: string } {

    switch (lastStatus.StatusId) {
      case 1:
      case 2:
        return {
          icon: <Icon fontSize="small"><PersonIcon height="20" width="20" fill="white" /></Icon>,
          color: blue[700],
          link: "/building",
        }

      case 3:
        // File
        break


      case 4:
        return {
          icon: <Icon fontSize="small"><SurveillanceIcon height="20" width="20" fill="white" /></Icon>,
          color: grey[700],
          link: "/building",
        }

      case 5:
        // Offer Sent
        //File With O
        break

      case 6:
      case 7:
        // File with Check
        return {
          icon: <Icon fontSize="small"><FileCheckIcon height="20" width="20"  fill="white" /></Icon>,
          color: green["A400"],
          link: "/building",
        }

      case 13:
        return {
          icon: <Icon fontSize="small"><CheckIcon height="20" width="20" fill="white" /></Icon>,
          color: green[800],
          link: "/building",
        }

      case 15:
        return {
          icon: <Icon fontSize="small"><ClearIcon height="20" width="20" fill="white" /></Icon>,
          color: red[500],
          link: "/building",
        }

      case 16:
        // Payment
        return {
          icon: <Icon fontSize="small"><InvoiceIcon height="20" width="20" fill="white" /></Icon>,
          color: green[500],
          link: "/building",
        }

      case 17:
      case 18:
        return {
          icon: <Icon fontSize="small"><DoubleCheckIcon height="20" width="20" fill="white" /></Icon>,
          color: grey[800],
          link: "/building",
        }

      default:
        break
    }


    return {
      icon: <RemoveRedEyeIcon fontSize="small" />,
      color: grey[900],
      link: "/building",
    }
  }




  const { color, icon, link } = getBeloningStatusIconAndLink(lead.Status)



  return (
    <IntlTooltip title={lead.Status.NameTextKey}>
      <Avatar style={{ backgroundColor: color }}>{icon}</Avatar>
    </IntlTooltip>
  )
}
