import React from "react"
import  { ILeadContainer } from "../LeadAPI"
import { ListSubheader, Collapse } from "@material-ui/core"
import { FormattedMessage } from "react-intl"
import NavFolder from "../../../components/Navigation/NavFolder"
import NavItem from "../../../components/Navigation/NavItem"
import NavItemBuilding from "../../../components/Navigation/NavItemBuilding"
import AddCircleIcon from "@material-ui/icons/AddCircle"

interface Props {
  leadContainer: ILeadContainer
  matchUrl: string
  portal: HTMLDivElement | null
}

export default function Navigation({ leadContainer, matchUrl, portal }: Props) {
  const {
    Lead: { Services, ...Lead},
    buildings,
  } = leadContainer

  return (
    <>
      <ListSubheader>
        <FormattedMessage id="EDIT_LEAD" />
      </ListSubheader>

      <NavItem to={`${matchUrl}`} title="LEAD_OVERVIEW" />

      <NavItem to={`${matchUrl}/customer`} title="CUSTOMER" />

      <NavFolder to={`${matchUrl}/building`} title="BUILDINGS">
        {buildings.map(building => (
          <NavItemBuilding to={`${matchUrl}/building/${building.BuildingId}`} key={building.BuildingId} building={building} nested />
        ))}
        <NavItem to={`${matchUrl}/building/new`} icon={<AddCircleIcon color="primary" />} title="CREATE_NEW_BUILDING" nested />
      </NavFolder>

      <NavItem to={`${matchUrl}/building/email-confirmation`} title="EMAIL_CONFIRMATION" />

      <NavFolder to={`${matchUrl}/services`} title="SERVICES">
        <Collapse in={Services.HasMoveServiceEnabled}>
          <NavFolder to={`${matchUrl}/services/move`} title="MOVE" nested>
            <NavItem to={`${matchUrl}/services/move/inventory`} title="INVENTORY" doubleNested />
          </NavFolder>
        </Collapse>

        <Collapse in={Services.HasPackServiceEnabled}>
          <NavItem to={`${matchUrl}/services/pack`} title="PACK" nested />
        </Collapse>

        <Collapse in={Services.HasStorageServiceEnabled}>
          <NavFolder to={`${matchUrl}/services/storage`} title="STORAGE" nested>
            <NavItem to={`${matchUrl}/services/storage/inventory`} title="INVENTORY" doubleNested />
          </NavFolder>
        </Collapse>

        <Collapse in={Services.HasDisposalServiceEnabled}>
          <NavFolder to={`${matchUrl}/services/disposal`} title="DISPOSAL" nested>
            <NavItem to={`${matchUrl}/services/disposal/inventory`} title="INVENTORY" doubleNested />
          </NavFolder>
        </Collapse>

        <Collapse in={Services.HasCleaningServiceEnabled}>
          <NavItem to={`${matchUrl}/services/cleaning`} title="CLEANING" nested />
        </Collapse>

        <NavItem to={`${matchUrl}/services/material-shop`} title="MATERIAL_SHOP" nested />

      </NavFolder>

      <NavFolder to={`${matchUrl}/conditions`} title="CONDITIONS">
        <Collapse in={Services.HasMoveServiceEnabled}>
          <NavItem to={`${matchUrl}/conditions/move`} title="MOVE_CONDITIONS" nested />
        </Collapse>

        <Collapse in={Services.HasPackServiceEnabled}>
          <NavItem to={`${matchUrl}/conditions/pack`} title="PACK_CONDITIONS" nested />
        </Collapse>

        <Collapse in={Services.HasStorageServiceEnabled}>
          <NavItem to={`${matchUrl}/conditions/storage`} title="STORAGE_CONDITIONS" nested />
        </Collapse>

        <Collapse in={Services.HasDisposalServiceEnabled}>
          <NavItem to={`${matchUrl}/conditions/disposal`} title="DISPOSAL_CONDITIONS" nested />
        </Collapse>

        <Collapse in={Services.HasCleaningServiceEnabled}>
          <NavItem to={`${matchUrl}/conditions/cleaning`} title="CLEANING_CONDITIONS" nested />
        </Collapse>
      </NavFolder>

      <NavFolder to={`${matchUrl}/offer`} title="OFFER">
        <NavItem to={`${matchUrl}/offer/generate`} title="GENERATE" nested />

        <NavItem to={`${matchUrl}/offer/preview`} title="PREVIEW" nested />
        <NavItem to={`${matchUrl}/offer/send`} title="SEND" nested />
      </NavFolder>
    </>
  )
}
