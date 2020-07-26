import * as React from "react"
import { IOffer } from "../../../interfaces/IOffer"
import FormikSelectSimple, { FormikSelectSimpleProps } from "./../FormikSelectSimple"
import DateHelper from "../../../helpers/DateHelper"
import { useIntl } from "react-intl"

export interface FormikSelectOfferProps<FormValues> extends Omit<FormikSelectSimpleProps<FormValues>, "options"> {
  offers: IOffer[]
}

export default function FormikSelectOffer<FormValues>(props: FormikSelectOfferProps<FormValues>) {
  const { offers, ...selectProps } = props
  const intl = useIntl()

  return (
    <FormikSelectSimple<FormValues> options={
      offers
        .sort((offer1, offer2) => DateHelper.parseDateNotNull(offer2.Created).getTime() - DateHelper.parseDateNotNull(offer1.Created).getTime())
        .map(offer => ({
          label: `${offer.OfferId}, ${intl.formatDate(DateHelper.parseDateNotNull(offer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" })}`,
          value: offer.OfferId,
        }))
    }
    {...selectProps}
    />
  )
}
