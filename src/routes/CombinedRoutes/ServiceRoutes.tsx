import React, { Component } from "react"
import { Route } from "react-router"
import LeadAPI, { ILeadContainer } from "../LeadAPI"
import { IBuildingCopy } from "../../components/FormikFields/Bundled/BuildingCopy"
import Services from "../Services";
import MoveService from "../Services/MoveService";
import CleaningService from "../Services/CleaningService";
import Inventory from "../Services/Inventory";
import DisposalService from "../Services/DisposalService";
import MaterialShop from "../Services/MaterialShop";
import PackService from "../Services/PackService";
import StorageService from "../Services/StorageService";
import { emptyMoveOutBuilding, emptyMoveInBuilding, emptyStorageBuilding, emptyCleaningBuilding, emptyDisposalOutBuilding } from "../../interfaces/IBuilding";
import { emptyCleaningService, emptyStorageService, emptyPackService, emptyDisposalService, emptyMoveService } from "../../interfaces/IService";
import { emptyMaterialOrder, ShopTypeEnum } from "../../interfaces/IShop";
import { InventoryKeysEnum, emptyInventory } from "../../interfaces/IInventars";

interface Props {
  leadContainer: ILeadContainer
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: Promise<any>) => void
  redirectToNextPage: (currentUrl: string) => () => void
  matchUrl: string
}

