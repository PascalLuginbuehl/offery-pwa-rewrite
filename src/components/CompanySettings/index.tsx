import React, { useEffect, useContext } from "react"
import Layout from "../Layout"
import {  useSelector } from "react-redux"
import { fetchCompanyById, updateCompany } from "../../slicers"
import ResourceContext from "../../providers/withResource"
import { RootState, useAppDispatch } from "../../store"
import { CircularProgress,  Typography, Grid } from "@material-ui/core"
import { Formik, Form } from "formik"
import { FormikTextField, FormikSubmit } from "../Formik"
import { useTranslation } from "react-i18next"
import { CompanyUpdateModel } from "../../models"
import Container from "../Container"

type FormValues = CompanyUpdateModel

export default function Index() {
  const dispatch = useAppDispatch()
  const resource = useContext(ResourceContext)

  const { company, companyLoading: loading } = useSelector((state: RootState) => state.company)

  useEffect(() => {
    if (resource.selectedCompany && loading === "idle") {
      void dispatch(fetchCompanyById(resource.selectedCompany.CompanyId))
    }
  }, [resource, dispatch])

  const { t } = useTranslation()

  if (!company || loading !== "succeeded") {
    return <CircularProgress />
  }

  return (
    <Layout>
      <Container maxWidth='md'>
        <Formik<FormValues>
          initialValues={company}
          onSubmit={async (values) => {
            await dispatch(updateCompany(values))

            return
          }}
        >
          {() => (
            <Form>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h4" paragraph>{t("COMPANYSETTINGS.MASTERDATA")}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormikTextField<FormValues>
                    label={t("FIELDS.NAME")}
                    name="Name"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormikTextField<FormValues>
                    label={t("FIELDS.EMAIL")}
                    name="Email"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormikTextField<FormValues>
                    label={t("FIELDS.PHONE")}
                    name="Telephone"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormikTextField<FormValues>
                    label="VatUID"
                    name="VatUID"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormikTextField<FormValues>
                    label={t("FIELDS.WEBSITE_URL")}
                    name="WebsiteURL"
                  />
                </Grid>

                <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end"}}>
                  <FormikSubmit label={t("SAVE")} />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Container>
    </Layout>
  )
}
