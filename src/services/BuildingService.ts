import { errorFunction } from "./errorFunction"
import LoginService from "./LoginService"
import { IUpdateMoveOutBuilding, IMoveOutBuilding, IPostMoveOutBuilding, IPostMoveInBuilding, IUpdateMoveInBuilding, IMoveInBuilding, IUpdateStorageBuilding, IPostStorageBuilding, IStorageBuilding, IDisposalOutBuilding, IPostDisposalOutBuilding, IUpdateDisposalOutBuilding, IUpdateCleaningBuilding, IPostCleaningBuilding, ICleaningBuilding } from "../interfaces/IBuilding";

const API_URL = process.env.REACT_APP_API_URL


class BuildingService {
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
    const test: IUpdateMoveOutBuilding = { MoveOutBuildingId: buildingId, ...toMoveOutBuilding}
    return this.saveService<IMoveOutBuilding>(
      API_URL + '/building/moveout',
      toMoveOutBuilding
    )
  }

  // Move In
  public fetchMoveInBuilding = (id: number): Promise<IMoveInBuilding | null> => {
    return this.fetchService<IMoveInBuilding>(
      API_URL + '/building/movein/' + id,
    )
  }

  public createMoveInBuilding = (toMoveInBuilding: IPostMoveInBuilding, leadId: number) => {
    return this.createService<IMoveInBuilding>(
      API_URL + '/building/movein',
      { LeadId: leadId, ...toMoveInBuilding, CompanyId: 1 },
    )
  }

  public saveMoveInBuilding = (toMoveInBuilding: IUpdateMoveInBuilding, leadId: number) => {
    return this.saveService<IMoveInBuilding>(
      API_URL + '/building/movein',
      toMoveInBuilding,
    )
  }

  // Storage Building
  public fetchStorageBuilding = (id: number): Promise<IStorageBuilding | null> => {
    return this.fetchService<IStorageBuilding>(
      API_URL + '/building/storagein/' + id,
    )
  }

  public createStorageBuilding = (toStorageBuilding: IPostStorageBuilding, leadId: number) => {
    return this.createService<IStorageBuilding>(
      API_URL + '/building/storagein',
      { LeadId: leadId, ...toStorageBuilding, CompanyId: 1 },
    )
  }

  public saveStorageBuilding = (storageBuilding: IUpdateStorageBuilding, leadId: number) => {
    return this.saveService<IStorageBuilding>(
      API_URL + '/building/storagein',
      storageBuilding,
    )
  }

  // DisposalOut Building
  public fetchDisposalOutBuilding = (id: number): Promise<IDisposalOutBuilding | null> => {
    return this.fetchService<IDisposalOutBuilding>(
      API_URL + '/building/disposalout/' + id,
    )
  }

  public createDisposalOutBuilding = (toStorageBuilding: IPostDisposalOutBuilding, leadId: number) => {
    return this.createService<IDisposalOutBuilding>(
      API_URL + '/building/disposalout',
      { LeadId: leadId, ...toStorageBuilding, CompanyId: 1 },
    )
  }

  public saveDisposalOutBuilding = (disposalOutBuilding: IUpdateDisposalOutBuilding, leadId: number) => {
    return this.saveService<IDisposalOutBuilding>(
      API_URL + '/building/disposalout',
      disposalOutBuilding,
    )
  }

  // Cleaning Building
  public fetchCleaningBuilding = (id: number): Promise<ICleaningBuilding | null> => {
    return this.fetchService<ICleaningBuilding>(
      API_URL + '/building/cleaning/' + id,
    )
  }

  public createCleaningBuilding = (toStorageBuilding: IPostCleaningBuilding, leadId: number) => {
    return this.createService<IDisposalOutBuilding>(
      API_URL + '/building/cleaning',
      { LeadId: leadId, ...toStorageBuilding, CompanyId: 1 },
    )
  }

  public saveCleaningBuilding = (disposalOutBuilding: IUpdateCleaningBuilding, leadId: number) => {
    return this.saveService<ICleaningBuilding>(
      API_URL + '/building/cleaning',
      disposalOutBuilding,
    )
  }
}


export default new BuildingService()
