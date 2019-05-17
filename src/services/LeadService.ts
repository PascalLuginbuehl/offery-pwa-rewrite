import { IVisitConfirmation } from '../interfaces/IVisitConfirmation';
import { errorFunction } from "./errorFunction"
import { ILead, IPostLead, IUpdateLead } from "../interfaces/ILead"
import LoginService from "./LoginService"
import { format } from "date-fns/esm"

const API_URL = process.env.REACT_APP_API_URL


class LeadService {

  private parseDate(date: string | null) {
    return date ? new Date(date) : null
  }

  private toCustomer(json: any): ILead {
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

    json.StatusHistories.map((e: any) => ({...e, Created: new Date(e.Created)}))

    return json
  }

  private formatDate(date: Date | null) {
    return date ? format(date, "yyyy-MM-dd'T'HH:mm:ss") : null
  }

  private sendData(lead: IPostLead) {
    let returnObject: any = {...lead}

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
  public fetchCustomer(id: number) {
    return new Promise<ILead>(async (resolve, reject) => {
      try {
        const data = await fetch(API_URL + '/lead/' + id, await LoginService.authorizeRequest())
          .then(errorFunction)
          .then((response) => response.json())
          .then(json => this.toCustomer(json))

        resolve(data)
      } catch (e) {
        reject(e)
        console.error(e)
      }
    })
  }

  public saveCustomer(customer: IUpdateLead) {
    return new Promise<ILead>(async (resolve, reject) => {
      try {
        const data = await fetch(API_URL + '/lead', await LoginService.authorizeRequest({
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.sendData(customer)),
        }))
          .then(errorFunction)
          .then((response) => response.json())
          .then(json => this.toCustomer(json))

        resolve(data)
      } catch (e) {
        reject(e)
        console.error(e)
      }
    })
  }

  public createCustomer(customer: IPostLead, companyId: number) {
    return new Promise<ILead>(async (resolve, reject) => {
      try {
        const data = await fetch(API_URL + '/lead', await LoginService.authorizeRequest({
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...this.sendData(customer), CompanyId: companyId}),
        }))
          .then(errorFunction)
          .then((response) => response.json())
          .then(json => this.toCustomer(json))

        resolve(data)
      } catch (e) {
        reject(e)
        console.error(e)
      }
    })
  }

  public fetchCompanyLeads(companyId: number) {
    return new Promise<ILead[]>(async (resolve, reject) => {
      try {
        const data = await fetch(API_URL + '/lead/company/' + companyId, await LoginService.authorizeRequest())
          .then(errorFunction)
          .then((response) => response.json())
          .then(json => json.map(this.toCustomer))

        resolve(data)
      } catch (e) {
        reject(e)
        console.error(e)
      }
    })
  }

  public sendVisitConfirmation(visit: IVisitConfirmation) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await fetch(API_URL + '/lead/sendvisitconfirm', await LoginService.authorizeRequest({
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visit),
        }))
          .then(errorFunction)

        resolve()
      } catch (e) {
        reject(e)
        console.error(e)
      }
    })
  }
}


export default new LeadService()