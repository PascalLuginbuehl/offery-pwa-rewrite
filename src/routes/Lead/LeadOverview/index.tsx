import * as React from "react"
import {  Theme,  withStyles, Grid,         TableCell,     Hidden, createStyles, makeStyles } from "@material-ui/core"

import {     useIntl } from "react-intl"

import PageHeader from "../../../components/PageHeader"

import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import IntlTableCell from "../../../components/Intl/IntlTableCell"

import  { ILeadContainer } from "../LeadAPI"
import { LeadDetailsMobile, LeadDetailsTable } from "./LeadDetails"
import ReminderHistory from "./ReminderHistory"
import StatusHistory from "./StatusHistory"
import OfferOverride from "./OfferOverride"
import OfflineUnavailable from "../../../components/OfflineUnavailable"

const useStyles = makeStyles((theme: Theme) => createStyles({
  positionRelative: {
    position: "relative",
  }
}))

export const StyledTableCell = withStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      padding: "6px 8px 6px 0",
    },
  }
}))(TableCell)

export const IntlStyledTableCell = withStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      padding: "6px 8px 6px 0",
    },
  }
}))(IntlTableCell)

interface _Props{
  leadContainer: ILeadContainer
  offline: boolean
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: () => Promise<any>) => Promise<void>
}

export default function LeadOverview(props: _Props) {
  const { handleChangeAndSave, offline, leadContainer} = props
  const intl = useIntl()
  const classes = useStyles()

  const { Lead, buildings, ...restLead } = leadContainer

  return (
    <Grid item xs={12}>
      <Grid container spacing={1} style={{ padding: 8 }}>
        <Grid item xs={12}>
          <PageHeader title="LEAD_OVERVIEW" />
        </Grid>

        <FormikGroups label="INFORMATION" xs={12} md={6}>
          <Grid item xs={12}>
            <Hidden smUp>
              <LeadDetailsMobile leadContainer={leadContainer} />
            </Hidden>

            <Hidden xsDown>
              <LeadDetailsTable leadContainer={leadContainer} />
            </Hidden>
          </Grid>
        </FormikGroups>

        <FormikGroups label="OFFER_STATUS" xs={12} md={6} className={classes.positionRelative}>
          <OfflineUnavailable offline={offline}>
            <OfferOverride lead={Lead} handleChangeAndSave={handleChangeAndSave} />
          </OfflineUnavailable>
        </FormikGroups>

        <ReminderHistory lead={Lead} />

        <StatusHistory lead={Lead} />
      </Grid>
    </Grid>
  )
}
