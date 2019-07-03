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

  Lead: IPostLead | ILead
  moveOut: IPostMoveOutBuilding | IMoveOutBuilding | null
  moveIn: IPostMoveInBuilding | IMoveInBuilding | null
  cleaning: IPostCleaningBuilding | ICleaningBuilding | null
  disposal: IPostDisposalOutBuilding | IDisposalOutBuilding | null
  storage: IPostStorageBuilding | IStorageBuilding | null

  // unsavedChanges:
}

export const emptyLeadContainer: ILeadContainer = {
  lastUpdated: new Date(),
  onlySavedOffline: false,

  Lead: emptyLead,

  moveOut: null,
  moveIn: null,
  cleaning: null,
  disposal: null,
  storage: null,
}

function checkIs<Type>(object: any | null, key: keyof Type): object is Type {
  if(typeof object === "object") {
    return object.hasOwnProperty(key)
  }
  return false
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

      moveOut: moveOut,

      moveIn: moveIn,

      cleaning: cleaning,

      disposal: disposal,

      storage: storage,
    }))
  }


  // Sends all new Data to the API
  SaveToApi = (leadId: number, container: ILeadContainer): Promise<void> => {
    const { Lead, moveOut, moveIn, storage, disposal, cleaning} = container
    if (Lead ) {


      return Promise.all([
        // convert to lead
        LeadService.saveCustomer({ LeadId: leadId, ...Lead }),

        moveOut ? checkIs<IMoveOutBuilding>(moveOut, 'MoveOutBuildingId') ? BuildingService.saveMoveOutBuilding(moveOut.MoveOutBuildingId, moveOut) : BuildingService.createMoveOutBuilding(moveOut, leadId).catch(() => null) : Promise.resolve(null),
        moveIn ? checkIs<IMoveInBuilding>(moveIn, 'MoveInBuildingId') ? BuildingService.saveMoveInBuilding(moveIn.MoveInBuildingId, moveIn) : BuildingService.createMoveInBuilding(moveIn, leadId).catch(() => null) : Promise.resolve(null),
        disposal ? checkIs<IDisposalOutBuilding>(disposal, 'DisposalOutBuildingId') ? BuildingService.saveDisposalOutBuilding(disposal.DisposalOutBuildingId, disposal) : BuildingService.createDisposalOutBuilding(disposal, leadId).catch(() => null) : Promise.resolve(null),
        storage ? checkIs<IStorageBuilding>(storage, 'StorageBuildingId') ? BuildingService.saveStorageBuilding(storage.StorageBuildingId, storage) : BuildingService.createStorageBuilding(storage, leadId).catch(() => null) : Promise.resolve(null),
        cleaning ? checkIs<ICleaningBuilding>(cleaning, 'CleaningBuildingId') ? BuildingService.saveCleaningBuilding(cleaning.CleaningBuildingId, cleaning) : BuildingService.createCleaningBuilding(cleaning, leadId).catch(() => null) : Promise.resolve(null)

      ]).catch().then(([lead, moveOut, moveIn, disposal, storage, cleaning]) => {

      })
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
