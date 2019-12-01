import { errorFunction } from "./errorFunction"
import LoginService from "./LoginService"
import { IOffer } from "../interfaces/IOffer";

const API_URL = process.env.REACT_APP_API_URL

class ServicesService {
  private toSpecificType<Type>(json: any): Type {
    if (!json || typeof json !== "object") {
      throw new Error()
    }

    return json
  }

  async getOffer(leadId: number, templateCategoryId: number, type: number, outAddressId: number, inAddressId: number) {
    return (
      fetch(API_URL + "/offer/generate/" + leadId + "/" + templateCategoryId + "/" + type + "/" + outAddressId + "/" + inAddressId, await LoginService.authorizeRequest())
        .then(errorFunction)
        .then(response => response.json())
        // .then(middleWare)
        .then(json => this.toSpecificType<IOffer>(json))
        .catch(e => null)
    )
  }
}

export default new ServicesService()
