import React from "react"
import { Typography, TableHead, TableRow, Table, TableBody, Hidden, List, ListItem, ListItemText } from "@material-ui/core"
import { ILead } from "../../../interfaces/ILead"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import { IntlStyledTableCell, StyledTableCell } from "."
import { FormattedDate } from "react-intl"
import SortHelper from "../../../helpers/SortHelper"
import { makeStyles } from "@material-ui/styles"
import IntlTypography from "../../../components/Intl/IntlTypography"

const useStyles = makeStyles({
  noSpacing: {
    margin: 0,
    // padding: 0,
  },
})

interface StatusHistoryProps {
  lead: ILead
}

export default function StatusHistory(props: StatusHistoryProps) {
  const { lead } = props

  const classes = useStyles()

  return (
    <FormikGroups label="STATUS_HISTORY" xs={12}>
      <Hidden xsDown>
        <Table size="small">
          <TableHead>
            <TableRow>
              <IntlStyledTableCell>STATUS</IntlStyledTableCell>
              <IntlStyledTableCell>DATE</IntlStyledTableCell>
              <IntlStyledTableCell>COMMENT</IntlStyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lead.StatusHistories.sort((a, b) => SortHelper.desc(a, b, "Created")).map(e => (
              <TableRow key={e.StatusHistoryId}>
                <IntlStyledTableCell>{e.Status.NameTextKey}</IntlStyledTableCell>
                <StyledTableCell><FormattedDate value={e.Created} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></StyledTableCell>
                <StyledTableCell>{e.Comment}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Hidden>
      <Hidden smUp>
        <List dense>
          {lead.StatusHistories.sort((a, b) => SortHelper.desc(a, b, "Created")).map(e => (
            <ListItem key={e.StatusHistoryId} dense disableGutters className={classes.noSpacing}>
              <ListItemText
                className={classes.noSpacing}
                primary={
                  <Typography><FormattedDate value={e.Created} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></Typography>
                }
                secondary={
                  <>
                    <IntlTypography
                      variant="body2"
                      color="textPrimary"
                    >
                      {e.Status.NameTextKey}
                    </IntlTypography>

                    <Typography
                      variant="body2"
                    >
                      {e.Comment}
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
