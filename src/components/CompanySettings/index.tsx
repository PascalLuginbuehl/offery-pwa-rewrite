import React, { useEffect, useContext } from "react"
import Layout from "../Layout"
import { useDispatch, useSelector } from "react-redux"
import { CompanyActionCreators } from "../../actions"
import ResourceContext from "../../providers/withResource"
import { ApplicationState } from "../../store"
import { CircularProgress, Paper, Container, Typography, Grid } from "@material-ui/core"
import { Formik, Form } from "formik"
import { FormikTextField } from "../Formik"
import { useTranslation } from "react-i18next"
import { AdminCompanyModel } from "../../models"


type FormValues = AdminCompanyModel

export default function CompanySettings() {
  const dispatch = useDispatch()
  const resource = useContext(ResourceContext)

  useEffect(() => {
    if (resource.selectedCompany) {
      dispatch(CompanyActionCreators.requestCompany(resource.selectedCompany.CompanyId))
    }
  }, [resource, dispatch])

  const { company, companyLoading } = useSelector((state: ApplicationState) => state.company)

  const { t } = useTranslation()

  if (!company || companyLoading) {
    return <CircularProgress />
  }

  return (
    <Layout>
      <Container component={Paper} maxWidth="md">
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
                  <Typography variant="h2" paragraph>{t("TEST")}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormikTextField<FormValues>
                    label={t("NAME")}
                    name="Name"
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
