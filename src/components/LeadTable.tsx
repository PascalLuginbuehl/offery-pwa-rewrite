import React, { useState } from "react"
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye"
import { FormattedDate, FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl"
import ContactsIcon from "@material-ui/icons/Contacts"
import { createStyles, Grid, Theme, WithStyles, withStyles, Table, TableHead, TableCell, TableRow, TableBody, IconButton, Typography, Tabs, Tab, ListItem, List, Avatar, ListItemText, ListItemSecondaryAction, Collapse, TableFooter, TablePagination, Button, TableSortLabel, Tooltip, makeStyles } from "@material-ui/core"
import { ILead, ICompressedLead } from "../interfaces/ILead"
import ServicesComponent from "./Dashboard/ServiceIcons"
import IntlTooltip from "./Intl/IntlTooltip"
import PlainLink from "./PlainLink"

interface _Props {
  leads: ICompressedLead[]
}

function desc<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function stableSort(array: ICompressedLead[], cmp: (a: ICompressedLead, b: ICompressedLead) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [ICompressedLead, number])

  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  return stabilizedThis.map(el => el[0])
}

type Order = "asc" | "desc";

function getSorting(
  order: Order,
  orderBy: keyof ICompressedLead,
): (a: ICompressedLead, b: ICompressedLead) => number {

  return order === "desc" ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

export default function LeadTable({ leads }: _Props) {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [order, setOrder] = React.useState<Order>("desc")
  const [orderBy, setOrderBy] = React.useState<keyof ICompressedLead>("Created")

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSort = (property: keyof ICompressedLead) => (_event: React.MouseEvent<unknown>) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell variant="head" padding="checkbox">
              <TableSortLabel
                active={orderBy === "Status"}
                direction={orderBy === "Status" ? order : "asc"}
                onClick={handleSort("Status")}
              >
                <FormattedMessage id="STATUS" />
              </TableSortLabel>
            </TableCell>

            <TableCell variant="head">
              <TableSortLabel
                active={orderBy === "Customer"}
                direction={orderBy === "Customer" ? order : "asc"}
                onClick={handleSort("Customer")}
              >
                <FormattedMessage id="CUSTOMER" />
              </TableSortLabel>
            </TableCell>

            <TableCell variant="head">
              <FormattedMessage id="START_DESTINATION_ADDRESSES" />
            </TableCell>

            <TableCell variant="head" padding="checkbox">
              <TableSortLabel
                active={orderBy === "VisitDate"}
                direction={orderBy === "VisitDate" ? order : "asc"}
                onClick={handleSort("VisitDate")}
              >
                <div>
                  <Typography noWrap variant="subtitle2" component="p" >
                    <FormattedMessage id="APPOINTMENTS" />
                  </Typography>
                  <Typography variant="caption" noWrap component="p">
                    <FormattedMessage id="VISITING" />
                  </Typography>
                </div>
              </TableSortLabel>
            </TableCell>

            <TableCell variant="head" padding="checkbox">
              <TableSortLabel
                active={orderBy === "Created"}
                direction={orderBy === "Created" ? order : "asc"}
                onClick={handleSort("Created")}
              >
                <FormattedMessage id="CREATED" />
              </TableSortLabel>
            </TableCell>

            <TableCell variant="head"><FormattedMessage id="SERVICES" /></TableCell>
            <TableCell variant="head"><FormattedMessage id="ACTIONS" /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? stableSort(leads, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : leads
          ).map((lead) =>
            <TableRow key={lead.LeadId}>
              <TableCell padding="checkbox">
                <Typography noWrap variant="body2">
                  <IntlTooltip title={lead.Status.NameTextKey}>
                    <Avatar>
                      <RemoveRedEyeIcon />
                    </Avatar>
                  </IntlTooltip>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap variant="body2">
                  {lead.Customer.Firstname + " " + lead.Customer.Lastname}
                </Typography>
              </TableCell>
              <TableCell style={{ padding: "6px 16px" }}>
                <Typography variant="caption" component="p" noWrap>
                  {lead.FromAddress ? `${lead.FromAddress.PLZ} ${lead.FromAddress.City}, ${lead.FromAddress.Street}` : <FormattedMessage id="NO_ADDRESS" />}
                </Typography>
                <Typography variant="caption" component="p" noWrap>
                  {lead.ToAddress ? `${lead.ToAddress.PLZ} ${lead.ToAddress.City}, ${lead.ToAddress.Street}` : <FormattedMessage id="NO_ADDRESS" />}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography noWrap variant="body2">
                  {lead.VisitDate ? <FormattedDate year="2-digit" month="2-digit" day="2-digit" value={lead.VisitDate} /> : <FormattedMessage id="NOT_DEFINED" />}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography noWrap variant="body2">
                  <FormattedDate year="2-digit" month="2-digit" day="2-digit" value={lead.Created} />
                </Typography>
              </TableCell>

              <TableCell style={{ padding: "6px 16px" }}>
                <ServicesComponent services={lead.Services} lead={lead} />
              </TableCell>
              <TableCell style={{ padding: "6px 16px" }}>
                <PlainLink to={`/lead/${lead.LeadId}`}>
                  <IconButton>
                    <RemoveRedEyeIcon />
                  </IconButton>
                </PlainLink>

              </TableCell>
            </TableRow>
          )}

        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={7}
              count={leads.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </>
  )
}
