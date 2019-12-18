import React, { Component } from "react"
import { Route, Redirect } from "react-router"
import LeadAPI, { ILeadContainer } from "../LeadAPI"
import { IBuildingCopy } from "../../components/FormikFields/Bundled/BuildingCopy"
import { emptyCleaningService, emptyStorageService, emptyPackService, emptyDisposalService, emptyMoveService } from "../../interfaces/IService"
import { emptyMaterialOrder, ShopTypeEnum } from "../../interfaces/IShop"
import { InventoryKeysEnum, emptyInventory } from "../../interfaces/IInventars"
import MoveConditions from "../Conditions/MoveConditions"
import PackConditions from "../Conditions/PackConditions"
import StorageConditions from "../Conditions/StorageConditions"
import DisposalConditions from "../Conditions/DisposalConditions"
import CleaningConditions from "../Conditions/CleaningConditions"
import GenerateOffer from "../Offer/GenerateOffer"
import PreviewOffer from "../Offer/PreviewOffer"
import { ILead } from "../../interfaces/ILead"
import {
  emptyMoveServiceConditions,
  emptyPackServiceConditions,
  emptyStorageServiceConditions,
  emptyCleaningServiceConditions,
  emptyDisposalServiceConditions,
} from "../../interfaces/IConditions"
import SendOffer from "../Offer/SendOffer"
import Done from "../Offer/Done"

interface Props {
  leadContainer: ILeadContainer
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: Promise<any>) => Promise<void>
  redirectToNextPage: (currentUrl: string) => () => void
  getNextPage: (originalPath: string) => string
  handleChange: (value: any, name: keyof ILeadContainer) => void
  matchUrl: string
}

