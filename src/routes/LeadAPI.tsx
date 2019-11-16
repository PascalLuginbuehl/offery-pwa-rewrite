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
import ServicesService from '../services/ServicesService';
import { emptyServices, IPutServices, IServices, IPutMoveService, IMoveService, emptyMoveService, IPackSerivce, IPutPackService, IPutStorageService, IStorageSerivce } from '../interfaces/IService';
import { IMaterialOrder } from '../interfaces/IShop';
import { IInventars } from '../interfaces/IInventars';


export interface ILeadContainer {
  lastUpdated: Date
  onlySavedOffline: boolean

  Lead: IPostLead | ILead | null
  moveOut: IPostMoveOutBuilding | IMoveOutBuilding | null
  moveIn: IPostMoveInBuilding | IMoveInBuilding | null
  cleaning: IPostCleaningBuilding | ICleaningBuilding | null
  disposal: IPostDisposalOutBuilding | IDisposalOutBuilding | null
  storage: IPostStorageBuilding | IStorageBuilding | null

  services: IPutServices | IServices
  moveService: IPutMoveService | IMoveService | null
  materialOrder: IMaterialOrder | null
  inventory: IInventars | null

  packService: IPutPackService | IPackSerivce | null
  storageService: IPutStorageService | IStorageSerivce | null
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

  services: emptyServices,
  moveService: emptyMoveService,

  materialOrder: null,
  inventory: null,

  packService: null,
  storageService: null
}

export function checkIs<Type>(object: any | null, key: keyof Type): object is Type {
  if(typeof object === "object") {
    return object.hasOwnProperty(key)
  }
  return false
}

class LeadAPI {

  // Only gets called to save into Offline Storage
  FetchFromOnline(leadId: number): Promise<ILeadContainer> {
    //@ts-ignore
    return Promise.all([
      LeadService.fetchCustomer(leadId),
      BuildingService.fetchMoveOutBuilding(leadId),
      BuildingService.fetchMoveInBuilding(leadId),
      BuildingService.fetchCleaningBuilding(leadId),
      BuildingService.fetchStorageBuilding(leadId),
      BuildingService.fetchDisposalOutBuilding(leadId),
      ServicesService.fetchServices(leadId),
      ServicesService.fetchMoveService(leadId),
      ServicesService.fetchMaterialOrder(leadId),
      ServicesService.fetchInventars(leadId),
      ServicesService.fetchPackService(leadId),
      ServicesService.fetchStorageService(leadId),
      // @ts-ignore
    ]).then(([Lead, moveOut, moveIn, cleaning, storage, disposal, services, moveService, materialOrder, inventory, packService, storageService]): ILeadContainer => ({
      lastUpdated: new Date(),
      onlySavedOffline: false,

      Lead: Lead ? Lead : emptyLeadContainer.Lead,

      moveOut: moveOut,

      moveIn: moveIn,

      cleaning: cleaning,

      disposal: disposal,

      storage: storage,

      services: services,

      moveService: moveService,

      materialOrder: materialOrder,

      inventory: inventory,

      packService: packService,

      storageService: storageService,
    }))
  }


  Catch400Errors(e: Error) {
    if(e.message == "Bad Request") {
      throw new Error("Could not save lead properly")
    } else if(e.message == "Failed to fetch") {
      throw new Error("Failed to fetch")
    }
    return null
  }

  // Sends all new Data to the API
  SaveToApi = (leadId: number, container: ILeadContainer): Promise<void> => {
    const { Lead, moveOut, moveIn, storage, disposal, cleaning, services, moveService} = container
    if (Lead) {
      return Promise.all([
        // convert to lead
        LeadService.saveCustomer({ LeadId: leadId, ...Lead }),

        this.SaveMoveOut(moveOut, leadId),
        this.SaveMoveIn(moveIn, leadId),
        this.SaveDisposal(disposal, leadId),
        this.SaveStorage(storage, leadId),
        this.SaveCleaning(cleaning, leadId),
        this.SaveServices(leadId, services),
        this.SaveMoveService(leadId, moveService),
      ])
      .then(() => {})
    }

    return Promise.reject()
  }



