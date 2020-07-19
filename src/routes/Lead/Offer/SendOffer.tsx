import React, { useState } from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid,    Button, ListItem, List, IconButton, ListItemText, ListItemSecondaryAction, TextField, ListSubheader } from "@material-ui/core"
import {  FormikProps, withFormik, Field, FieldArray, Formik } from "formik"
import { injectIntl, WrappedComponentProps,  FormattedMessage, useIntl } from "react-intl"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps, useResourceContext } from "../../../providers/withResource"
import PageHeader from "../../../components/PageHeader"
import FormikSelectSimple from "../../../components/Formik/FormikSelectSimple"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import {  ILead } from "../../../interfaces/ILead"
import LeadAPI from "../LeadAPI"
import OfferService from "../../../services/OfferService"
import AddIcon from "@material-ui/icons/Add"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import { RouteComponentProps, useRouteMatch } from "react-router"
import DateHelper from "../../../helpers/DateHelper"
import { SendOfferEmailModel } from "../../../models/Offer"
import { FormikAutocompleteSimple } from "../../../components/Formik"
import { EmailTypeEnum } from "../../../models/EmailTypeModel"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"
import CCEmailList from "../../../components/Formik/CustomComponents/FormikCCEmailList"
import FormikCCEmailList from "../../../components/Formik/CustomComponents/FormikCCEmailList"
import { useTranslation } from "react-i18next"

interface FormValues extends Omit<SendOfferEmailModel, "OfferId" | "CSettingEmailTypeId">  {
  OfferId: number | null
  CSettingEmailTypeId: number | null
}

interface Props extends RouteComponentProps {
  nextPage: () => void
  lead: ILead
  offline: boolean
}

export default function SendOffer(props: Props) {
  const { lead, nextPage } = props
  const intl = useIntl()
  const { selectedCompany } = useResourceContext()
  const { t } = useTranslation()

  const match = useRouteMatch<{ offerId?: string }>()

  // const {  } = selectedCompany.Settings.

  const getInitialValues = (): FormValues => {
    if (match?.params.offerId) {
      const selectedOfferId = parseInt(match.params.offerId)
      if (!isNaN(selectedOfferId)) {
        const offer = props.lead.Offers.find(offer => offer.OfferId === selectedOfferId)

        if (offer) {
          return { OfferId: selectedOfferId, Comment: "", CCEmailList: [], CSettingEmailTypeId: null }
        }
      }
    }

    return { OfferId: null, Comment: "", CCEmailList: [], CSettingEmailTypeId: null }
  }

  if (!selectedCompany) {
    throw new Error("Selected company not defined")
  }

  return (
    <Formik<FormValues>
      initialValues={getInitialValues()}
      onSubmit={async(values, actions) => {
        try {
          const { OfferId, CSettingEmailTypeId } = values

          actions.setSubmitting(true)

          // If fields are empty
          if (!OfferId || !CSettingEmailTypeId) {
            actions.setSubmitting(false)
            return
          }

          await OfferService.sendOffer({ ...values, OfferId, CSettingEmailTypeId })
          actions.setSubmitting(false)
          actions.resetForm()
          nextPage()

        } catch (e) {
          actions.setStatus(e)
        }
      }}
    >
      {({ isSubmitting, values }) =>
        (
          <Form disableSubmit>
            <PageHeader title="SEND_OFFER" />

            <Field
              label="OFFER"
              name="OfferId"
              component={FormikSimpleSelect}
              notTranslated
              required
              options={lead.Offers.sort((offer1, offer2) => DateHelper.parseDateNotNull(offer2.Created).getTime() - DateHelper.parseDateNotNull(offer1.Created).getTime()).map(offer => ({
                label: intl.formatDate(DateHelper.parseDateNotNull(offer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }),
                value: offer.OfferId,
              }))}
            />

            <Grid item xs={12} md={6}>
              <FormikSelectSimple<FormValues>
                options={
                  selectedCompany.Settings.EmailTypes.filter(email => email.EmailType === EmailTypeEnum.Offer).map(email => ({ label: intl.formatMessage({id: email.SubjectTextKey ?? "NO_SUBJECT"}), value: email.CSettingEmailTypeId }))
                }
                name="CSettingEmailTypeId"
                label={t("EMAIL.SUBJECT_TEXT")}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormikCCEmailList<FormValues> name="CCEmailList" />
            </Grid>

            <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

            <Grid item xs={12}>
              <Button disabled={!values.OfferId || !values.CSettingEmailTypeId || isSubmitting} variant="contained" color="primary" type="submit">
                <FormattedMessage id="SEND_EMAIL" />
              </Button>
            </Grid>
          </Form>
        )}
    </Formik>
  )
}
