import { errorFunction } from "./errorFunction"
import LoginService from "./LoginService"
import { IOffer } from "../interfaces/IOffer"


const API_URL = process.env.REACT_APP_API_URL

class ServicesService {
  private toSpecificType<Type>(json: any): Type {
    if (!json || typeof json !== "object") {
      throw new Error()
    }

    return json
  }

  async getOffer(leadId: number, templateCategoryId: number, billBuildingId: number): Promise<IOffer> {
    return (
      fetch(API_URL + "/offer/generate/" + leadId + "/" + templateCategoryId + "/" + billBuildingId, await LoginService.authorizeRequest())
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

  async uploadOffer(leadId: number, file: any): Promise<IOffer> {
    const formdata = new FormData()
    formdata.append("LeadId", leadId.toString())
    formdata.append("file", file)

    return fetch(
      API_URL + "/offer/upload",
      await LoginService.authorizeRequest({
        method: "POST",
        body: formdata
      })
    )
      .then(errorFunction)
      .then(response => response.json())
      .then(json => this.toSpecificType<IOffer>(json))
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
