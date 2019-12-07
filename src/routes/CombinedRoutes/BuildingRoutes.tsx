import React, { Component } from 'react';
import { Route } from "react-router";
import NewCustomer from "../Customer/NewBuildings/NewCustomer";
import LeadAPI, { ILeadContainer } from "../LeadAPI";
import MoveOutBuilding from "../Customer/NewBuildings/MoveOutBuilding";
import EmailConfirmation from "../Customer/NewBuildings/EmailConfirmation";
import CleaningBuilding from "../Customer/NewBuildings/CleaningBuilding";
import DisposalBuilding from "../Customer/NewBuildings/DisposalBuilding";
import StorageBuilding from "../Customer/NewBuildings/StorageBuilding";
import MoveInBuilding from "../Customer/NewBuildings/MoveInBuilding";
import { emptyMoveOutBuilding, emptyMoveInBuilding, emptyStorageBuilding, emptyDisposalOutBuilding, emptyCleaningBuilding } from "../../interfaces/IBuilding";
import { IBuildingCopy } from "../../components/FormikFields/Bundled/BuildingCopy";
import { ICustomer } from '../../interfaces/ILead';

interface Props {
  leadContainer: ILeadContainer
  handleChange: (value: any, name: keyof ILeadContainer) => void
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: Promise<any>) => void
  redirectToNextPage: (currentUrl: string) => () => void
  matchUrl: string
}

export default ({ leadContainer, handleChange, redirectToNextPage, matchUrl, handleChangeAndSave }: Props) => {
  const { Lead, moveOut, moveIn, storage, disposal, cleaning } = leadContainer

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

  return (
    <>
      <Route
        exact
        path={`${matchUrl}/building`}
        render={routeProps => (
          <NewCustomer
            {...routeProps}
            lead={Lead}
            onChangeAndSave={lead => {
              // Fixing PostLead to Lead back together
              handleChangeAndSave(
                lead,
                "Lead",
                LeadAPI.SaveLead({
                  ...lead,
                  Customer: lead.Customer as ICustomer,
                  VisitDate: lead.VisitDate ? lead.VisitDate : Lead.VisitDate,
                  LeadId: Lead.LeadId,
                  StatusHistories: Lead.StatusHistories,
                  Created: Lead.Created,
                  Offers: Lead.Offers,
                  Status: Lead.Status,
                  FromAddress: Lead.FromAddress,
                  ToAddress: Lead.ToAddress,
                })
              )
            }}
            nextPage={redirectToNextPage("/building")}
          />
        )}
      />

      {/* Move-Out */}
      <Route
        exact
        path={`${matchUrl}/building/move-out`}
        render={routeProps => (
          <MoveOutBuilding
            {...routeProps}
            moveOutBuilding={moveOutBuilding}
            onChangeAndSave={newMoveOutBuilding => {
              return handleChangeAndSave(newMoveOutBuilding, "moveOut", LeadAPI.SaveMoveOut(newMoveOutBuilding, Lead.LeadId))
            }}
            nextPage={redirectToNextPage("/building/move-out")}
          />
        )}
      />

      {/* Move-In */}
      <Route
        exact
        path={`${matchUrl}/building/move-in`}
        render={routeProps => (
          <MoveInBuilding
            {...routeProps}
            moveInBuilding={moveInBuilding}
            onChangeAndSave={newMoveInBuilding => {
              return handleChangeAndSave(newMoveInBuilding, "moveIn", LeadAPI.SaveMoveIn(newMoveInBuilding, Lead.LeadId))
            }}
            nextPage={redirectToNextPage("/building/move-in")}
          />
        )}
      />

      {/* storage */}
      <Route
        exact
        path={`${matchUrl}/building/storage`}
        render={routeProps => (
          <StorageBuilding
            {...routeProps}
            storageBuilding={storageBuilding}
            onChangeAndSave={newStorageBuilding => {
              handleChange(newStorageBuilding, "storage")
              return handleChangeAndSave(newStorageBuilding, "storage", LeadAPI.SaveStorage(newStorageBuilding, Lead.LeadId))
            }}
            nextPage={redirectToNextPage("/building/storage")}
          />
        )}
      />

      {/* disposal */}
      <Route
        exact
        path={`${matchUrl}/building/disposal`}
        render={routeProps => (
          <DisposalBuilding
            {...routeProps}
            disposalBuilding={disposalBuilding}
            onChangeAndSave={newDisposalBuilding => {
              return handleChangeAndSave(newDisposalBuilding, "disposal", LeadAPI.SaveDisposal(newDisposalBuilding, Lead.LeadId))
            }}
            nextPage={redirectToNextPage("/building/disposal")}
          />
        )}
      />

      {/* Cleaning */}
      <Route
        exact
        path={`${matchUrl}/building/cleaning`}
        render={routeProps => (
          <CleaningBuilding
            {...routeProps}
            cleaningBuilding={cleaningBuilding}
            onChangeAndSave={newCleaningBuilding => {
              return handleChangeAndSave(newCleaningBuilding, "cleaning", LeadAPI.SaveCleaning(newCleaningBuilding, Lead.LeadId))
            }}
            nextPage={redirectToNextPage("/building/cleaning")}
          />
        )}
      />

      {/* E-Mail confirmation */}
      <Route
        exact
        path={`${matchUrl}/building/email-confirmation`}
        render={routeProps => <EmailConfirmation {...routeProps} lead={Lead} buildingOptions={buildingOptions} nextPage={redirectToNextPage("/building/email-confirmation")} />}
      />
    </>
  )
}


