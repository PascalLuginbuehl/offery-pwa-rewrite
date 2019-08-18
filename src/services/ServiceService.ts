import { errorFunction } from "./errorFunction"
import LoginService from "./LoginService"
import { IUpdateMoveOutBuilding, IMoveOutBuilding, IPostMoveOutBuilding, IPostMoveInBuilding, IUpdateMoveInBuilding, IMoveInBuilding, IUpdateStorageBuilding, IPostStorageBuilding, IStorageBuilding, IDisposalOutBuilding, IPostDisposalOutBuilding, IUpdateDisposalOutBuilding, IUpdateCleaningBuilding, IPostCleaningBuilding, ICleaningBuilding } from "../interfaces/IBuilding";

const API_URL = process.env.REACT_APP_API_URL


class ServiceService {
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


  // MoveOut
  public fetchMoveOutBuilding = (id: number): Promise<IMoveOutBuilding | null> => {
    return this.fetchService<IMoveOutBuilding>(
      API_URL + '/building/moveout/' + id,
    )
  }

  public createMoveOutBuilding = (toMoveOutBuilding: IPostMoveOutBuilding, leadId: number) => {
    return this.createService<IMoveOutBuilding>(
      API_URL + '/building/moveout',
      { LeadId: leadId, ...toMoveOutBuilding, CompanyId: 1 },
    )
  }

  public saveMoveOutBuilding = (buildingId: number, toMoveOutBuilding: IPostMoveOutBuilding) => {
    return this.saveService<IMoveOutBuilding>(
      API_URL + '/building/moveout',
      { MoveOutBuildingId: buildingId, ...toMoveOutBuilding }
    )
  }

}


export default new ServiceService()
