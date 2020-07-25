
export enum AppointmentTypeEnum {
  Visit = 0,
  Move = 1,
  PackServiceDate = 2,
  DisposalDate = 3,
  StorageDate = 4,
  CleaningDate = 5,
  HandOverDate = 6,
  DeliveryDate = 7,
  CollectBackDate = 8,
}

export enum EmailTypeEnum {
  AppointmentConfirm = 0,
  Offer = 1,
  AcceptConfirm = 2,
  CancelConfirm = 3,
  AppointmentReminder = 4,
  GeneralCommunication = 5,
}

export interface EmailTypeModel {

  CSettingEmailTypeId: number
  EmailType: EmailTypeEnum

  Name: string

  AppointmentType: AppointmentTypeEnum | null
  SubjectTextKey: string | null
  BodyContentIntroTextKey: string | null
  BodyContentMainTextKey: string | null
  BodyContentOutroTextKey: string | null
}