  SaveMoveOut = (moveOut: IMoveOutBuilding | IPostMoveOutBuilding | null, leadId: number): Promise<unknown> => {
    return moveOut ? checkIs<IMoveOutBuilding>(moveOut, 'MoveOutBuildingId') ? BuildingService.saveMoveOutBuilding(moveOut.MoveOutBuildingId, moveOut) : BuildingService.createMoveOutBuilding(moveOut, leadId).catch(this.Catch400Errors) : Promise.resolve(null)
  }

  SaveMoveIn = (moveIn: IMoveInBuilding | IPostMoveInBuilding | null, leadId: number): Promise<unknown> => {
    return moveIn ? checkIs<IMoveInBuilding>(moveIn, 'MoveInBuildingId') ? BuildingService.saveMoveInBuilding(moveIn.MoveInBuildingId, moveIn) : BuildingService.createMoveInBuilding(moveIn, leadId).catch(this.Catch400Errors) : Promise.resolve(null)
  }

  SaveDisposal = (disposal: IDisposalOutBuilding | IPostDisposalOutBuilding | null, leadId: number): Promise<unknown> => {
    return disposal ? checkIs<IDisposalOutBuilding>(disposal, 'DisposalOutBuildingId') ? BuildingService.saveDisposalOutBuilding(disposal.DisposalOutBuildingId, disposal) : BuildingService.createDisposalOutBuilding(disposal, leadId).catch(this.Catch400Errors) : Promise.resolve(null)
  }

  SaveStorage = (storage: IStorageBuilding | IPostStorageBuilding | null, leadId: number): Promise<unknown> => {
    return storage ? checkIs<IStorageBuilding>(storage, 'StorageBuildingId') ? BuildingService.saveStorageBuilding(storage.StorageBuildingId, storage) : BuildingService.createStorageBuilding(storage, leadId).catch(this.Catch400Errors) : Promise.resolve(null)
  }

  SaveCleaning = (cleaning: ICleaningBuilding | IPostCleaningBuilding | null, leadId: number): Promise<unknown> => {
    return cleaning ? checkIs<ICleaningBuilding>(cleaning, 'CleaningBuildingId') ? BuildingService.saveCleaningBuilding(cleaning.CleaningBuildingId, cleaning) : BuildingService.createCleaningBuilding(cleaning, leadId).catch(this.Catch400Errors) : Promise.resolve(null)
  }

  SaveServices = (leadId: number, services: IPutServices) => {
    return ServicesService.saveServices(leadId, services)
  }

  SaveMoveService = (leadId: number, moveService: IPutMoveService | null) => {
    return moveService ? ServicesService.saveMoveService(leadId, moveService) : Promise.resolve(null)
  }

  SaveMaterialOrderService = (leadId: number, materialOrder: IMaterialOrder | null) => {
    return materialOrder ? ServicesService.saveMaterialOrder(leadId, materialOrder) : Promise.resolve(null)
  }

  SaveInventoryService = (leadId: number, inventars: IInventars | null) => {
    return inventars ? ServicesService.saveInventars(leadId, inventars) : Promise.resolve(null)
  }

  SavePackService = (leadId: number, packService: IPutPackService | null) => {
    return packService ? ServicesService.savePackService(leadId, packService) : Promise.resolve(null)
  }

  SaveStorageService = (leadId: number, storageService: IPutStorageService | null) => {
    return storageService ? ServicesService.saveStorageService(leadId, storageService) : Promise.resolve(null)
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

  isCompleteLead = (lead: IPostLead | ILead | null): lead is ILead => {
    if(lead) {
      return lead.hasOwnProperty('LeadId')
    }
    return false
  }
}

export default new LeadAPI()
