import { errorFunction } from "./errorFunction"
import LoginService from "./LoginService"
import { IUpdateMoveOutBuilding, IMoveOutBuilding, IPostMoveOutBuilding, IPostMoveInBuilding, IUpdateMoveInBuilding, IMoveInBuilding, IUpdateStorageBuilding, IPostStorageBuilding, IStorageBuilding, IDisposalOutBuilding, IPostDisposalOutBuilding, IUpdateDisposalOutBuilding, IUpdateCleaningBuilding, IPostCleaningBuilding, ICleaningBuilding } from "../interfaces/IBuilding";
import { IServices, IPutServices, IMoveService, IPutMoveService } from "../interfaces/IService";
import { IMaterialOrder } from "../interfaces/IShop";

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
    return this.saveService<IPutMoveService>(
      API_URL + '/lead/' + leadId + '/materialorder',
      materialOrder
    )
  }
}


export default new ServicesService()
