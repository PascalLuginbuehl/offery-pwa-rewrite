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


export interface ILeadContainer {
  lastUpdated: Date
  onlySavedOffline: boolean

  Lead: IPostLead
  leadId: number | null


  moveOut: IPostMoveOutBuilding
  moveOutId: number | null

  moveIn: IPostMoveInBuilding
  moveInId: number | null

  cleaning: IPostCleaningBuilding
  cleaningId: number | null

  disposal: IPostDisposalOutBuilding
  disposalId: number | null

  storage: IPostStorageBuilding
  storageId: number | null
}

export const emptyLeadContainer: ILeadContainer = {
  lastUpdated: new Date(),
  onlySavedOffline: false,

  Lead: emptyLead,
  leadId: null,

  moveOut: emptyMoveOutBuilding,
  moveOutId: null,

  moveIn: emptyMoveInBuilding,
  moveInId: null,

  cleaning: emptyCleaningBuilding,
  cleaningId: null,

  disposal: emptyDisposalOutBuilding,
  disposalId: null,

  storage: emptyStorageBuilding,
  storageId: null
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

      leadId: Lead ? Lead.LeadId : null,
      Lead: Lead ? Lead : emptyLeadContainer.Lead,

      moveOutId: moveOut ? moveOut.MoveOutBuildingId : null,
      moveOut: moveOut ? moveOut : emptyLeadContainer.moveOut,

      moveInId: moveIn ? moveIn.MoveInBuildingId : null,
      moveIn: moveIn ? moveIn : emptyLeadContainer.moveIn,

      cleaningId: cleaning ? cleaning.CleaningBuildingId : null,
      cleaning: cleaning ? cleaning : emptyLeadContainer.cleaning,

      disposalId: disposal ? disposal.DisposalOutBuildingId : null,
      disposal: disposal ? disposal : emptyLeadContainer.disposal,

      storageId: storage ? storage.StorageBuildingId : null,
      storage: storage ? storage : emptyLeadContainer.storage,
    }))
  }


  // Sends all new Data to the API
  SaveToApi = (leadId: number, container: ILeadContainer): Promise<void> => {
    const { Lead, moveOut, moveOutId } = container
    if (Lead && moveOut && leadId) {
      return Promise.all([
        // convert to lead
        LeadService.saveCustomer({ LeadId: leadId, ...Lead }),
        moveOutId ? BuildingService.saveMoveOutBuilding(moveOutId, moveOut) : BuildingService.createMoveOutBuilding(moveOut, leadId),
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