// const () => {
//   {/* Customer */}
//

//               {/* Services */}
//               <Route
//                 exact
//                 path={`${match.url}/services`}
//                 render={routeProps => (
//                   <Services
//                     {...routeProps}
//                     data={services}
//                     onChangeAndSave={serviceData => {
//                       this.handleChange(serviceData, "services")
//                       return LeadAPI.SaveServices(Lead.LeadId, serviceData)
//                     }}
//                     nextPage={this.redirectToNextPage("/services")}
//                   />
//                 )}
//               />

//               {/* MoveService */}
//               <Route
//                 exact
//                 path={`${match.url}/services/move`}
//                 render={routeProps => (
//                   <MoveService
//                     {...routeProps}
//                     moveOut={moveOut}
//                     moveIn={moveIn}
//                     moveService={moveService ? moveService : emptyMoveService}
//                     onChangeAndSave={(serviceData, moveIn, moveOut) => {
//                       this.handleChange(serviceData, "moveService")
//                       this.handleChange(moveOut, "moveOut")
//                       this.handleChange(moveIn, "moveIn")

//                       return Promise.all([LeadAPI.SaveMoveOut(moveOut, Lead.LeadId), LeadAPI.SaveMoveIn(moveIn, Lead.LeadId), LeadAPI.SaveMoveService(Lead.LeadId, serviceData)])
//                     }}
//                     nextPage={this.redirectToNextPage("/services/move")}
//                   />
//                 )}
//               />

//               {/* MoveShop */}
//               <Route
//                 exact
//                 path={`${match.url}/services/move/material-shop`}
//                 render={routeProps => (
//                   <MaterialShop
//                     {...routeProps}
//                     materialOrder={materialOrder ? materialOrder : emptyMaterialOrder}
//                     onChangeAndSave={materialOrder => {
//                       this.handleChange(materialOrder, "materialOrder")

//                       return LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrder)
//                     }}
//                     shopTypeKey={ShopTypeEnum.Move}
//                     nextPage={this.redirectToNextPage("/services/move/material-shop")}
//                   />
//                 )}
//               />

//               {/* Move Inventory */}
//               <Route
//                 exact
//                 path={`${match.url}/services/move/inventory`}
//                 render={routeProps => (
//                   <Inventory
//                     {...routeProps}
//                     inventory={inventory ? inventory : emptyInventory}
//                     onChangeAndSave={inventory => {
//                       this.handleChange(inventory, "inventory")

//                       return LeadAPI.SaveInventoryService(Lead.LeadId, inventory)
//                     }}
//                     initalInventoryTypeKey={InventoryKeysEnum.Move}
//                     nextPage={this.redirectToNextPage("/services/move/inventory")}
//                   />
//                 )}
//               />

//               {/* PackService */}
//               <Route
//                 exact
//                 path={`${match.url}/services/pack`}
//                 render={routeProps => (
//                   <PackService
//                     {...routeProps}
//                     moveOut={moveOut}
//                     packService={packService ? packService : emptyPackService}
//                     onChangeAndSave={(serviceData, moveOut) => {
//                       this.handleChange(serviceData, "packService")
//                       this.handleChange(moveOut, "moveOut")

//                       return Promise.all([LeadAPI.SaveMoveOut(moveOut, Lead.LeadId), LeadAPI.SavePackService(Lead.LeadId, serviceData)])
//                     }}
//                     nextPage={this.redirectToNextPage("/services/pack")}
//                   />
//                 )}
//               />

//               {/* PackShop */}
//               <Route
//                 exact
//                 path={`${match.url}/services/pack/material-shop`}
//                 render={routeProps => (
//                   <MaterialShop
//                     {...routeProps}
//                     materialOrder={materialOrder ? materialOrder : emptyMaterialOrder}
//                     onChangeAndSave={materialOrder => {
//                       this.handleChange(materialOrder, "materialOrder")

