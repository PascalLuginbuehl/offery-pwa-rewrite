import { get, set } from 'idb-keyval'
import {
  IMoveOutBuilding,
  IMoveInBuilding,
  ICleaningBuilding,
  IDisposalOutBuilding,
  IStorageBuilding,
  emptyMoveOutBuilding,
  IPostStorageBuilding,
  IPostDisposalOutBuilding,
  IPostCleaningBuilding,
  IPostMoveInBuilding,
  IPostMoveOutBuilding,
  emptyMoveInBuilding,
  emptyCleaningBuilding,
  emptyDisposalOutBuilding,
  emptyStorageBuilding,
} from '../interfaces/IBuilding';
import { IPostLead, emptyLead, ILead } from '../interfaces/ILead';
import BuildingService from '../services/BuildingService';
import LeadService from '../services/LeadService';

export interface IOriginalCachedData {

  Lead: ILead
  moveOut: IMoveOutBuilding | null
  moveIn: IMoveInBuilding | null
  cleaning: ICleaningBuilding | null
  disposal: IDisposalOutBuilding | null
  storage: IStorageBuilding | null

}

export interface ILeadContainer {
  lastUpdated: Date
  onlySavedOffline: boolean

  Lead: IPostLead
  moveOut: IPostMoveOutBuilding
  moveIn: IPostMoveInBuilding
  cleaning: IPostCleaningBuilding
  disposal: IPostDisposalOutBuilding
  storage: IPostStorageBuilding


  originalCachedData: IOriginalCachedData | null
  // unsavedChanges:
}

export const emptyLeadContainer: ILeadContainer = {
  lastUpdated: new Date(),
  onlySavedOffline: false,

  Lead: emptyLead,

  moveOut: emptyMoveOutBuilding,
  moveIn: emptyMoveInBuilding,
  cleaning: emptyCleaningBuilding,
  disposal: emptyDisposalOutBuilding,
  storage: emptyStorageBuilding,

  originalCachedData: null
}


class LeadAPI {

  // Only gets called to save into Offline Storage
  FetchFromOnline(leadId: number): Promise<ILeadContainer> {
    return Promise.all([
      LeadService.fetchCustomer(leadId),
      BuildingService.fetchMoveOutBuilding(leadId),
      BuildingService.fetchMoveInBuilding(leadId),
      BuildingService.fetchCleaningBuilding(leadId),
      BuildingService.fetchStorageBuilding(leadId),
      BuildingService.fetchDisposalOutBuilding(leadId),
    ]).then(([Lead, moveOut, moveIn, cleaning, storage, disposal]): ILeadContainer => ({
      lastUpdated: new Date(),
      onlySavedOffline: false,

      Lead: Lead ? Lead : emptyLeadContainer.Lead,

      moveOut: moveOut ? moveOut : emptyLeadContainer.moveOut,

      moveIn: moveIn ? moveIn : emptyLeadContainer.moveIn,

      cleaning: cleaning ? cleaning : emptyLeadContainer.cleaning,

      disposal: disposal ? disposal : emptyLeadContainer.disposal,

      storage: storage ? storage : emptyLeadContainer.storage,

      originalCachedData: {
        Lead,
        moveOut,
        moveIn,
        cleaning,
        storage,
        disposal,
      }
    }))
  }


  // Sends all new Data to the API
  SaveToApi = (leadId: number, container: ILeadContainer): Promise<void> => {
    const { Lead, originalCachedData, moveOut} = container
    if (Lead && originalCachedData) {
      return Promise.all([
        // convert to lead
        LeadService.saveCustomer({ LeadId: leadId, ...Lead }),

        originalCachedData.moveOut ? BuildingService.saveMoveOutBuilding(originalCachedData.moveOut.MoveOutBuildingId, moveOut) : BuildingService.createMoveOutBuilding(moveOut, leadId),

      ]).then()
    }

    return Promise.reject()
  }


  // Gets Called to Get Data From Offline
  FetchFromOffline = (leadId: number): Promise<ILeadContainer | undefined> => {
    return get(leadId)
  }


  // Saves it in Offline Storage
  SaveToOffline = (leadId: number, lead: ILeadContainer) => {
    return set(leadId, lead)
  }

  // Checks if data changed on the API side from first Fetch
  CheckAgainstAPI() {

  }
}

export default new LeadAPI()
