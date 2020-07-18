
export interface AddressRegisterDTO {
  Street: string
  PLZ: string
  City: string
}

export interface AddressDTO extends AddressRegisterDTO {
  AddressId: number
}

export interface CSettingFontRegisterDTO {
  Name: string
  FontName: string
  FontSize: number
}

export interface CSettingFontDTO extends CSettingFontRegisterDTO {
  CSettingFontId: number
}

export interface CompanyRegisterModel {
  Name: string
  Email: string
  Telephone: string
  VatUID: string
  WebsiteURL: string
  HeadQuarter: AddressRegisterDTO
}

export interface ProductDTO {
  ProductId: number
  NameTextKey: string
  DescriptionTextKey: string
  SellPrice: number
  RentPrice: number
}

export interface OfferTemplateDTO {
  OfferTemplateId: number
  Name: string
  DocName: string
  LanguageCode: string
}

export interface OfferTemplateCategoryDTO {
  OfferTemplateCategoryId: number
  NameTextKey: string
  OfferTemplates: OfferTemplateDTO[]
}

export interface CompanyUpdateModel {
  CompanyId: number
  Name: string
  Email: string
  Telephone: string
  VatUID: string
  WebsiteURL: string

  HeadQuarterAddress: AddressRegisterDTO
  ContactPersonId: number
}

export interface CompanyAdminModel extends CompanyUpdateModel {
  HeadQuarterAddress: AddressDTO
}
