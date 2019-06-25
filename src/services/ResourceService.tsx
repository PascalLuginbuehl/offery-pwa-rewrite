
import { errorFunction } from "./errorFunction"
import { IResource } from "../interfaces/IResource";
import LoginService from "./LoginService";
import { ICompany } from "../interfaces/ICompany";

const API_URL = process.env.REACT_APP_API_URL


class ResourceService {

  private toResource(json: any): IResource {
    if (!json || typeof json !== "object") {
      throw new Error()
    }

    return json
  }

  private toCompany(json: any): ICompany {
    if (!json || typeof json !== "object") {
      throw new Error()
    }

    return json
  }

  public fetchResource() {
    return new Promise<IResource>(async (resolve, reject) => {
      try {
        const data = await fetch(API_URL + '/resource', await LoginService.authorizeRequest())
          .then(errorFunction)
          .then((response) => response.json())
          .then(json => this.toResource(json))

        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  public fetchCompanies() {
    return new Promise<ICompany[]>(async (resolve, reject) => {
      try {
        const data = await fetch(API_URL + '/company/all', await LoginService.authorizeRequest())
          .then(errorFunction)
          .then((response) => response.json())
          .then(json => json.map(this.toCompany))

        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  public fetchResourceWithOffline(): Promise<IResource> {
    return new Promise(async (resolve, reject) => {
      // @ts-ignore localStorage can return null... JSON.parse can handle it
      // Get from offline storage, need to rewrite to check if HTTP Error
      // const resource = JSON.parse(localStorage.getItem("resource"))
      // if (resource) {
      //   console.log("FUCK")
      //   resolve(resource)
      // }

      // Run this anyway... so it can update all se sings and localStorage
      const resourceAwait = this.fetchResource()
      try {

        const resource = await resourceAwait
        localStorage.setItem("resource", JSON.stringify(resource))

        resolve(resource)
      } catch (e) {
        // Prolly offline / not logged in
        // Check error message

        reject(e)
      }
    })
  }
}


export default new ResourceService()
