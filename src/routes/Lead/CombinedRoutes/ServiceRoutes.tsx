import React from "react"
import { Route } from "react-router"
import LeadAPI, { ILeadContainer } from "../LeadAPI"
import Services from "../Services"
import MoveService from "../Services/MoveService"
import CleaningService from "../Services/CleaningService"
import Inventory from "../Services/Inventory"
import DisposalService from "../Services/DisposalService"
import MaterialShop from "../Services/MaterialShop"
import PackService from "../Services/PackService"
import StorageService from "../Services/StorageService"
import { emptyCleaningService, emptyStorageService, emptyPackService, emptyDisposalService, emptyMoveService } from "../../../interfaces/IService"
import { emptyMaterialOrder } from "../../../interfaces/IShop"
import { InventoryKeysEnum, emptyInventory } from "../../../interfaces/IInventars"


interface Props {
  leadContainer: ILeadContainer
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: () => Promise<any>) => Promise<any>
  redirectToNextPage: (currentUrl: string) => () => void
  matchUrl: string
}

export default function ServiceRoutes({ leadContainer, redirectToNextPage, matchUrl, handleChangeAndSave }: Props) {
  const {
    Lead,
    buildings,
    moveService: moveServiceNull,
    disposalService: disposalServiceNull,
    packService: packServiceNull,
    storageService: storageServiceNull,
    cleaningService: cleaningServiceNull,
    materialOrder: materialOrderNull,
    inventory: inventoryNull,
  } = leadContainer

  const moveService = moveServiceNull ? moveServiceNull : emptyMoveService
  const disposalService = disposalServiceNull ? disposalServiceNull : emptyDisposalService
  const packService = packServiceNull ? packServiceNull : emptyPackService
  const storageService = storageServiceNull ? storageServiceNull : emptyStorageService
  const cleaningService = cleaningServiceNull ? cleaningServiceNull : emptyCleaningService

  const materialOrder = materialOrderNull ? materialOrderNull : emptyMaterialOrder
  const inventory = inventoryNull ? inventoryNull : emptyInventory
  return (
    <>
      {/* Services */}
      <Route
        exact
        path={`${matchUrl}/services`}
        render={routeProps => (
          <Services
            {...routeProps}
            data={Lead.Services}
            onChangeAndSave={serviceData => {
              const lead = { ...Lead, Services: serviceData }
              return handleChangeAndSave(lead, "Lead", () => LeadAPI.SaveLead(lead))
            }}
            nextPage={redirectToNextPage("/services")}
          />
        )}
      />

      {/* MoveService */}
      <Route
        exact
        path={`${matchUrl}/services/move`}
        render={routeProps => (
          <MoveService
            {...routeProps}
            buildings={buildings}
            lead={Lead}
            moveService={moveService ? moveService : emptyMoveService}
            onChangeAndSave={(moveServiceData, lead) => {
              return Promise.all([
                handleChangeAndSave(moveServiceData, "moveService", () => LeadAPI.SaveMoveService(Lead.LeadId, moveServiceData)),
                // handleChangeAndSave(moveOutData, "moveOut", () => LeadAPI.SaveMoveOut(moveOutData, Lead.LeadId)),
                // handleChangeAndSave(moveInData, "moveIn", () => LeadAPI.SaveMoveIn(moveInData, Lead.LeadId)),
                handleChangeAndSave(lead, "Lead", () => LeadAPI.SaveLead(lead)),
              ])
            }}
            onSaveNestedBuilding={(building) => {
              return handleChangeAndSave(buildings, "buildings", () => LeadAPI.SaveBuilding(building))
            }}
            nextPage={redirectToNextPage("/services/move")}
          />
        )}
      />

      {/* Move Inventory */}
      <Route
        exact
        path={`${matchUrl}/services/move/inventory`}
        render={routeProps => (
          <Inventory
            {...routeProps}
            inventory={inventory}
            onChangeAndSave={inventoryData => {
              return handleChangeAndSave(inventoryData, "inventory", () => LeadAPI.SaveInventoryService(Lead.LeadId, inventoryData))
            }}
            initalInventoryTypeKey={InventoryKeysEnum.Move}
            nextPage={redirectToNextPage("/services/move/inventory")}
          />
        )}
      />

      {/* PackService */}
      <Route
        exact
        path={`${matchUrl}/services/pack`}
        render={routeProps => (
          <PackService
            {...routeProps}
            buildings={buildings}
            packService={packService}
            lead={Lead}
            onSaveNestedBuilding={(building) => {
              return handleChangeAndSave(buildings, "buildings", () => LeadAPI.SaveBuilding(building))
            }}
            onChangeAndSave={(packServiceData, lead) => {
              return Promise.all([
                handleChangeAndSave(packServiceData, "packService", () => LeadAPI.SavePackService(Lead.LeadId, packServiceData)),
                // handleChangeAndSave(moveOutData, "moveOut", () => LeadAPI.SaveMoveOut(moveOutData, Lead.LeadId)),
                handleChangeAndSave(lead, "Lead", () => LeadAPI.SaveLead(lead)),
              ])
            }}
            nextPage={redirectToNextPage("/services/pack")}
          />
        )}
      />

      {/* StorageService */}
      <Route
        exact
        path={`${matchUrl}/services/storage`}
        render={routeProps => (
          <StorageService
            {...routeProps}
            lead={Lead}
            onSaveNestedBuilding={(building) => {
              return handleChangeAndSave(buildings, "buildings", () => LeadAPI.SaveBuilding(building))
            }}
            buildings={buildings}
            storageService={storageService ? storageService : emptyStorageService}
            onChangeAndSave={(storageServiceData, lead) => {
              return Promise.all([
                handleChangeAndSave(storageServiceData, "storageService", () => LeadAPI.SaveStorageService(Lead.LeadId, storageServiceData)),
                // handleChangeAndSave(storageData, "storage", () => LeadAPI.SaveStorage(storageData, Lead.LeadId)),
                handleChangeAndSave(lead, "Lead", () => LeadAPI.SaveLead(lead)),
              ])
            }}
            nextPage={redirectToNextPage("/services/storage")}
          />
        )}
      />

      {/* Pack Inventory */}
      <Route
        exact
        path={`${matchUrl}/services/storage/inventory`}
        render={routeProps => (
          <Inventory
            {...routeProps}
            inventory={inventory ? inventory : emptyInventory}
            onChangeAndSave={inventoryData => {
              return handleChangeAndSave(inventoryData, "inventory", () => LeadAPI.SaveInventoryService(Lead.LeadId, inventoryData))
            }}
            initalInventoryTypeKey={InventoryKeysEnum.Storage}
            nextPage={redirectToNextPage("/services/storage/inventory")}
          />
        )}
      />

      {/* Disposal */}
      <Route
        exact
        path={`${matchUrl}/services/disposal`}
        render={routeProps => (
          <DisposalService
            {...routeProps}
            buildings={buildings}
            lead={Lead}
            onSaveNestedBuilding={(building) => {
              return handleChangeAndSave(buildings, "buildings", () => LeadAPI.SaveBuilding(building))
            }}
            disposalService={disposalService ? disposalService : emptyDisposalService}
            onChangeAndSave={(disposalServiceData, lead) => {
              return Promise.all([
                handleChangeAndSave(disposalServiceData, "disposalService", () => LeadAPI.SaveDisposalService(Lead.LeadId, disposalServiceData)),
                // handleChangeAndSave(disposalData, "disposal", () => LeadAPI.SaveDisposal(disposalData, Lead.LeadId)),
                handleChangeAndSave(lead, "Lead", () => LeadAPI.SaveLead(lead)),
              ])
            }}
            nextPage={redirectToNextPage("/services/disposal")}
          />
        )}
      />

      {/* Disposal Inventory */}
      <Route
        exact
        path={`${matchUrl}/services/disposal/inventory`}
        render={routeProps => (
          <Inventory
            {...routeProps}
            inventory={inventory ? inventory : emptyInventory}
            onChangeAndSave={inventoryData => {
              return handleChangeAndSave(inventoryData, "inventory", () => LeadAPI.SaveInventoryService(Lead.LeadId, inventoryData))
            }}
            initalInventoryTypeKey={InventoryKeysEnum.Disposal}
            nextPage={redirectToNextPage("/services/disposal/inventory")}
          />
        )}
      />

      {/* Disposal */}
      <Route
        exact
        path={`${matchUrl}/services/cleaning`}
        render={routeProps => (
          <CleaningService
            {...routeProps}
            buildings={buildings}
            lead={Lead}
            onSaveNestedBuilding={(building) => {
              return handleChangeAndSave(buildings, "buildings", () => LeadAPI.SaveBuilding(building))
            }}
            cleaningService={cleaningService ? cleaningService : emptyCleaningService}
            onChangeAndSave={(cleaningServiceData, lead) => {
              return Promise.all([
                handleChangeAndSave(cleaningServiceData, "cleaningService", () => LeadAPI.SaveCleaningService(Lead.LeadId, cleaningServiceData)),
                // handleChangeAndSave(cleaningData, "cleaning", () => LeadAPI.SaveCleaning(cleaningData, Lead.LeadId)),
                handleChangeAndSave(lead, "Lead", () => LeadAPI.SaveLead(lead)),
              ])
            }}
            nextPage={redirectToNextPage("/services/cleaning")}
          />
        )}
      />

      {/* MaterialShop */}
      <Route
        exact
        path={`${matchUrl}/services/material-shop`}
        render={routeProps => (
          <MaterialShop
            {...routeProps}
            materialOrder={materialOrder ? materialOrder : emptyMaterialOrder}
            lead={Lead}
            onChangeAndSave={(materialOrderData, lead) => {
              return Promise.all([
                handleChangeAndSave(materialOrderData, "materialOrder", () => LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrderData)),
                handleChangeAndSave(lead, "Lead", () => LeadAPI.SaveLead(lead)),
              ])
            }}
            nextPage={redirectToNextPage("/services/material-shop")}
          />
        )}
      />

    </>
  )
}
