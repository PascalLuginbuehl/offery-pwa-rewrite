import React from "react"
import { ILeadContainer } from "../LeadAPI"

import IntlTypography from "../../../components/Intl/IntlTypography"
import { Typography,   Link, Table, TableRow, TableBody,  Divider } from "@material-ui/core"
import { useIntl, FormattedDate } from "react-intl"
import { BuildingTags } from "../BuildingTags"
import ServiceIcons from "../../../components/Dashboard/ServiceIcons"
import { IDisposalSerivce, ICleaningService, IMoveService, IPackSerivce, IStorageSerivce } from "../../../interfaces/IService"
import { IBuilding } from "../../../interfaces/IBuilding"

import { ILead } from "../../../interfaces/ILead"
import Services from "../Services"
import { IntlStyledTableCell, StyledTableCell } from "."
import { makeStyles } from "@material-ui/styles"

interface Services {
  disposalService: IDisposalSerivce | null
  moveService: IMoveService | null
  packService: IPackSerivce | null
  storageService: IStorageSerivce | null
  cleaningService: ICleaningService | null
}

interface FormattedAddressProps {
  building: IBuilding
  services: Services
}


const useStyles = makeStyles({
  root: {
    padding: "4px 0"
  }
})

function FormattedAddress(props: FormattedAddressProps) {
  const { building, services } = props
  const { Address } = building
  const classes = useStyles()

  return (
    <>
      <div className={classes.root}>
        <Link href={"https://www.google.com/maps/dir/?api=1&destination" + encodeURIComponent(`${Address.PLZ} ${Address.City}, ${Address.Street}`)} target="_blank">
          <span>
            {Address.Street}
            <br />
            {Address.PLZ} {Address.City}
          </span>
        </Link>

        <br/>

        <BuildingTags services={services} building={building} />
      </div>
      <Divider />
    </>
  )
}


interface detailProps {
  title: string
  children: React.ReactNode
}

function Detail(props: detailProps) {
  const {title, children} = props
  return (
    <div style={{padding: 4}}>
      <IntlTypography variant="body2" style={{fontWeight: "bold"}}>{title}</IntlTypography>
      {children}
    </div>
  )
}


interface LeadDetailsMobileProps {
  leadContainer: ILeadContainer
}

export function LeadDetailsMobile(props: LeadDetailsMobileProps) {
  const { leadContainer: { Lead, buildings, ...restLead}} = props
  const intl = useIntl()
  const services = { disposalService: restLead.disposalService, moveService: restLead.moveService, packService: restLead.packService, storageService: restLead.storageService, cleaningService: restLead.cleaningService }

  return (
    <div>
      <Detail title="STATUS">
        <IntlTypography>{Lead.Status.NameTextKey}</IntlTypography>
      </Detail>

      {
        Lead.Customer.CompanyName.length > 0 ?
          <Detail title="COMPANY">
            <Typography>{Lead.Customer.CompanyName}</Typography>
          </Detail>
          : null
      }

      <Detail title='FULL_NAME'>
        <Typography>{intl.formatMessage({ id: Lead.Customer.IsMale ? "MR" : "MRS" })}. {Lead.Customer.Lastname} {Lead.Customer.Firstname}</Typography>
      </Detail>

      {Lead.Customer.Email.length > 0 ?
        <Detail title="EMAIL">
          <Link href={"mailto:" + Lead.Customer.Email}>{Lead.Customer.Email}</Link>
        </Detail>
        : null
      }

      {Lead.Customer.TelephoneNumber.length > 0 ?
        <Detail title="PHONE">
          <Link href={"tel:" + Lead.Customer.TelephoneNumber}>{Lead.Customer.TelephoneNumber}</Link>
        </Detail>
        : null
      }

      <Detail title="SERVICES">
        <Typography><ServiceIcons lead={Lead} services={Lead.Services} /></Typography>
      </Detail>
      <Divider />

      <Detail title='BUILDINGS'>
        {
          buildings.map(building => (
            <FormattedAddress services={services} building={building} key={building.BuildingId} />
          ))
        }
      </Detail>

      <br />

      <Detail title="APPOINTMENTS"><div /></Detail>
      <Table size="small" aria-label="a dense table">
        <LeadDates lead={Lead}/>
      </Table>
    </div>
  )
}


interface LeadDetailsTableProps {
  leadContainer: ILeadContainer
}

