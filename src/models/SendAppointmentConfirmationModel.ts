export interface SendAppointmentConfirmationEmailModel {
  LeadId: number
  Comment: string
  BuildingId: number
  CSettingEmailTypeId: number

  CCEmailList: string[]
}