export default function ConditionRoutes({ leadContainer, redirectToNextPage, matchUrl, handleChangeAndSave, getNextPage, handleChange }: Props) {
  const {
    Lead,
    services,
    moveOut,
    moveIn,
    storage,
    disposal,
    cleaning,
    moveService: moveServiceNull,
    disposalService: disposalServiceNull,
    packService: packServiceNull,
    storageService: storageServiceNull,
    cleaningService: cleaningServiceNull,
    materialOrder: materialOrderNull,
    inventory: inventoryNull,
  } = leadContainer

  const buildingOptions: IBuildingCopy = {
    moveOutBuilding: moveOut,
    moveInBuilding: moveIn,
    cleaningBuilding: cleaning,
    storageBuilding: storage,
    disposalBuilding: disposal,
  }

  const moveService = moveServiceNull ? moveServiceNull : emptyMoveService
  const disposalService = disposalServiceNull ? disposalServiceNull : emptyDisposalService
  const packService = packServiceNull ? packServiceNull : emptyPackService
  const storageService = storageServiceNull ? storageServiceNull : emptyStorageService
  const cleaningService = cleaningServiceNull ? cleaningServiceNull : emptyCleaningService

  const MoveServiceConditions = Lead.MoveServiceConditions ? Lead.MoveServiceConditions : emptyMoveServiceConditions
  const PackServiceConditions = Lead.PackServiceConditions ? Lead.PackServiceConditions : emptyPackServiceConditions
  const StorageServiceConditions = Lead.StorageServiceConditions ? Lead.StorageServiceConditions : emptyStorageServiceConditions
  const DisposalServiceConditions = Lead.DisposalServiceConditions ? Lead.DisposalServiceConditions : emptyDisposalServiceConditions
  const CleaningServiceConditions = Lead.CleaningServiceConditions ? Lead.CleaningServiceConditions : emptyCleaningServiceConditions

  return (
    <>
      {/* Services */}

      <Route exact path={`${matchUrl}/conditions`}>
        {/* Previous page is one before so next gets calculated */}
        <Redirect to={matchUrl + getNextPage("/services/cleaning")} />
      </Route>

      {/* Conditions */}
      <Route
        exact
        path={`${matchUrl}/conditions/move`}
        render={routeProps => (
          <MoveConditions
            {...routeProps}
            moveConditions={MoveServiceConditions}
            moveService={moveService}
            onChangeAndSave={async moveConditions => {
              const lead = Lead
              const newLead = { ...lead, MoveServiceConditions: moveConditions }

              return handleChangeAndSave(newLead, "Lead", LeadAPI.SaveLead(newLead))
            }}
            nextPage={redirectToNextPage("/conditions/move")}
          />
        )}
      />

      {/* Conditions */}
      <Route
        exact
        path={`${matchUrl}/conditions/pack`}
        render={routeProps => (
          <PackConditions
            {...routeProps}
            packConditions={PackServiceConditions}
            onChangeAndSave={packConditions => {
              const lead = Lead
              const newLead = { ...lead, PackServiceConditions: packConditions }

              return handleChangeAndSave(newLead, "Lead", LeadAPI.SaveLead(newLead))
            }}
            nextPage={redirectToNextPage("/conditions/pack")}
          />
        )}
      />

      {/* Conditions */}
      <Route
        exact
        path={`${matchUrl}/conditions/storage`}
        render={routeProps => (
          <StorageConditions
            {...routeProps}
            storageConditions={StorageServiceConditions}
            storageService={storageService}
            onChangeAndSave={storageConditions => {
              const lead = Lead
              const newLead = { ...lead, StorageServiceConditions: storageConditions }

              return handleChangeAndSave(newLead, "Lead", LeadAPI.SaveLead(newLead))
            }}
            nextPage={redirectToNextPage("/conditions/storage")}
          />
        )}
      />

      {/* Conditions */}
      <Route
        exact
        path={`${matchUrl}/conditions/disposal`}
        render={routeProps => (
          <DisposalConditions
            {...routeProps}
            disposalConditions={DisposalServiceConditions}
            disposalService={disposalService}
            onChangeAndSave={disposalConditions => {
              const lead = Lead
              const newLead = { ...lead, DisposalServiceConditions: disposalConditions }

              return handleChangeAndSave(newLead, "Lead", LeadAPI.SaveLead(newLead))
            }}
            nextPage={redirectToNextPage("/conditions/disposal")}
          />
        )}
      />

      {/* Conditions */}
      <Route
        exact
        path={`${matchUrl}/conditions/cleaning`}
        render={routeProps => (
          <CleaningConditions
            {...routeProps}
            cleaningConditions={CleaningServiceConditions}
            cleaningService={cleaningService}
            onChangeAndSave={(cleaningConditions, cleaningServiceData) => {
              const lead = Lead
              const newLead = { ...lead, CleaningServiceConditions: cleaningConditions }

              return Promise.all([
                handleChangeAndSave(cleaningServiceData, "cleaningService", LeadAPI.SaveCleaningService(Lead.LeadId, cleaningServiceData)),
                handleChangeAndSave(newLead, "Lead", LeadAPI.SaveLead(newLead)),
              ])
            }}
            nextPage={redirectToNextPage("/conditions/cleaning")}
          />
        )}
      />

      {/* Offer */}
      <Route exact path={`${matchUrl}/offer`}>
        <Redirect to={`${matchUrl}/offer/generate`} />
      </Route>

      <Route
        exact
        path={`${matchUrl}/offer/generate`}
        render={routeProps => (
          <GenerateOffer {...routeProps} lead={Lead} buildingOptions={buildingOptions} nextPage={redirectToNextPage("/offer/generate")} onChange={handleChange} />
        )}
      />

      <Route exact path={`${matchUrl}/offer/preview`} render={routeProps => <PreviewOffer {...routeProps} lead={Lead} nextPage={redirectToNextPage("/offer/preview")} />} />
      <Route
        exact
        path={`${matchUrl}/offer/preview/:offerId`}
        render={routeProps => <PreviewOffer {...routeProps} lead={Lead} nextPage={redirectToNextPage("/offer/preview")} />}
      />

      <Route exact path={`${matchUrl}/offer/send`} render={routeProps => <SendOffer {...routeProps} lead={Lead} nextPage={redirectToNextPage("/offer/send")} />} />
      <Route exact path={`${matchUrl}/offer/send/:offerId`} render={routeProps => <SendOffer {...routeProps} lead={Lead} nextPage={redirectToNextPage("/offer/send")} />} />

      <Route exact path={`${matchUrl}/offer/done`} render={routeProps => <Done {...routeProps} lead={Lead} />} />
    </>
  )
}
