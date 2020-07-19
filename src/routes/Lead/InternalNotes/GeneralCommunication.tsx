import React, { useState } from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, Button, ListItem, List, IconButton, ListItemText, ListItemSecondaryAction, TextField, ListSubheader } from "@material-ui/core"
import { FormikProps, withFormik, Field, FieldArray, Formik } from "formik"
import { injectIntl, WrappedComponentProps, FormattedMessage, useIntl } from "react-intl"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps, useResourceContext } from "../../../providers/withResource"
import PageHeader, { NewPageHeader } from "../../../components/PageHeader"
import FormikSelectSimple from "../../../components/Formik/FormikSelectSimple"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import { ILead, IPostLead} from "../../../interfaces/ILead"
import { EmailTypeEnum } from "../../../models/EmailTypeModel"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"
import CCEmailList from "../../../components/Formik/CustomComponents/FormikCCEmailList"
import FormikCCEmailList from "../../../components/Formik/CustomComponents/FormikCCEmailList"
import { useTranslation } from "react-i18next"
import { SendGeneralCommunicationEmailModel } from "../../../models/SendGeneralCommunicationEmailModel"
import OfferService from "../../../services/OfferService"

interface FormValues extends Omit<SendGeneralCommunicationEmailModel, "CSettingEmailTypeId" | "LeadId"> {
  CSettingEmailTypeId: number | null
}

interface GeneralCommunicationProps {
  nextPage: () => void
  lead: ILead
  onChangeAndSave: (lead: IPostLead) => Promise<void>
}

export default function GeneralCommunication(props: GeneralCommunicationProps) {
  const { nextPage, lead } = props
  const { selectedCompany } = useResourceContext()
  const { t } = useTranslation()
  const intl = useIntl()

  if (!selectedCompany) {
    throw new Error("selectedCompany not defined")
  }

  return (
    <Formik<FormValues>
      initialValues={{
        CSettingEmailTypeId: null,
        CCEmailList: [],
        Comment: "",
      }}
      onSubmit={async (values, actions) => {
        try {
          const { CSettingEmailTypeId } = values

          actions.setSubmitting(true)

          // If fields are empty
          if (!CSettingEmailTypeId) {
            actions.setSubmitting(false)
            return
          }

          await OfferService.sendGeneralCommunication({ ...values, CSettingEmailTypeId, LeadId: lead.LeadId })
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
            <NewPageHeader title={t("GENERAL_COMMUNICATION.HEADER")} />

            <Grid item xs={12} md={6}>
              <FormikSelectSimple<FormValues>
                options={
                  selectedCompany.Settings.EmailTypes.filter(email => email.EmailType === EmailTypeEnum.GeneralCommunication).map(email => ({ label: intl.formatMessage({ id: email.SubjectTextKey ?? "NO_SUBJECT" }), value: email.CSettingEmailTypeId }))
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
              <Button disabled={!values.CSettingEmailTypeId || isSubmitting} variant="contained" color="primary" type="submit">
                <FormattedMessage id="SEND_EMAIL" />
              </Button>
            </Grid>
          </Form>
        )}
    </Formik>
  )
}