//                       return LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrder)
//                     }}
//                     shopTypeKey={ShopTypeEnum.Pack}
//                     nextPage={this.redirectToNextPage("/services/pack/material-shop")}
//                   />
//                 )}
//               />

//               {/* StorageService */}
//               <Route
//                 exact
//                 path={`${match.url}/services/storage`}
//                 render={routeProps => (
//                   <StorageService
//                     {...routeProps}
//                     storage={storage}
//                     storageService={storageService ? storageService : emptyStorageService}
//                     onChangeAndSave={(serviceData, storage) => {
//                       this.handleChange(serviceData, "storageService")
//                       this.handleChange(storage, "storage")

//                       return Promise.all([LeadAPI.SaveStorage(storage, Lead.LeadId), LeadAPI.SaveStorageService(Lead.LeadId, serviceData)])
//                     }}
//                     nextPage={this.redirectToNextPage("/services/storage")}
//                   />
//                 )}
//               />

//               {/* StorageShop */}
//               <Route
//                 exact
//                 path={`${match.url}/services/storage/material-shop`}
//                 render={routeProps => (
//                   <MaterialShop
//                     {...routeProps}
//                     materialOrder={materialOrder ? materialOrder : emptyMaterialOrder}
//                     onChangeAndSave={materialOrder => {
//                       this.handleChange(materialOrder, "materialOrder")

//                       return LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrder)
//                     }}
//                     shopTypeKey={ShopTypeEnum.Storage}
//                     nextPage={this.redirectToNextPage("/services/storage/material-shop")}
//                   />
//                 )}
//               />

//               {/* Pack Inventory */}
//               <Route
//                 exact
//                 path={`${match.url}/services/storage/inventory`}
//                 render={routeProps => (
//                   <Inventory
//                     {...routeProps}
//                     inventory={inventory ? inventory : emptyInventory}
//                     onChangeAndSave={inventory => {
//                       this.handleChange(inventory, "inventory")

//                       return LeadAPI.SaveInventoryService(Lead.LeadId, inventory)
//                     }}
//                     initalInventoryTypeKey={InventoryKeysEnum.Storage}
//                     nextPage={this.redirectToNextPage("/services/storage/inventory")}
//                   />
//                 )}
//               />

//               {/* Disposal */}
//               <Route
//                 exact
//                 path={`${match.url}/services/disposal`}
//                 render={routeProps => (
//                   <DisposalService
//                     {...routeProps}
//                     disposal={disposal}
//                     disposalService={disposalService ? disposalService : emptyDisposalService}
//                     HasMoveService={services.HasMoveServiceEnabled}
//                     onChangeAndSave={(serviceData, disposal) => {
//                       this.handleChange(serviceData, "disposalService")
//                       this.handleChange(disposal, "disposal")

//                       return Promise.all([LeadAPI.SaveDisposal(disposal, Lead.LeadId), LeadAPI.SaveDisposalService(Lead.LeadId, serviceData)])
//                     }}
//                     nextPage={this.redirectToNextPage("/services/disposal")}
//                   />
//                 )}
//               />

//               {/* Disposal Inventory */}
//               <Route
//                 exact
//                 path={`${match.url}/services/disposal/inventory`}
//                 render={routeProps => (
//                   <Inventory
//                     {...routeProps}
//                     inventory={inventory ? inventory : emptyInventory}
//                     onChangeAndSave={inventory => {
//                       this.handleChange(inventory, "inventory")

//                       return LeadAPI.SaveInventoryService(Lead.LeadId, inventory)
//                     }}
//                     initalInventoryTypeKey={InventoryKeysEnum.Disposal}
//                     nextPage={this.redirectToNextPage("/services/disposal/inventory")}
//                   />
//                 )}
//               />

//               {/* Disposal */}
//               <Route
//                 exact
//                 path={`${match.url}/services/cleaning`}
//                 render={routeProps => (
//                   <CleaningService
//                     {...routeProps}
//                     cleaning={cleaning ? cleaning : emptyCleaningBuilding}
//                     buildingOptions={buildingOptions}
//                     cleaningService={cleaningService ? cleaningService : emptyCleaningService}
//                     onChangeAndSave={(serviceData, cleaning) => {
//                       this.handleChange(serviceData, "cleaningService")
//                       this.handleChange(cleaning, "cleaning")

//                       return Promise.all([LeadAPI.SaveMoveOut(moveOut, Lead.LeadId), LeadAPI.SaveCleaningService(Lead.LeadId, serviceData)])
//                     }}
//                     nextPage={this.redirectToNextPage("/services/cleaning")}
//                   />
//                 )}
//               />

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
