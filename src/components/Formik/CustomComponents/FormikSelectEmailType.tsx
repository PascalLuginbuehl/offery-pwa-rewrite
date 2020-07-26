import * as React from "react"
import { IOffer } from "../../../interfaces/IOffer"
import FormikSelectSimple, { FormikSelectSimpleProps } from "./../FormikSelectSimple"
import { useIntl } from "react-intl"
import { EmailTypeEnum } from "../../../models/EmailTypeModel"
import { useResourceContext } from "../../../providers/withResource"

export interface FormikSelectEmailTypeProps<FormValues> extends Omit<FormikSelectSimpleProps<FormValues>, "options"> {
  emailType: EmailTypeEnum
}

export default function FormikSelectEmailType<FormValues>(props: FormikSelectEmailTypeProps<FormValues>) {
  const { emailType, ...selectProps } = props
  const intl = useIntl()
  const { selectedCompany } = useResourceContext()

  if (!selectedCompany) {
    throw new Error("no company selected")
  }

  return (
    <FormikSelectSimple<FormValues> options={
      selectedCompany.Settings.EmailTypes
        .filter(email => email.EmailType === emailType)
        .map(email => ({ label: intl.formatMessage({ id: email.Name ?? "NO_SUBJECT" }), value: email.CSettingEmailTypeId, secondaryLabel: intl.formatMessage({ id: email.SubjectTextKey ?? "NO_SUBJECT" }) }))
    }
    {...selectProps}
    />
  )
}
