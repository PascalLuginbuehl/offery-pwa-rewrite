import React, { Component } from 'react';
import { Route } from "react-router";
import NewCustomer from "../Customer/NewCustomer";
import LeadAPI, { ILeadContainer } from "../LeadAPI";
import MoveOutBuilding from "../Customer/MoveOutBuilding";
import EmailConfirmation from "../Customer/EmailConfirmation";
import CleaningBuilding from "../Customer/CleaningBuilding";
import DisposalBuilding from "../Customer/DisposalBuilding";
import StorageBuilding from "../Customer/StorageBuilding";
import MoveInBuilding from "../Customer/MoveInBuilding";
import { emptyMoveOutBuilding, emptyMoveInBuilding, emptyStorageBuilding, emptyDisposalOutBuilding, emptyCleaningBuilding } from "../../interfaces/IBuilding";
import { IBuildingCopy } from "../../components/FormikFields/Bundled/BuildingCopy";
import { ICustomer } from '../../interfaces/ILead';

interface Props {
  leadContainer: ILeadContainer
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: Promise<any>) => void
  redirectToNextPage: (currentUrl: string) => () => void
  matchUrl: string
  handleChange: (value: any, name: keyof ILeadContainer) => void
}

export default ({ leadContainer, redirectToNextPage, matchUrl, handleChangeAndSave, handleChange }: Props) => {
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
            buildingOptions={buildingOptions}
            moveOutBuilding={moveOutBuilding}
            onChangeAndSave={async (newMoveOutBuilding) => {
              try {
                const createdMoveOut = await LeadAPI.SaveMoveOut(newMoveOutBuilding, Lead.LeadId)
                handleChange(createdMoveOut, "moveOut")
                return
              } catch (e) {
                throw e
              }
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
            buildingOptions={buildingOptions}
            moveInBuilding={moveInBuilding}
            onChangeAndSave={async (newMoveInBuilding) => {
              try {
                const createdMoveIn = await LeadAPI.SaveMoveIn(newMoveInBuilding, Lead.LeadId)
                handleChange(createdMoveIn, "moveIn")
                return
              } catch (e) {
                throw e
              }
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
            buildingOptions={buildingOptions}
            storageBuilding={storageBuilding}
            onChangeAndSave={async (newStorageBuilding) => {
              try {
                const createdStorage = await LeadAPI.SaveStorage(newStorageBuilding, Lead.LeadId)
                handleChange(createdStorage, "storage")
                return
              } catch (e) {
                throw e
              }
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
            buildingOptions={buildingOptions}
            disposalBuilding={disposalBuilding}
            onChangeAndSave={async (newDisposalBuilding) => {
              try {
                const createdDisposal = await LeadAPI.SaveDisposal(newDisposalBuilding, Lead.LeadId)
                handleChange(createdDisposal, "disposal")
                return
              } catch (e) {
                throw e
              }
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
            buildingOptions={buildingOptions}
            cleaningBuilding={cleaningBuilding}
            onChangeAndSave={async (newCleaningBuilding) => {
              try {
                const createdCleaning = await LeadAPI.SaveCleaning(newCleaningBuilding, Lead.LeadId)
                handleChange(createdCleaning, "cleaning")
                return
              } catch (e) {
                throw e
              }
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
