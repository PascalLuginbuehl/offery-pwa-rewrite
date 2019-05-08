export interface IPostStorageCompany {
  CompanyName: string
  ContactPersonFullName: string
  ContactPersonTel: string
  ContactPersonEMail: string
}

export interface IUpdateStorageCompany extends IPostStorageCompany {

}

export interface IStorageCompany extends IUpdateStorageCompany {
  StorageCompanyId: number
}

export const emptyStorageCompany: IPostStorageCompany = {
  CompanyName: "",
  ContactPersonFullName: "",
  ContactPersonTel: "",
  ContactPersonEMail: "",
}
