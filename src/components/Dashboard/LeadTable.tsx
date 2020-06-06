import React from "react"

import { FormattedDate, FormattedMessage } from "react-intl"

import {      Table, TableHead, TableCell, TableRow, TableBody,  Typography,         TableFooter, TablePagination,  TableSortLabel, Hidden, useMediaQuery, Theme, Tooltip } from "@material-ui/core"
import {  ICompressedLead } from "../../interfaces/ILead"
import ServicesComponent from "./ServiceIcons"
import IntlTooltip from "../Intl/IntlTooltip"
import PlainLink from "../PlainLink"
import { makeStyles, withStyles } from "@material-ui/styles"
import StatusButton from "./StatusButton"

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
    console.log(order)
    if (order !== 0) return order
    return a[1] - b[1]
  })

  return stabilizedThis.map(el => el[0])
}

type Order = "asc" | "desc";

function getSorting(
  order: Order,
  orderBy: keyof ICompressedLead | "CustomerCombined",
): (a: ICompressedLead, b: ICompressedLead) => number {
  // @ts-ignore
  return order === "desc" ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}


const StyledTableCell = withStyles({
  root: {
    paddingLeft: 8,
    paddingRight: 0,
  },

})(TableCell)

const useStyles = makeStyles({
  root: {

  },
  tableFixedLayout: {
    tableLayout: "fixed"
  }
})

export default function LeadTable({ leads }: _Props) {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [order, setOrder] = React.useState<Order>("desc")
  const [orderBy, setOrderBy] = React.useState<keyof ICompressedLead | "CustomerCombined">("Created")

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSort = (property: keyof ICompressedLead | "CustomerCombined") => (_event: React.MouseEvent<unknown>) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const classes = useStyles()
  const matches = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))

  return (
    <>
      <Table className={classes.tableFixedLayout}>
        <TableHead>
          <TableRow>
            <StyledTableCell variant="head" style={{width: 90}}>
              <TableSortLabel
                active={orderBy === "Status"}
                direction={orderBy === "Status" ? order : "asc"}
                onClick={handleSort("Status")}
              >
                <FormattedMessage id="STATUS" />
              </TableSortLabel>
            </StyledTableCell>

            <StyledTableCell variant="head" style={{ width: 170}}>
              <TableSortLabel
                active={orderBy === "CustomerCombined"}
                direction={orderBy === "CustomerCombined" ? order : "asc"}
                onClick={handleSort("CustomerCombined")}
              >
                <FormattedMessage id="CUSTOMER" />
              </TableSortLabel>
            </StyledTableCell>

            <StyledTableCell variant="head">
              <FormattedMessage id="ADDRESSES" />
            </StyledTableCell>

            <StyledTableCell variant="head" padding="checkbox" style={{ width: 110 }}>
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
            </StyledTableCell>

            <StyledTableCell variant="head" padding="checkbox" style={{ width: 90 }}>
              <TableSortLabel
                active={orderBy === "Created"}
                direction={orderBy === "Created" ? order : "asc"}
                onClick={handleSort("Created")}
              >
                <FormattedMessage id="CREATED" />
              </TableSortLabel>
            </StyledTableCell>

            <Hidden smDown>
              <StyledTableCell variant="head" style={{ width: 195 }} ><FormattedMessage id="SERVICES" /></StyledTableCell>
            </Hidden>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? stableSort(leads.map((lead) => ({CustomerCombined: lead.Customer.Lastname + lead.Customer.Firstname, ...lead})), getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : leads
          ).map((lead) => {
            let computedName: string
            if (lead.Customer.CompanyName.length > 0) {
              computedName = lead.Customer.CompanyName + ", " + lead.Customer.Firstname + " " + lead.Customer.Lastname
            } else {
              computedName = lead.Customer.Firstname + " " + lead.Customer.Lastname
            }

            return (
              <TableRow key={lead.LeadId}>
                <StyledTableCell padding="checkbox">
                  <PlainLink to={`/lead/${lead.LeadId}`}>
                    <StatusButton lead={lead} />
                  </PlainLink>
                </StyledTableCell>
                <StyledTableCell>
                  <Tooltip title={computedName}>
                    <Typography noWrap variant="body2">
                      {computedName}
                    </Typography>
                  </Tooltip>
                </StyledTableCell>

                <StyledTableCell>
                  {lead.Addresses.map(address => (
                    <Tooltip title={`${address.PLZ} ${address.City}, ${address.Street}`} key={address.AddressId}>
                      <Typography variant="caption" component="p" noWrap>
                        {`${address.PLZ} ${address.City}, ${address.Street}`}
                      </Typography>
                    </Tooltip>
                  ))}
                </StyledTableCell>

                <StyledTableCell>
                  <Typography noWrap variant="body2">
                    {lead.VisitDate ? <FormattedDate year="2-digit" month="2-digit" day="2-digit" value={lead.VisitDate} /> : <FormattedMessage id="OPEN" />}
                  </Typography>
                </StyledTableCell>

                <StyledTableCell>
                  <Typography noWrap variant="body2">
                    <FormattedDate year="2-digit" month="2-digit" day="2-digit" value={lead.Created} />
                  </Typography>
                </StyledTableCell>

                <Hidden smDown>
                  <StyledTableCell>
                    <ServicesComponent services={lead.Services} lead={lead} />
                  </StyledTableCell>
                </Hidden>
              </TableRow>
            )
          })}

        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={matches ? 6 : 5}
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
