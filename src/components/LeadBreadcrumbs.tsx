import React, { Component } from "react"
import { Breadcrumbs, Link, Typography, makeStyles } from "@material-ui/core"
import { ILead, IPostLead } from "../interfaces/ILead"
import { useFormattedName } from "../utils"

const useStyles = makeStyles({
  breadcrumbs: {
    padding: "2px 0 0 8px;",
  },
})

interface LeadBreadcrumbsProps {
  lead: IPostLead
}

export default function LeadBreadcrumbs(props: LeadBreadcrumbsProps) {
  const classes = useStyles()
  const formatName = useFormattedName()
  const { lead } = props
  return (
    <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
      <Link color="inherit" href="/">
        Leads
      </Link>
      <Typography color="textPrimary">{formatName({Company: lead.Customer.CompanyName, FirstName: lead.Customer.Firstname, LastName: lead.Customer.Lastname})}</Typography>
    </Breadcrumbs>
  )

}
