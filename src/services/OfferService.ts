import { errorFunction } from "./errorFunction"
import LoginService from "./LoginService"
import { IOffer, IConfirmOffer } from "../interfaces/IOffer"
import { ILead } from "../interfaces/ILead"

const API_URL = process.env.REACT_APP_API_URL

class ServicesService {
  private toSpecificType<Type>(json: any): Type {
    if (!json || typeof json !== "object") {
      throw new Error()
    }

    return json
  }

  async getOffer(leadId: number, templateCategoryId: number, outAddressId: number, inAddressId: number): Promise<IOffer> {
    return (
      fetch(API_URL + "/offer/generate/" + leadId + "/" + templateCategoryId + "/" + outAddressId + "/" + inAddressId, await LoginService.authorizeRequest())
        .then(errorFunction)
        .then(response => response.json())
        // .then(middleWare)
        .then(json => this.toSpecificType<IOffer>(json))
    // .catch(e => console.log(e))
    )
  }

  async downloadFile(offerId: number, fileId: number): Promise<any> {
    return fetch(API_URL + "/offer/" + offerId + "/file/" + fileId, await LoginService.authorizeRequest())
      .then(errorFunction)
      .then(response => response.blob())
  }

  async sendOffer(OfferId: number, CCEmailList: string[], Comment: string): Promise<any> {
    return fetch(
      API_URL + "/offer/send",
      await LoginService.authorizeRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ OfferId, CCEmailList, Comment }),
      })
    )
      .then(errorFunction)
  }
}

export default new ServicesService()
