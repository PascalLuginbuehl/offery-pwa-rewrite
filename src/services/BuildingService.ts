import { errorFunction } from "./errorFunction"
import LoginService from "./LoginService"
import { IBuilding, IPostBuilding } from "../interfaces/IBuilding"

const API_URL = process.env.REACT_APP_API_URL


class BuildingService {
  private toSpecificType<Type>(json: any): Type {
    if (!json || typeof json !== "object") {
      throw new Error()
    }

    return json
  }

  async fetchBuildings(leadId: number): Promise<IBuilding[]> {
    return fetch(API_URL + "/building/" + leadId, await LoginService.authorizeRequest())
      .then(errorFunction)
      .then((response) => response.json())
      // .then(middleWare)
      .then(json => this.toSpecificType<IBuilding[]>(json))
      .catch(e => [])
  }

  async createBuilding(leadId: number, body: IPostBuilding): Promise<IBuilding[]> {
    return fetch(API_URL + "/building/" + leadId, await LoginService.authorizeRequest({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }))
      .then(errorFunction)
      .then((response) => response.json())
      // .then(middleWare)
      .then(json => this.toSpecificType<IBuilding[]>(json))
  }

  async saveBuildings(leadId: number, body: IPostBuilding[]): Promise<IBuilding[]> {
    return fetch(API_URL + "/building/" + leadId, await LoginService.authorizeRequest({
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }))
      .then(errorFunction)
      .then((response) => response.json())
      // .then(middleWare)
      .then(json => this.toSpecificType<IBuilding[]>(json))
  }
}


export default new BuildingService()
