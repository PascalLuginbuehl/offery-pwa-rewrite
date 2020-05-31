import React from "react"
import { Typography, TableHead, TableRow, Table, TableBody, Hidden, List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core"
import { ILead } from "../../../interfaces/ILead"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import { IntlStyledTableCell, StyledTableCell } from "."
import { FormattedDate } from "react-intl"
import SortHelper from "../../../helpers/SortHelper"
import { makeStyles } from "@material-ui/styles"
import IntlTypography from "../../../components/Intl/IntlTypography"

import MailIcon from "@material-ui/icons/Mail"
import PhonelinkRingIcon from "@material-ui/icons/PhonelinkRing"


const useStyles = makeStyles({
  icon: {
    height: 53,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
  },

  noSpacing: {
    margin: 0,
    // padding: 0,
  },

  errorRow: {
    backgroundColor: "lightpink"
  },
  successRow: {
  }
})

interface ReminderHistory {
  lead: ILead
}

export default function ReminderHistory(props: ReminderHistory) {
  const { lead } = props

  const classes = useStyles()

  if (lead.AppointmentReminders && lead.AppointmentReminders.length > 0) {
    return (
      <FormikGroups label="REMINDER_HISTORY" xs={12}>
        <Hidden xsDown>
          <Table size="small">
            <TableHead>
              <TableRow>
                <IntlStyledTableCell>SENT</IntlStyledTableCell>
                <IntlStyledTableCell>APPOINTMENTTYPE</IntlStyledTableCell>
                <IntlStyledTableCell>DATE</IntlStyledTableCell>
                <IntlStyledTableCell>NOTIFICATIONTYPE</IntlStyledTableCell>
                <IntlStyledTableCell>TO</IntlStyledTableCell>
                <IntlStyledTableCell>ERRORMESSAGE</IntlStyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lead.AppointmentReminders.sort((a, b) => SortHelper.desc(a, b, "Created")).map(e => (
                <TableRow key={e.AppointmentReminderId} className={!e.Succeed ? classes.errorRow : classes.successRow}>
                  <StyledTableCell><FormattedDate value={e.Created} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></StyledTableCell>
                  <IntlStyledTableCell>{e.AppointmentTypeTextKey}</IntlStyledTableCell>
                  <StyledTableCell><FormattedDate value={e.AppointedDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></StyledTableCell>
                  <StyledTableCell>{e.NotificationType}</StyledTableCell>
                  <StyledTableCell>{e.To}</StyledTableCell>
                  <StyledTableCell>{e.ErrorMessage ? e.ErrorMessage : "-"}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Hidden>
        <Hidden smUp>
          <List dense>
            {lead.AppointmentReminders.sort((a, b) => SortHelper.desc(a, b, "Created")).map(e => (
              <ListItem alignItems="flex-start" key={e.AppointmentReminderId} dense disableGutters className={classes.noSpacing}>
                <ListItemIcon className={classes.icon}>
                  {
                    e.NotificationType === "Email" ?
                      <MailIcon />
                      :
                      <PhonelinkRingIcon />
                  }
                </ListItemIcon>
                <ListItemText
                  className={classes.noSpacing}
                  primary={
                    <Typography><FormattedDate value={e.Created} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2">
                        <IntlTypography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          {e.AppointmentTypeTextKey}
                        </IntlTypography>
                        &nbsp;
                        <FormattedDate value={e.AppointedDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" />
                      </Typography>

                      <Typography
                        variant="body2"
                      >
                        {e.To}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}

          </List>
        </Hidden>
      </FormikGroups>

    )
  }

  return <Typography></Typography>

}
