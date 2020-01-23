import { get, set, del} from "idb-keyval"
import { IMoveOutBuilding, IMoveInBuilding, ICleaningBuilding, IDisposalOutBuilding, IStorageBuilding, IPostStorageBuilding, IPostDisposalOutBuilding, IPostCleaningBuilding, IPostMoveInBuilding, IPostMoveOutBuilding } from "../../interfaces/IBuilding"
import { IPutLead, ILead } from "../../interfaces/ILead"
import BuildingService from "../../services/BuildingService"
import LeadService from "../../services/LeadService"
import ServicesService from "../../services/ServicesService"
import { IPutMoveService, IMoveService, IPackSerivce, IPutPackService, IPutStorageService, IStorageSerivce, IPutDisposalService, IDisposalSerivce, IPutCleaningService, ICleaningService } from "../../interfaces/IService"
import { IMaterialOrder } from "../../interfaces/IShop"
import { IInventars } from "../../interfaces/IInventars"


interface ILeadEditableValues {
  Lead: ILead
  moveOut: IMoveOutBuilding | null
  moveIn: IMoveInBuilding | null
  cleaning: ICleaningBuilding | null
  disposal: IDisposalOutBuilding | null
  storage: IStorageBuilding | null

  moveService: IMoveService | null
  materialOrder: IMaterialOrder | null
  inventory: IInventars | null

  packService: IPackSerivce | null
  storageService: IStorageSerivce | null
  disposalService: IDisposalSerivce | null
  cleaningService: ICleaningService | null
}

export interface ILeadContainer extends ILeadEditableValues {
  // lastUpdated: Date
  // onlySavedOffline: boolean
  // cachedInVersion: string
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
      ServicesService.fetchMoveService(leadId),
      ServicesService.fetchMaterialOrder(leadId),
      ServicesService.fetchInventars(leadId),
      ServicesService.fetchPackService(leadId),
      ServicesService.fetchStorageService(leadId),
      ServicesService.fetchDisposalService(leadId),
      ServicesService.fetchCleaningService(leadId),
      // @ts-ignore
    ]).then(([Lead, moveOut, moveIn, cleaning, storage, disposal, moveService, materialOrder, inventory, packService, storageService, disposalService, cleaningService]): ILeadContainer => ({
      // lastUpdated: new Date(),
      // onlySavedOffline: false,
      // cachedInVersion: "",

      Lead: Lead,
      moveOut: moveOut,
      moveIn: moveIn,
      cleaning: cleaning,
      disposal: disposal,
      storage: storage,
      moveService: moveService,
      materialOrder: materialOrder,
      inventory: inventory,
      packService: packService,
      storageService: storageService,
      disposalService: disposalService,
      cleaningService: cleaningService,
    }))
  }

  SaveLead = (lead: ILead): Promise<unknown> => {
    return LeadService.saveCustomer(lead)
  }

  SaveMoveOut = (moveOut: IMoveOutBuilding | IPostMoveOutBuilding, leadId: number): Promise<IMoveOutBuilding> => {
    return checkIs<IMoveOutBuilding>(moveOut, "MoveOutBuildingId") ? BuildingService.saveMoveOutBuilding(moveOut.MoveOutBuildingId, moveOut) : BuildingService.createMoveOutBuilding(moveOut, leadId)
  }

  SaveMoveIn = (moveIn: IMoveInBuilding | IPostMoveInBuilding, leadId: number): Promise<IMoveInBuilding> => {
    return checkIs<IMoveInBuilding>(moveIn, "MoveInBuildingId") ? BuildingService.saveMoveInBuilding(moveIn.MoveInBuildingId, moveIn) : BuildingService.createMoveInBuilding(moveIn, leadId)
  }

  SaveDisposal = (disposal: IDisposalOutBuilding | IPostDisposalOutBuilding, leadId: number): Promise<IDisposalOutBuilding> => {
    return checkIs<IDisposalOutBuilding>(disposal, "DisposalOutBuildingId") ? BuildingService.saveDisposalOutBuilding(disposal.DisposalOutBuildingId, disposal) : BuildingService.createDisposalOutBuilding(disposal, leadId)
  }

  SaveStorage = (storage: IStorageBuilding | IPostStorageBuilding, leadId: number): Promise<IStorageBuilding> => {
    return checkIs<IStorageBuilding>(storage, "StorageInBuildingId") ? BuildingService.saveStorageBuilding(storage.StorageInBuildingId, storage) : BuildingService.createStorageBuilding(storage, leadId)
  }

  SaveCleaning = (cleaning: ICleaningBuilding | IPostCleaningBuilding, leadId: number): Promise<ICleaningBuilding> => {
    return checkIs<ICleaningBuilding>(cleaning, "CleaningBuildingId") ? BuildingService.saveCleaningBuilding(cleaning.CleaningBuildingId, cleaning) : BuildingService.createCleaningBuilding(cleaning, leadId)
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

  SaveDisposalService = (leadId: number, disposalService: IPutDisposalService | null) => {
    return disposalService ? ServicesService.saveDisposalService(leadId, disposalService) : Promise.resolve(null)
  }

  SaveCleaningService = (leadId: number, cleaningService: IPutCleaningService | null) => {
    return cleaningService ? ServicesService.saveCleaningService(leadId, cleaningService) : Promise.resolve(null)
  }

  // Gets Called to Get Data From Offline
  FetchFromOfflineOrigin = (leadId: number): Promise<ILeadContainer | undefined> => {
    return get(leadId)
  }

  // Gets Called to Get Data From Offline
  FetchFromOfflineChanges = (leadId: number): Promise<ILeadContainer | undefined> => {
    return get(leadId + "_changes")
  }

  // Saves it in Offline Storage
  SaveOriginToOffline = (container: ILeadContainer) => {
    return set(container.Lead.LeadId, container)
  }

  // Saves it in Offline Storage
  SaveToChangesToOffline = (container: ILeadContainer) => {
    return set(container.Lead.LeadId + "_changes", container)
  }


  // Saves it in Offline Storage
  RemoveChangesFromOffline = (leadId: number) => {
    return del(leadId + "_changes")
  }

  isCompleteLead = (lead: IPutLead | ILead | null): lead is ILead => {
    if(lead) {
      return lead.hasOwnProperty("LeadId")
    }
    return false
  }
}

export default new LeadAPI()
