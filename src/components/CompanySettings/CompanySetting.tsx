import React, { useEffect, useContext } from "react"
import Layout from "../Layout"
import { useSelector } from "react-redux"
import {   fetchCompanySettingById, updateCompanySetting } from "../../slicers"
import ResourceContext from "../../providers/withResource"
import { RootState, useAppDispatch } from "../../store"
import { CircularProgress, Typography, Grid } from "@material-ui/core"
import { Formik, Form } from "formik"
import {  FormikSubmit } from "../Formik"
import { useTranslation } from "react-i18next"
import Container from "../Container"
import { CompanySettingModel } from "../../models/CompanySettingModel"

type FormValues = CompanySettingModel

export default function CompanySetting() {
  const dispatch = useAppDispatch()
  const resource = useContext(ResourceContext)

  const { companySetting, companySettingLoading } = useSelector((state: RootState) => state.company)

  useEffect(() => {
    if (resource.selectedCompany && companySettingLoading === "idle") {
      void dispatch(fetchCompanySettingById(resource.selectedCompany.CompanyId))
    }
  }, [resource, dispatch])

  const { t } = useTranslation()

  if (!companySetting || companySettingLoading !== "succeeded") {
    return <CircularProgress />
  }

  return (
    <Layout>
      <Container maxWidth='md'>
        <Formik<FormValues>
          initialValues={companySetting}
          onSubmit={async (values) => {
            await dispatch(updateCompanySetting(values))

            return
          }}
        >
          {() => (
            <Form>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h4" paragraph>{t("COMPANYSETTINGS.COMPANYSETTING")}</Typography>
                </Grid>



                <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
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
