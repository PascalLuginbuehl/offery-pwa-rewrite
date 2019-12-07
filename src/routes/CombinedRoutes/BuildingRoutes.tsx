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
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: Promise<any>) => void
  redirectToNextPage: (currentUrl: string) => () => void
  matchUrl: string
}

export default ({ leadContainer, redirectToNextPage, matchUrl, handleChangeAndSave }: Props) => {
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
