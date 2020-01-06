import { IVisitConfirmation } from "../interfaces/IVisitConfirmation"
import { errorFunction } from "./errorFunction"
import { ILead, IPutLead, IUpdateLead, ICompressedLead, IPostLead } from "../interfaces/ILead"
import LoginService from "./LoginService"
import { format } from "date-fns/esm"
import { IConfirmOffer } from "../interfaces/IOffer"

const API_URL = process.env.REACT_APP_API_URL


class LeadService {
  private parseDate(date: string | null) {
    return date ? new Date(date) : null
  }

  private toCustomer = (json: any): ILead => {
    if (!json || typeof json !== "object") {
      throw new Error()
    }

    json.DeliveryDate = this.parseDate(json.DeliveryDate)
    json.CleaningDate = this.parseDate(json.CleaningDate)
    json.DisposalDate = this.parseDate(json.DisposalDate)
    json.HandOverDate = this.parseDate(json.HandOverDate)
    json.PackServiceDate = this.parseDate(json.PackServiceDate)
    json.MoveDate = this.parseDate(json.MoveDate)
    json.StorageDate = this.parseDate(json.StorageDate)
    json.VisitDate = this.parseDate(json.VisitDate)
    json.Created = this.parseDate(json.Created)

    json.StatusHistories.map((e: any) => ({ ...e, Created: new Date(e.Created) }))

    return json
  }

  private toComporessedCustomer = (json: any): ILead => {
    if (!json || typeof json !== "object") {
      throw new Error()
    }

    json.VisitDate = this.parseDate(json.VisitDate)
    json.Created = this.parseDate(json.Created)

    return json
  }

  private formatDate(date: Date | null) {
    return date ? format(date, "yyyy-MM-dd'T'HH:mm:ss") : null
  }

  private sendData(lead: IPostLead | IPutLead) {
    const returnObject: any = { ...lead }

    returnObject.DeliveryDate = this.formatDate(lead.DeliveryDate)
    returnObject.CleaningDate = this.formatDate(lead.CleaningDate)
    returnObject.DisposalDate = this.formatDate(lead.DisposalDate)
    returnObject.HandOverDate = this.formatDate(lead.HandOverDate)
    returnObject.PackServiceDate = this.formatDate(lead.PackServiceDate)
    returnObject.MoveDate = this.formatDate(lead.MoveDate)
    returnObject.StorageDate = this.formatDate(lead.StorageDate)
    returnObject.VisitDate = this.formatDate(lead.VisitDate)

    return returnObject
  }

  // private toEmpolyees(json: any): Employee[] {
  //   if (!json || !Array.isArray(json)) {
  //     throw new Error()
  //   }

  //   return json
  // }
  public async fetchCustomer(id: number): Promise<ILead> {
    const data = await fetch(API_URL + "/lead/" + id, await LoginService.authorizeRequest())
      .then(errorFunction)
      .then(response => response.json())
      .then(json => this.toCustomer(json))

    return data
  }

  public async saveCustomer(customer: IUpdateLead): Promise<ILead> {
    const data = await fetch(
      API_URL + "/lead",
      await LoginService.authorizeRequest({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.sendData(customer)),
      })
    )
      .then(errorFunction)
      .then(response => response.json())
      .then(json => this.toCustomer(json))

    return data
  }

  public async createCustomer(customer: IPostLead, companyId: number) {
    const data = await fetch(
      API_URL + "/lead",
      await LoginService.authorizeRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...this.sendData(customer), CompanyId: companyId }),
      })
    )
      .then(errorFunction)
      .then(response => response.json())
      .then(json => this.toCustomer(json))

    return data
  }

  public async fetchCompanyLeads(companyId: number): Promise<ICompressedLead[]> {
    return await fetch(API_URL + "/lead/company/" + companyId, await LoginService.authorizeRequest())
      .then(errorFunction)
      .then(response => response.json())
      .then(json => json.map(this.toComporessedCustomer))
  }

  public async sendVisitConfirmation(visit: IVisitConfirmation) {

    return fetch(
      API_URL + "/lead/sendvisitconfirm",
      await LoginService.authorizeRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...visit, VisitDate: this.formatDate(visit.VisitDate)}),
      })
    ).then(errorFunction)
  }

  async confirmOffer(confirmOffer: IConfirmOffer): Promise<ILead> {
    return fetch(
      API_URL + "/status/confirmorder",
      await LoginService.authorizeRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmOffer),
      })
    )
      .then(errorFunction)
      .then(json => this.toCustomer(json))
  }
}


export default new LeadService()
