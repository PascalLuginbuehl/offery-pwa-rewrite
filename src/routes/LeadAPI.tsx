import { get, set } from 'idb-keyval'
import {
  IMoveOutBuilding,
  IMoveInBuilding,
  ICleaningBuilding,
  IDisposalOutBuilding,
  IStorageBuilding,
} from '../interfaces/IBuilding';
import { IPostLead, emptyLead, ILead } from '../interfaces/ILead';
import BuildingService from '../services/BuildingService';
import LeadService from '../services/LeadService';


export interface ILeadContainer {
  lastUpdated: Date
  onlySavedOffline: boolean

  Lead: IPostLead | null

  moveOut: IMoveOutBuilding | null
  moveIn: IMoveInBuilding | null
  cleaning: ICleaningBuilding | null
  disposal: IDisposalOutBuilding | null
  storage: IStorageBuilding | null
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
      Lead,
      moveOut,
      moveIn,
      cleaning,
      disposal,
      storage,
      onlySavedOffline: false,
    }))
  }


  // Gets Called to Get Data From Offline
  FetchFromOffline = (leadId: number): Promise<ILeadContainer> => {
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
