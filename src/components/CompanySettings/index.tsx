import React, { useEffect, useContext } from "react"
import Layout from "../Layout"
import { useDispatch, useSelector } from "react-redux"
import { fetchCompanyById } from "../../slicers"
import ResourceContext from "../../providers/withResource"
import { RootState } from "../../store"
import { CircularProgress,  Typography, Grid } from "@material-ui/core"
import { Formik, Form } from "formik"
import { FormikTextField } from "../Formik"
import { useTranslation } from "react-i18next"
import { AdminCompanyModel } from "../../models"
import Container from "../Container"

type FormValues = AdminCompanyModel

export default function CompanySettings() {

  const dispatch = useDispatch()
  const resource = useContext(ResourceContext)

  const { company, loading } = useSelector((state: RootState) => state.company)

  useEffect(() => {
    if (resource.selectedCompany && loading === "idle") {
      dispatch(fetchCompanyById(resource.selectedCompany.CompanyId))
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
            console.log(values)
          }}
        >
          {() => (
            <Form>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h2" paragraph>{t("COMPANYSETTINGS.MASTERDATA")}</Typography>
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

              </Grid>
            </Form>
          )}
        </Formik>
      </Container>
    </Layout>
  )
}
