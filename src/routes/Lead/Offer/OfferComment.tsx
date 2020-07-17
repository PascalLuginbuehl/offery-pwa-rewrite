import React, { useState } from "react"
import { Grid, makeStyles, Accordion, AccordionSummary, AccordionDetails, AccordionActions, Typography } from "@material-ui/core"
import { Formik } from "formik"
import Form from "../../../components/FormikFields/Form"
import PageHeader from "../../../components/PageHeader"
import { IPostLead, ILead } from "../../../interfaces/ILead"
import { FormikSubmit, FormikTextField } from "../../../components/Formik"
import { IPostBuilding } from "../../../interfaces/IBuilding"
import FormikActions from "../../../components/Formik/FormikActions"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

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
          actions.resetForm()
        } catch (e) {
          actions.setStatus(e)
        }
      }}
    >
      {() => (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <Typography variant="subtitle1">OFFER_COMMENT</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Form disableSubmit>

              <Grid item xs={12}>
                <FormikTextField<FormValues> label="COMMENT" name="Comment" multiline />
              </Grid>
            </Form>
          </AccordionDetails>

          <AccordionActions>
            <FormikSubmit label="SEND_COMMENT" />
          </AccordionActions>
        </Accordion>
      )}
    </Formik>

  )
}