export default ({ leadContainer, redirectToNextPage, matchUrl, handleChangeAndSave }: Props) => {
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

  const moveOutBuilding = moveOut !== null ? moveOut : emptyMoveOutBuilding
  const moveInBuilding = moveIn !== null ? moveIn : emptyMoveInBuilding
  const storageBuilding = storage !== null ? storage : emptyStorageBuilding
  const disposalBuilding = disposal !== null ? disposal : emptyDisposalOutBuilding
  const cleaningBuilding = cleaning !== null ? cleaning : emptyCleaningBuilding

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
            data={services}
            onChangeAndSave={serviceData => {
              return handleChangeAndSave(serviceData, "services", LeadAPI.SaveServices(Lead.LeadId, serviceData))
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
            moveOut={moveOutBuilding}
            moveIn={moveInBuilding}
            moveService={moveService ? moveService : emptyMoveService}
            onChangeAndSave={(moveServiceData, moveInData, moveOutData) => {
              return Promise.all([
                handleChangeAndSave(moveServiceData, "moveService", LeadAPI.SaveMoveService(Lead.LeadId, moveServiceData)),
                handleChangeAndSave(moveOutData, "moveOut", LeadAPI.SaveMoveOut(moveOutData, Lead.LeadId)),
                handleChangeAndSave(moveInData, "moveIn", LeadAPI.SaveMoveIn(moveInData, Lead.LeadId)),
              ])
            }}
            nextPage={redirectToNextPage("/services/move")}
          />
        )}
      />

      {/* MoveShop */}
      <Route
        exact
        path={`${matchUrl}/services/move/material-shop`}
        render={routeProps => (
          <MaterialShop
            {...routeProps}
            materialOrder={materialOrder}
            onChangeAndSave={materialOrderData => {
              return handleChangeAndSave(materialOrderData, "materialOrder", LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrderData))
            }}
            shopTypeKey={ShopTypeEnum.Move}
            nextPage={redirectToNextPage("/services/move/material-shop")}
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
              return handleChangeAndSave(inventoryData, "inventory", LeadAPI.SaveInventoryService(Lead.LeadId, inventoryData))
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
            moveOut={moveOutBuilding}
            packService={packService}
            onChangeAndSave={(packServiceData, moveOutData) => {
              return Promise.all([
                handleChangeAndSave(packServiceData, "packService", LeadAPI.SavePackService(Lead.LeadId, packServiceData)),
                handleChangeAndSave(moveOutData, "moveOut", LeadAPI.SaveMoveOut(moveOutData, Lead.LeadId)),
              ])
            }}
            nextPage={redirectToNextPage("/services/pack")}
          />
        )}
      />

      {/* PackShop */}
      <Route
        exact
        path={`${matchUrl}/services/pack/material-shop`}
        render={routeProps => (
          <MaterialShop
            {...routeProps}
            materialOrder={materialOrder ? materialOrder : emptyMaterialOrder}
            onChangeAndSave={materialOrderData => {
              return handleChangeAndSave(materialOrderData, "materialOrder", LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrderData))
            }}
            shopTypeKey={ShopTypeEnum.Pack}
            nextPage={redirectToNextPage("/services/pack/material-shop")}
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
            storage={storageBuilding}
            storageService={storageService ? storageService : emptyStorageService}
            onChangeAndSave={(storageServiceData, storageData) => {
              return Promise.all([
                handleChangeAndSave(storageServiceData, "storageService", LeadAPI.SaveStorageService(Lead.LeadId, storageServiceData)),
                handleChangeAndSave(storageData, "storage", LeadAPI.SaveStorage(storageData, Lead.LeadId)),
              ])
            }}
            nextPage={redirectToNextPage("/services/storage")}
          />
        )}
      />

      {/* StorageShop */}
      <Route
        exact
        path={`${matchUrl}/services/storage/material-shop`}
        render={routeProps => (
          <MaterialShop
            {...routeProps}
            materialOrder={materialOrder ? materialOrder : emptyMaterialOrder}
            onChangeAndSave={materialOrderData => {
              return handleChangeAndSave(materialOrderData, "materialOrder", LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrderData))
            }}
            shopTypeKey={ShopTypeEnum.Storage}
            nextPage={redirectToNextPage("/services/storage/material-shop")}
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
              return handleChangeAndSave(inventoryData, "inventory", LeadAPI.SaveInventoryService(Lead.LeadId, inventoryData))
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
            disposal={disposalBuilding}
            disposalService={disposalService ? disposalService : emptyDisposalService}
            HasMoveService={services.HasMoveServiceEnabled}
            onChangeAndSave={(disposalServiceData, disposalData) => {
              return Promise.all([
                handleChangeAndSave(disposalServiceData, "disposalService", LeadAPI.SaveDisposalService(Lead.LeadId, disposalServiceData)),
                handleChangeAndSave(disposalData, "disposal", LeadAPI.SaveDisposal(disposalData, Lead.LeadId)),
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
              return handleChangeAndSave(inventoryData, "inventory", LeadAPI.SaveInventoryService(Lead.LeadId, inventoryData))
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
            cleaning={cleaningBuilding}
            buildingOptions={buildingOptions}
            cleaningService={cleaningService ? cleaningService : emptyCleaningService}
            onChangeAndSave={(cleaningServiceData, cleaningData) => {
              return Promise.all([
                handleChangeAndSave(cleaningServiceData, "cleaningService", LeadAPI.SaveCleaningService(Lead.LeadId, cleaningServiceData)),
                handleChangeAndSave(cleaningData, "cleaning", LeadAPI.SaveCleaning(cleaningData, Lead.LeadId)),
              ])
            }}
            nextPage={redirectToNextPage("/services/cleaning")}
          />
        )}
      />
    </>
  )
}

// const () => {
//   {/* Customer */}
//

//

//               <Route exact path={`${match.url}/conditions`}>
//                 {/* Previous page is one before so next gets calculated */}
//                 <Redirect to={match.url + this.nextPageFunction("/services/cleaning")} />
//               </Route>

//               {/* Conditions */}
//               <Route
//                 exact
//                 path={`${match.url}/conditions/move`}
//                 render={routeProps => (
//                   <MoveConditions
//                     {...routeProps}
//                     moveConditions={Lead.MoveServiceConditions ? Lead.MoveServiceConditions : emptyMoveServiceConditions}
//                     moveService={moveService ? moveService : emptyMoveService}
//                     onChangeAndSave={moveConditions => {
//                       const newLead = { ...Lead, MoveServiceConditions: moveConditions }
//                       this.handleChange(newLead, "Lead")

//                       return Promise.all([this.Save()])
//                     }}
//                     nextPage={this.redirectToNextPage("/conditions/move")}
//                   />
//                 )}
//               />

//               {/* Conditions */}
//               <Route
//                 exact
//                 path={`${match.url}/conditions/pack`}
//                 render={routeProps => (
//                   <PackConditions
//                     {...routeProps}
//                     packConditions={Lead.PackServiceConditions ? Lead.PackServiceConditions : emptyPackServiceConditions}
//                     onChangeAndSave={packConditions => {
//                       const newLead = { ...Lead, PackServiceConditions: packConditions }
//                       this.handleChange(newLead, "Lead")

//                       return Promise.all([this.Save()])
//                     }}
//                     nextPage={this.redirectToNextPage("/conditions/pack")}
//                   />
//                 )}
//               />

//               {/* Conditions */}
//               <Route
//                 exact
//                 path={`${match.url}/conditions/storage`}
//                 render={routeProps => (
//                   <StorageConditions
//                     {...routeProps}
//                     storageConditions={Lead.StorageServiceConditions ? Lead.StorageServiceConditions : emptyStorageServiceConditions}
//                     storageService={storageService ? storageService : emptyStorageService}
//                     onChangeAndSave={storageConditions => {
//                       const newLead = { ...Lead, StorageServiceConditions: storageConditions }
//                       this.handleChange(newLead, "Lead")

//                       return Promise.all([this.Save()])
//                     }}
//                     nextPage={this.redirectToNextPage("/conditions/storage")}
//                   />
//                 )}
//               />

//               {/* Conditions */}
//               <Route
//                 exact
//                 path={`${match.url}/conditions/disposal`}
//                 render={routeProps => (
//                   <DisposalConditions
//                     {...routeProps}
//                     disposalConditions={Lead.DisposalServiceConditions ? Lead.DisposalServiceConditions : emptyDisposalServiceConditions}
//                     disposalService={disposalService ? disposalService : emptyDisposalService}
//                     onChangeAndSave={disposalConditions => {
//                       const newLead = { ...Lead, DisposalServiceConditions: disposalConditions }
//                       this.handleChange(newLead, "Lead")

//                       return Promise.all([this.Save()])
//                     }}
//                     nextPage={this.redirectToNextPage("/conditions/disposal")}
//                   />
//                 )}
//               />

//               {/* Conditions */}
//               <Route
//                 exact
//                 path={`${match.url}/conditions/cleaning`}
//                 render={routeProps => (
//                   <CleaningConditions
//                     {...routeProps}
//                     cleaningConditions={Lead.CleaningServiceConditions ? Lead.CleaningServiceConditions : emptyCleaningServiceConditions}
//                     cleaningService={cleaningService ? cleaningService : emptyCleaningService}
//                     onChangeAndSave={cleaningConditions => {
//                       const newLead = { ...Lead, CleaningServiceConditions: cleaningConditions }
//                       this.handleChange(newLead, "Lead")

//                       return Promise.all([this.Save()])
//                     }}
//                     nextPage={this.redirectToNextPage("/conditions/cleaning")}
//                   />
//                 )}
//               />

//               {/* Offer */}
//               <Route exact path={`${match.url}/offer`}>
//                 <Redirect to={`${match.url}/offer/generate`} />
//               </Route>

//               <Route
//                 exact
//                 path={`${match.url}/offer/generate`}
//                 render={routeProps => <Generate {...routeProps} lead={Lead} buildingOptions={buildingOptions} nextPage={this.redirectToNextPage("/offer/generate")} />}
//               />

//               <Route
//                 exact
//                 path={`${match.url}/offer/preview`}
//                 render={routeProps => <PreviewOffer {...routeProps} lead={Lead} nextPage={this.redirectToNextPage("/offer/preview")} />}
//               />
// }

export const test = 1

// const buildingOptions: IBuildingCopy = {
//   moveOutBuilding: moveOut,
//   moveInBuilding: moveIn,
//   cleaningBuilding: cleaning,
//   storageBuilding: storage,
//   disposalBuilding: disposal,
// }