export function LeadDetailsTable(props: LeadDetailsTableProps) {
  const { leadContainer: { Lead: lead, buildings, ...restLead } } = props
  const intl = useIntl()
  const services = { disposalService: restLead.disposalService, moveService: restLead.moveService, packService: restLead.packService, storageService: restLead.storageService, cleaningService: restLead.cleaningService }

  return (
    <Table size="small" aria-label="a dense table">
      <TableBody>
        <TableRow>
          <IntlStyledTableCell component="th" scope="row">STATUS</IntlStyledTableCell>
          <IntlStyledTableCell>{lead.Status.NameTextKey}</IntlStyledTableCell>
        </TableRow>

        {
          lead.Customer.CompanyName.length > 0 ?
            <TableRow>
              <IntlStyledTableCell component="th" scope="row">COMPANY</IntlStyledTableCell>
              <StyledTableCell>{lead.Customer.CompanyName}</StyledTableCell>
            </TableRow>
            : null
        }

        <TableRow>
          <IntlStyledTableCell component="th" scope="row">FULL_NAME</IntlStyledTableCell>
          <StyledTableCell>{intl.formatMessage({ id: lead.Customer.IsMale ? "MR" : "MRS" })}. {lead.Customer.Firstname} {lead.Customer.Lastname}</StyledTableCell>
        </TableRow>

        <TableRow>
          <IntlStyledTableCell component="th" scope="row">EMAIL</IntlStyledTableCell>
          <StyledTableCell><Link href={"mailto:" + lead.Customer.Email}>{lead.Customer.Email}</Link></StyledTableCell>
        </TableRow>
        <TableRow>
          <IntlStyledTableCell component="th" scope="row">PHONE</IntlStyledTableCell>

          <StyledTableCell><Link href={"tel:" + lead.Customer.TelephoneNumber}>{lead.Customer.TelephoneNumber}</Link></StyledTableCell>
        </TableRow>

        <LeadDates lead={lead} />

        <TableRow>
          <IntlStyledTableCell component="th" scope="row">SERVICES</IntlStyledTableCell>
          <StyledTableCell><ServiceIcons lead={lead} services={lead.Services} /></StyledTableCell>
        </TableRow>


        <TableRow >
          <IntlStyledTableCell component="th" scope="row" colSpan={2}>BUILDINGS</IntlStyledTableCell>
        </TableRow>

        {
          buildings.map(building => (
            <TableRow key={building.BuildingId}>
              {/* <IntlStyledTableCell component="th" scope="row">TO</IntlStyledTableCell> */}

              <StyledTableCell>
                <Link href={"https://www.google.com/maps/dir/?api=1&destination" + encodeURIComponent(`${building.Address.PLZ} ${building.Address.City}, ${building.Address.Street}`)} target="_blank">
                  {building.Address.Street}
                  <br />
                  {building.Address.PLZ} {building.Address.City}
                </Link>
              </StyledTableCell>
              <StyledTableCell>
                <BuildingTags services={services} building={building} />
              </StyledTableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>

  )
}



interface LeadDatesProps{
  lead: ILead
}
function LeadDates(props: LeadDatesProps) {
  const { lead } = props

  return (
    <>
      <TableRow>
        <IntlStyledTableCell component="th" scope="row">CREATED</IntlStyledTableCell>
        <StyledTableCell><FormattedDate value={lead.Created} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></StyledTableCell>
      </TableRow>

      {
        lead.VisitDate ?
          <TableRow>
            <IntlStyledTableCell component="th" scope="row">VISITING_DATE</IntlStyledTableCell>
            <StyledTableCell><FormattedDate value={lead.VisitDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></StyledTableCell>
          </TableRow>
          : null
      }

      {
        lead.MoveDate ?
          <TableRow>
            <IntlStyledTableCell component="th" scope="row">MOVING</IntlStyledTableCell>
            <StyledTableCell><FormattedDate value={lead.MoveDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></StyledTableCell>
          </TableRow>
          : null
      }

      {
        lead.PackServiceDate ?
          <TableRow>
            <IntlStyledTableCell component="th" scope="row">PACKINGSERVICE</IntlStyledTableCell>
            <StyledTableCell><FormattedDate value={lead.PackServiceDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></StyledTableCell>
          </TableRow>
          : null
      }


      {
        lead.DeliveryDate ?
          <TableRow>
            <IntlStyledTableCell component="th" scope="row">CARDBOARDBOX_DELIVERY</IntlStyledTableCell>
            <StyledTableCell><FormattedDate value={lead.DeliveryDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></StyledTableCell>
          </TableRow>
          : null
      }


      {
        lead.StorageDate ?
          <TableRow>
            <IntlStyledTableCell component="th" scope="row">STORAGE</IntlStyledTableCell>
            <StyledTableCell><FormattedDate value={lead.StorageDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></StyledTableCell>
          </TableRow>
          : null
      }

      {
        lead.DisposalDate ?
          <TableRow>
            <IntlStyledTableCell component="th" scope="row">DISPOSAL</IntlStyledTableCell>
            <StyledTableCell><FormattedDate value={lead.DisposalDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></StyledTableCell>
          </TableRow>
          : null
      }

      {
        lead.CleaningDate ?
          <TableRow>
            <IntlStyledTableCell component="th" scope="row">CLEANING</IntlStyledTableCell>
            <StyledTableCell><FormattedDate value={lead.CleaningDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></StyledTableCell>
          </TableRow>
          : null
      }

      {
        lead.HandOverDate ?
          <TableRow>
            <IntlStyledTableCell component="th" scope="row">HANDIN</IntlStyledTableCell>
            <StyledTableCell><FormattedDate value={lead.HandOverDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></StyledTableCell>
          </TableRow>
          : null
      }
    </>
  )
}
