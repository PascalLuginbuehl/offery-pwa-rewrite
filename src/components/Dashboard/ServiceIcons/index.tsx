import React, { Component } from "react"
import { ReactComponent as Box } from "./box.svg"
import { ReactComponent as Warehouse } from "./warehouse.svg"
import { Avatar, Grid, makeStyles } from "@material-ui/core"
import LocalShippingIcon from "@material-ui/icons/LocalShipping"
import DeleteIcon from "@material-ui/icons/Delete"
import InvertColorsIcon from "@material-ui/icons/InvertColors"
import { Button } from "@material-ui/core"
import { IServices } from "../../../interfaces/IService"
import { lightGreen, orange, yellow, brown, lightBlue } from "@material-ui/core/colors"
import { ICompressedLead, ILead } from "../../../interfaces/ILead"
import PlainLink from "../../PlainLink"
import IntlTooltip from "../../Intl/IntlTooltip"

interface _Props {
  services: IServices
  lead: ICompressedLead | ILead
}

const useStyles = makeStyles({
  avatar: {
    width: 30,
    height: 30,
  },
})

function Icons({ color, title, link, children }: {  color: string; title: string; link: string; children: React.ReactNode }) {
  const classes = useStyles()

  return (
    <Grid item>
      <PlainLink to={link}>
        <IntlTooltip title={title}>
          <Avatar style={{ background: color }} className={classes.avatar}>
            {children}
          </Avatar>
        </IntlTooltip>
      </PlainLink>
    </Grid>
  )
}
export default function ServicesComponent({ lead, services }: _Props) {
  return (
    <Grid spacing={1} container wrap="nowrap">
      {
        services.HasMoveServiceEnabled ?
          <Icons color={lightGreen.A700} link={`/lead/${lead.LeadId}/services/move`} title="MOVE_SERVICE">
            <LocalShippingIcon fill="black" height="20" />
          </Icons>
          : null
      }
      {
        services.HasPackServiceEnabled ?
          <Icons color={orange["500"]} link={`/lead/${lead.LeadId}/services/pack`} title="PACK_SERVICE">
            <Box height="20" fill="white" />
          </Icons>
          : null
      }
      {
        services.HasStorageServiceEnabled ?
          <Icons color={yellow["600"]} link={`/lead/${lead.LeadId}/services/storage`} title="STORAGE_SERVICE">
            <Warehouse height="20" fill="white" />
          </Icons>

          : null
      }
      {
        services.HasDisposalServiceEnabled ?
          <Icons color={ brown["300"]} link={`/lead/${lead.LeadId}/services/disposal`} title="DISPOSAL_SERVICE">
            <DeleteIcon height="20" />
          </Icons>
          : null
      }
      {
        services.HasCleaningServiceEnabled ?
          <Icons color={ lightBlue["500"]} link={`/lead/${lead.LeadId}/services/cleaning`} title="CLEANING_SERVICE">

            <InvertColorsIcon height="20" />
          </Icons>
          : null
      }
    </Grid>
  )
}
