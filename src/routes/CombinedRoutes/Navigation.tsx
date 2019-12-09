import React, { Component } from "react"
import LeadAPI, { ILeadContainer } from "../LeadAPI"
import { ListSubheader, Collapse } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import NavFolder from "../../components/Navigation/NavFolder";
import NavItem from "../../components/Navigation/NavItem";

interface Props {
  leadContainer: ILeadContainer
  matchUrl: string
  portal: HTMLDivElement | null
}

export default ({ leadContainer, matchUrl, portal }: Props) => {
  const {
    Lead,
    services,
  } = leadContainer


  return (
    <>
      <ListSubheader>
        <FormattedMessage id="EDIT_LEAD" />
      </ListSubheader>
      <NavFolder to={`${matchUrl}/building`} title="CUSTOMER">
        {Lead ? (
          <>
            <Collapse in={Lead.HasMoveOutBuilding}>
              <NavItem to={`${matchUrl}/building/move-out`} title="MOVE_OUT_BUILDING" nested />
            </Collapse>
            <Collapse in={Lead.HasMoveInBuilding}>
              <NavItem to={`${matchUrl}/building/move-in`} title="MOVE_IN_BUILDING" nested />
            </Collapse>
            <Collapse in={Lead.HasStorageInBuilding}>
              <NavItem to={`${matchUrl}/building/storage`} title="STORAGE_BUILDING" nested />
            </Collapse>
            <Collapse in={Lead.HasDisposalOutBuilding}>
              <NavItem to={`${matchUrl}/building/disposal`} title="DISPOSAL_BUILDING" nested />
            </Collapse>
            <Collapse in={Lead.HasCleaningBuilding}>
              <NavItem to={`${matchUrl}/building/cleaning`} title="CLEANING_BUILDING" nested />
            </Collapse>
            <NavItem to={`${matchUrl}/building/email-confirmation`} title="EMAIL_CONFIRMATION" nested />
          </>
        ) : null}
      </NavFolder>

      <NavFolder to={`${matchUrl}/services`} title="SERVICES">
        <Collapse in={services.HasMoveServiceEnabled}>
          <NavFolder to={`${matchUrl}/services/move`} title="MOVE" nested>
            <NavItem to={`${matchUrl}/services/move/material-shop`} title="MATERIAL_SHOP" doubleNested />
            <NavItem to={`${matchUrl}/services/move/inventory`} title="INVENTORY" doubleNested />
          </NavFolder>
        </Collapse>

        <Collapse in={services.HasPackServiceEnabled}>
          <NavFolder to={`${matchUrl}/services/pack`} title="PACK" nested>
            <NavItem to={`${matchUrl}/services/pack/material-shop`} title="MATERIAL_SHOP" doubleNested />
          </NavFolder>
        </Collapse>

        <Collapse in={services.HasStorageServiceEnabled}>
          <NavFolder to={`${matchUrl}/services/storage`} title="STORAGE" nested>
            <NavItem to={`${matchUrl}/services/storage/material-shop`} title="MATERIAL_SHOP" doubleNested />
            <NavItem to={`${matchUrl}/services/storage/inventory`} title="INVENTORY" doubleNested />
          </NavFolder>
        </Collapse>

        <Collapse in={services.HasDisposalServiceEnabled}>
          <NavFolder to={`${matchUrl}/services/disposal`} title="DISPOSAL" nested>
            <NavItem to={`${matchUrl}/services/disposal/inventory`} title="INVENTORY" doubleNested />
          </NavFolder>
        </Collapse>

        <Collapse in={services.HasCleaningServiceEnabled}>
          <NavItem to={`${matchUrl}/services/cleaning`} title="CLEANING" nested />
        </Collapse>
      </NavFolder>

      <NavFolder to={`${matchUrl}/conditions`} title="CONDITIONS">
        <Collapse in={services.HasCleaningServiceEnabled}>
          <NavItem to={`${matchUrl}/conditions/move`} title="MOVE_CONDITIONS" nested />
        </Collapse>

        <Collapse in={services.HasPackServiceEnabled}>
          <NavItem to={`${matchUrl}/conditions/pack`} title="PACK_CONDITIONS" nested />
        </Collapse>

        <Collapse in={services.HasStorageServiceEnabled}>
          <NavItem to={`${matchUrl}/conditions/storage`} title="STORAGE_CONDITIONS" nested />
        </Collapse>

        <Collapse in={services.HasDisposalServiceEnabled}>
          <NavItem to={`${matchUrl}/conditions/disposal`} title="DISPOSAL_CONDITIONS" nested />
        </Collapse>

        <Collapse in={services.HasCleaningServiceEnabled}>
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
