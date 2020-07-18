import React, { useState } from "react"
import { Grid, makeStyles, Accordion, AccordionSummary, AccordionDetails, AccordionActions, Typography, Divider } from "@material-ui/core"
import { Formik } from "formik"
import Form from "../../../components/FormikFields/Form"
import PageHeader from "../../../components/PageHeader"
import { IPostLead, ILead } from "../../../interfaces/ILead"
import { FormikSubmit, FormikTextField } from "../../../components/Formik"
import { IPostBuilding } from "../../../interfaces/IBuilding"
import FormikActions from "../../../components/Formik/FormikActions"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { useTranslation } from "react-i18next"

interface OfferCommentProps {
  onChangeAndSave: (building: IPostLead) => Promise<void>
  lead: ILead
}

interface FormValues {
  Comment: string
}

export default function OfferComment(props: OfferCommentProps) {
  const {
    lead,
    onChangeAndSave
  } = props

  const { t } = useTranslation()

  // Set initial value according to if commented
  const [accordionOpen, setAccordionOpen] = useState<boolean>(lead.Comment.length > 0)

  return (
    <Formik<FormValues>
      initialValues={{
        Comment: lead.Comment
      }}
      onSubmit={async (values, actions) => {
        try {
          const { Comment } = values

          await onChangeAndSave({...lead, Comment: Comment})

          actions.setSubmitting(false)

          return
        } catch (e) {
          actions.setStatus(e)
        }
      }}
    >
      {() => (
        <Form disableSubmit disableGridContainer style={{ width: "100%" }}>
          <Accordion expanded={accordionOpen} onChange={() => setAccordionOpen(!accordionOpen)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
              <Typography variant="subtitle1">{t("OFFER.OFFER_COMMENT")}</Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <FormikTextField<FormValues> label={t("OFFER.COMMENT")} name="Comment" multiline />
            </AccordionDetails>
            <Divider />

            <AccordionActions>
              <FormikSubmit label={t("OFFER.SAVE_COMMENT")} />
            </AccordionActions>
          </Accordion>
        </Form>
      )}
    </Formik>

  )
}
