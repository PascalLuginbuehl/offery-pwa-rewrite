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

  async getOffer(leadId: number, templateCategoryId: number, type: "pdf" | "docx", outAddressId: number, inAddressId: number): Promise<IOffer> {
    return (
      fetch(API_URL + "/offer/generate/" + leadId + "/" + templateCategoryId + "/" + type + "/" + outAddressId + "/" + inAddressId, await LoginService.authorizeRequest())
        .then(errorFunction)
        .then(response => response.json())
        // .then(middleWare)
        .then(json => this.toSpecificType<IOffer>(json))
      // .catch(e => console.log(e))
    )
  }

  async downloadPdf(offerId: number): Promise<any> {
    return fetch(API_URL + "/offer/" + offerId + "/file", await LoginService.authorizeRequest())
      .then(errorFunction)
      .then(response => response.blob())
  }
}

export default new ServicesService()
