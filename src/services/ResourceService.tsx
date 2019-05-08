
import { errorFunction } from "./errorFunction"
import { IResource } from "../interfaces/IResource";
import LoginService from "./LoginService";

const API_URL = process.env.REACT_APP_API_URL


class ResourceService {

  private toResource(json: any): IResource {
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
        console.error(e)
      }
    })
  }
}


export default new ResourceService()
