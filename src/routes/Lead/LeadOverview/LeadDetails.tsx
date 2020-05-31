import React from "react"
import { ILeadContainer } from "../LeadAPI"

import IntlTypography from "../../../components/Intl/IntlTypography"
import { Typography,   Link, Table, TableRow, TableBody, TableCell, Divider } from "@material-ui/core"
import { useIntl, FormattedDate } from "react-intl"
import { BuildingTags } from "../BuildingTags"
import ServiceIcons from "../../../components/Dashboard/ServiceIcons"
import { IDisposalSerivce, ICleaningService, IMoveService, IPackSerivce, IStorageSerivce } from "../../../interfaces/IService"
import { IBuilding } from "../../../interfaces/IBuilding"
import IntlTableCell from "../../../components/Intl/IntlTableCell"
import { ILead } from "../../../interfaces/ILead"
import Services from "../Services"

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

function FormattedAddress(props: FormattedAddressProps) {
  const { building, services } = props
  const { Address } = building


  return (
    <div>
      <Link href={"https://www.google.com/maps/dir/?api=1&destination" + encodeURIComponent(`${Address.PLZ} ${Address.City}, ${Address.Street}`)} target="_blank">
        <span>
          {Address.Street}
          <br />
          {Address.PLZ} {Address.City}
        </span>
      </Link>
      <br/>
      <BuildingTags services={services} building={building} />
      <Divider />
    </div>
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
      <IntlTypography variant="body2">{title}</IntlTypography>
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
      <Detail title='FULL_NAME'>
        <Typography>{intl.formatMessage({ id: Lead.Customer.IsMale ? "MR" : "MRS" })}. {Lead.Customer.Firstname} {Lead.Customer.Lastname}</Typography>
      </Detail>
      <Detail title='BUILDINGS'>
        {
          buildings.map(building => (
            <FormattedAddress services={services} building={building} key={building.BuildingId} />
          ))
        }
      </Detail>

      <Detail title="EMAIL">
        <Link href={"mailto:" + Lead.Customer.Email}>{Lead.Customer.Email}</Link>
      </Detail>

      <Detail title="PHONE">
        <Link href={"tel:" + Lead.Customer.TelephoneNumber}>{Lead.Customer.TelephoneNumber}</Link>
      </Detail>


      {
        Lead.Customer.CompanyName.length > 0 ?
          <Detail title="COMPANY">
            <Typography>{Lead.Customer.CompanyName}</Typography>
          </Detail>
          : null
      }

      <Detail title="SERVICES">
        <Typography><ServiceIcons lead={Lead} services={Lead.Services} /></Typography>
      </Detail>

      <Detail title="STATUS">
        <IntlTypography>{Lead.Status.NameTextKey}</IntlTypography>
      </Detail>


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
          <IntlTableCell component="th" scope="row">FULL_NAME</IntlTableCell>
          <TableCell>{intl.formatMessage({ id: lead.Customer.IsMale ? "MR" : "MRS" })}. {lead.Customer.Firstname} {lead.Customer.Lastname}</TableCell>
        </TableRow>

        <TableRow >
          <IntlTableCell component="th" scope="row" colSpan={2}>BUILDINGS</IntlTableCell>
        </TableRow>

        {
          buildings.map(building => (
            <TableRow key={building.BuildingId}>
              {/* <IntlTableCell component="th" scope="row">TO</IntlTableCell> */}

              <TableCell>
                <Link href={"https://www.google.com/maps/dir/?api=1&destination" + encodeURIComponent(`${building.Address.PLZ} ${building.Address.City}, ${building.Address.Street}`)} target="_blank">
                  {building.Address.Street}
                  <br />
                  {building.Address.PLZ} {building.Address.City}
                </Link>
              </TableCell>
              <TableCell>
                <BuildingTags services={services} building={building} />
              </TableCell>
            </TableRow>
          ))
        }

        <LeadDates lead={lead} />

        <TableRow>
          <IntlTableCell component="th" scope="row">EMAIL</IntlTableCell>
          <TableCell><Link href={"mailto:" + lead.Customer.Email}>{lead.Customer.Email}</Link></TableCell>
        </TableRow>
        <TableRow>
          <IntlTableCell component="th" scope="row">PHONE</IntlTableCell>

          <TableCell><Link href={"tel:" + lead.Customer.TelephoneNumber}>{lead.Customer.TelephoneNumber}</Link></TableCell>
        </TableRow>

        {
          lead.Customer.CompanyName.length > 0 ?
            <TableRow>
              <IntlTableCell component="th" scope="row">COMPANY</IntlTableCell>
              <TableCell>{lead.Customer.CompanyName}</TableCell>
            </TableRow>
            : null
        }

        <TableRow>
          <IntlTableCell component="th" scope="row">SERVICES</IntlTableCell>
          <TableCell><ServiceIcons lead={lead} services={lead.Services} /></TableCell>
        </TableRow>
        <TableRow>
          <IntlTableCell component="th" scope="row">STATUS</IntlTableCell>
          <IntlTableCell>{lead.Status.NameTextKey}</IntlTableCell>
        </TableRow>
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
        <IntlTableCell component="th" scope="row">CREATED</IntlTableCell>
        <TableCell><FormattedDate value={lead.Created} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
      </TableRow>

      {
        lead.VisitDate ?
          <TableRow>
            <IntlTableCell component="th" scope="row">VISITING_DATE</IntlTableCell>
            <TableCell><FormattedDate value={lead.VisitDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
          </TableRow>
          : null
      }

      {
        lead.MoveDate ?
          <TableRow>
            <IntlTableCell component="th" scope="row">MOVING</IntlTableCell>
            <TableCell><FormattedDate value={lead.MoveDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
          </TableRow>
          : null
      }

      {
        lead.PackServiceDate ?
          <TableRow>
            <IntlTableCell component="th" scope="row">PACKINGSERVICE</IntlTableCell>
            <TableCell><FormattedDate value={lead.PackServiceDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
          </TableRow>
          : null
      }


      {
        lead.DeliveryDate ?
          <TableRow>
            <IntlTableCell component="th" scope="row">CARDBOARDBOX_DELIVERY</IntlTableCell>
            <TableCell><FormattedDate value={lead.DeliveryDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
          </TableRow>
          : null
      }


      {
        lead.StorageDate ?
          <TableRow>
            <IntlTableCell component="th" scope="row">STORAGE</IntlTableCell>
            <TableCell><FormattedDate value={lead.StorageDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
          </TableRow>
          : null
      }

      {
        lead.DisposalDate ?
          <TableRow>
            <IntlTableCell component="th" scope="row">DISPOSAL</IntlTableCell>
            <TableCell><FormattedDate value={lead.DisposalDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
          </TableRow>
          : null
      }

      {
        lead.CleaningDate ?
          <TableRow>
            <IntlTableCell component="th" scope="row">CLEANING</IntlTableCell>
            <TableCell><FormattedDate value={lead.CleaningDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
          </TableRow>
          : null
      }

      {
        lead.HandOverDate ?
          <TableRow>
            <IntlTableCell component="th" scope="row">HANDIN</IntlTableCell>
            <TableCell><FormattedDate value={lead.HandOverDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
          </TableRow>
          : null
      }
    </>
  )
}
