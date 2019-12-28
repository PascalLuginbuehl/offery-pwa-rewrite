import React, { Component } from "react"
import { Route } from "react-router"
import NewCustomer from "../Customer/NewCustomer"
import LeadAPI, { ILeadContainer } from "../LeadAPI"
import MoveOutBuilding from "../Customer/MoveOutBuilding"
import EmailConfirmation from "../Customer/EmailConfirmation"
import CleaningBuilding from "../Customer/CleaningBuilding"
import DisposalBuilding from "../Customer/DisposalBuilding"
import StorageBuilding from "../Customer/StorageBuilding"
import MoveInBuilding from "../Customer/MoveInBuilding"
import { emptyMoveOutBuilding, emptyMoveInBuilding, emptyStorageBuilding, emptyDisposalOutBuilding, emptyCleaningBuilding } from "../../../interfaces/IBuilding"
import { IBuildingCopy } from "../../../components/FormikFields/Bundled/BuildingCopy"
import { ICustomer, ILead } from "../../../interfaces/ILead"

interface Props {
  leadContainer: ILeadContainer
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: Promise<any>) => Promise<void>
  redirectToNextPage: (currentUrl: string) => () => void
  matchUrl: string
  handleChange: (value: any, name: keyof ILeadContainer) => void
}

export default function BuidlingRoutes({ leadContainer, redirectToNextPage, matchUrl, handleChangeAndSave, handleChange }: Props) {
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
              return handleChangeAndSave(lead, "Lead", LeadAPI.SaveLead(lead as ILead))
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
            onChangeAndSave={async newMoveOutBuilding => {
              const createdMoveOut = await LeadAPI.SaveMoveOut(newMoveOutBuilding, Lead.LeadId)
              handleChange(createdMoveOut, "moveOut")
              return
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
            onChangeAndSave={async newMoveInBuilding => {
              const createdMoveIn = await LeadAPI.SaveMoveIn(newMoveInBuilding, Lead.LeadId)
              handleChange(createdMoveIn, "moveIn")
              return
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
            onChangeAndSave={async newStorageBuilding => {
              const createdStorage = await LeadAPI.SaveStorage(newStorageBuilding, Lead.LeadId)
              handleChange(createdStorage, "storage")
              return
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
            onChangeAndSave={async newDisposalBuilding => {
              const createdDisposal = await LeadAPI.SaveDisposal(newDisposalBuilding, Lead.LeadId)
              handleChange(createdDisposal, "disposal")
              return
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
            onChangeAndSave={async newCleaningBuilding => {
              const createdCleaning = await LeadAPI.SaveCleaning(newCleaningBuilding, Lead.LeadId)
              handleChange(createdCleaning, "cleaning")
              return
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