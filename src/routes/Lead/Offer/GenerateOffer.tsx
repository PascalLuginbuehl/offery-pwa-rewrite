import { createStyles,   Theme, WithStyles, withStyles, Grid, makeStyles } from "@material-ui/core"
import React, { useState } from "react"
import { withResource, WithResourceProps, useResourceContext } from "../../../providers/withResource"
import {  FormikProps, Field,   withFormik, Formik } from "formik"

import Form from "../../../components/FormikFields/Form"

import PageHeader from "../../../components/PageHeader"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"
import SelectBuilding from "../../../components/FormikFields/Bundled/SelectBuilding"

import OfferService from "../../../services/OfferService"
import { ILead } from "../../../interfaces/ILead"
import { ILeadContainer } from "../LeadAPI"

import animation from "../../../components/lottie/12818-file-recover.json"
import Lottie from "lottie-react-web"
import { IBuilding } from "../../../interfaces/IBuilding"
import Dropzone from "react-dropzone" //https://github.com/react-dropzone/react-dropzone
import IntlTypography from "../../../components/Intl/IntlTypography"
import OfflineUnavailable from "../../../components/OfflineUnavailable"

const useStyles = makeStyles({
  dropzone: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out"
  }
})

interface FormValues {
  templateCategoryId: number | null
  billBuildingId: number | null
}

interface GenerateOfferProps {
  nextPage: (stringAddition?: string) => void
  // onSaveAndNextPage: (templateCategoryId: number, type: number, outAddressId: number, inAddressId: number) => Promise<any>
  buildings: IBuilding[]
  lead: ILead
  offline: boolean
  onChange: (value: any, name: keyof ILeadContainer) => void
}

export default function GenerateOffer(props: GenerateOfferProps) {
  const {
    buildings,
    offline,
    lead,
    onChange,
    nextPage
  } = props

  const [isUploading, setIsUploading] = useState<boolean>(false)

  const classes = useStyles()
  const { selectedCompany } = useResourceContext()

  if (!selectedCompany) {
    throw new Error("selected company not defined")
  }

  const { OfferTemplateCategories } = selectedCompany

  const uploadOffer = async (file: any) => {
    try {
      setIsUploading(true)
      const offer = await OfferService.uploadOffer(lead.LeadId, file)

      // Update Lead
      onChange({ ...lead, Offers: [...lead.Offers, offer] }, "Lead")
      nextPage("/" + offer.OfferId)
    } catch (e) {
      setIsUploading(false)
      if (e.json && e.json.Message) {
        alert(e.json.Message)
      }
    }
  }

  return (
    <Formik<FormValues>
      initialValues={{
        templateCategoryId: OfferTemplateCategories.length === 1 ? OfferTemplateCategories[0].OfferTemplateCategoryId : null,
        billBuildingId: lead.BillBuildingId,
      }}
      onSubmit={async (values, actions) => {
        try {
          const { templateCategoryId, billBuildingId } = values
          if (templateCategoryId && billBuildingId) {
            const offer = await OfferService.getOffer(lead.LeadId, templateCategoryId, billBuildingId)

            onChange({ ...lead, Offers: [...lead.Offers, offer] }, "Lead")

            actions.setSubmitting(false)
            actions.resetForm()
            nextPage("/" + offer.OfferId.toString())
          } else {
            actions.setSubmitting(false)
            actions.resetForm()
            nextPage()
          }
        } catch (e) {
          actions.setStatus(e)
        }
      }}
    >
      {({ isSubmitting }) => (
        <OfflineUnavailable offline={offline}>

          <Form>
            <PageHeader title="GENERATE_OFFER" />

            <Field
              label="TEMPLATE_CATEGORY"
              name="templateCategoryId"
              component={FormikSimpleSelect}
              // Fixme, there is no 2 possible
              options={selectedCompany.OfferTemplateCategories.map(e => ({ label: e.NameTextKey, value: e.OfferTemplateCategoryId }))}
            />

            <Field name="billBuildingId" label="BILL_BUILDING" buildings={buildings} component={SelectBuilding} />

            {
              isSubmitting || isUploading ?
                <Grid item xs={12}>
                  <Lottie
                    height={256}
                    width={256}
                    options={{
                      animationData: animation,
                      // loop: false,
                    }}
                  />
                </Grid>
                :
                null
            }

            <Grid item xs={12}>
              <Dropzone onDrop={acceptedFiles => uploadOffer(acceptedFiles[0])}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps({ className: classes.dropzone })}>
                      <input {...getInputProps({
                        accept: ".docx",
                        multiple: false
                      })} />
                      <IntlTypography color="inherit">DROPZONE_FIELD_DRAGORCLICK</IntlTypography>
                    </div>
                  </section>
                )}
              </Dropzone>
            </Grid>
          </Form>
        </OfflineUnavailable>
      )}
    </Formik>
  )
}
