import { errorFunction } from "./errorFunction"
import LoginService from "./LoginService"
import { IUpdateMoveOutBuilding, IMoveOutBuilding, IPostMoveOutBuilding, IPostMoveInBuilding, IUpdateMoveInBuilding, IMoveInBuilding, IUpdateStorageBuilding, IPostStorageBuilding, IStorageBuilding, IDisposalOutBuilding, IPostDisposalOutBuilding, IUpdateDisposalOutBuilding, IUpdateCleaningBuilding, IPostCleaningBuilding, ICleaningBuilding } from "../interfaces/IBuilding";
import { IServices, IPutServices, IMoveService, IPutMoveService, IPackSerivce, IPutPackService, IPutStorageService, IStorageSerivce, IPutDisposalSerivce, IDisposalSerivce } from "../interfaces/IService";
import { IMaterialOrder } from "../interfaces/IShop";
import { IInventars } from "../interfaces/IInventars";

const API_URL = process.env.REACT_APP_API_URL


class ServicesService {
  private toSpecificType<Type>(json: any): Type {
    if (!json || typeof json !== "object") {
      throw new Error()
    }

    return json
  }

  async fetchService<Type>(url: string, middleWare?: (data: any) => any): Promise<Type | null> {
    return fetch(url, await LoginService.authorizeRequest())
      .then(errorFunction)
      .then((response) => response.json())
      // .then(middleWare)
      .then(json => this.toSpecificType<Type>(json))
      .catch(e => null)
  }

  async createService<Type>(url: string, body: any, middleWare?: (data: any) => any): Promise<Type> {
    return fetch(url, await LoginService.authorizeRequest({
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }))
      .then(errorFunction)
      .then((response) => response.json())
      // .then(middleWare)
      .then(json => this.toSpecificType<Type>(json))
  }

  async saveService<Type>(url: string, body: any, middleWare?: (data: any) => any): Promise<Type> {
    return fetch(url, await LoginService.authorizeRequest({
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }))
      .then(errorFunction)
      .then((response) => response.json())
      // .then(middleWare)
      .then(json => this.toSpecificType<Type>(json))
  }


  // Services
  public fetchServices = (leadId: number): Promise<IServices> => {
    return this.fetchService<IServices>(
      API_URL + '/lead/' + leadId + '/services',
    ).then(e => {
      if(e == null) {
        throw new Error("Empty Service return not allowed")
      } else {
        return e
      }
    })
  }

  public saveServices = (leadId: number, services: IPutServices) => {
    return this.saveService<IMoveOutBuilding>(
      API_URL + '/lead/' + leadId + '/services',
      services
    )
  }


  // Services
  public fetchMoveService = (leadId: number): Promise<IMoveService | null> => {
    return this.fetchService<IMoveService | null> (
      API_URL + '/lead/' + leadId + '/moveservice',
    )
  }

  public saveMoveService = (leadId: number, services: IPutMoveService) => {
    return this.saveService<IPutMoveService>(
      API_URL + '/lead/' + leadId + '/moveservice',
      services
    )
  }


  // MaterialOrder
  public fetchMaterialOrder = (leadId: number): Promise<IMaterialOrder | null> => {
    return this.fetchService<IMaterialOrder | null>(
      API_URL + '/lead/' + leadId + '/materialorder',
    )
  }

  public saveMaterialOrder = (leadId: number, materialOrder: IMaterialOrder) => {
    return this.saveService<IMaterialOrder>(
      API_URL + '/lead/' + leadId + '/materialorder',
      materialOrder
    )
  }


  // MaterialOrder
  public fetchInventars = (leadId: number): Promise<IInventars | null> => {
    return this.fetchService<IInventars | null>(
      API_URL + '/lead/' + leadId + '/inventars',
    )
  }

  public saveInventars = (leadId: number, materialOrder: IInventars) => {
    return this.saveService<IInventars>(
      API_URL + '/lead/' + leadId + '/inventars',
      materialOrder
    )
  }

  // Services
  public fetchPackService = (leadId: number): Promise<IPackSerivce | null> => {
    return this.fetchService<IPackSerivce | null>(
      API_URL + '/lead/' + leadId + '/packservice',
    )
  }

  public savePackService = (leadId: number, services: IPutPackService) => {
    return this.saveService<IPutPackService>(
      API_URL + '/lead/' + leadId + '/packservice',
      services
    )
  }

  // Services
  public fetchStorageService = (leadId: number): Promise<IStorageSerivce | null> => {
    return this.fetchService<IStorageSerivce | null>(
      API_URL + '/lead/' + leadId + '/storageservice',
    )
  }

  public saveStorageService = (leadId: number, services: IPutStorageService) => {
    return this.saveService<IPutStorageService>(
      API_URL + '/lead/' + leadId + '/storageservice',
      services
    )
  }

  // Services
  public fetchDisposalService = (leadId: number): Promise<IDisposalSerivce | null> => {
    return this.fetchService<IDisposalSerivce | null>(
      API_URL + '/lead/' + leadId + '/disposalservice',
    )
  }

  public saveDisposalService = (leadId: number, services: IPutDisposalSerivce) => {
    return this.saveService<IPutDisposalSerivce>(
      API_URL + '/lead/' + leadId + '/disposalservice',
      services
    )
  }
}


export default new ServicesService()
