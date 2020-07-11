import React, { useEffect, useContext } from "react"
import Layout from "../Layout"
import { useSelector } from "react-redux"
import {   fetchCompanySettingById, updateCompanySetting } from "../../slicers"
import ResourceContext from "../../providers/withResource"
import { RootState, useAppDispatch } from "../../store"
import { CircularProgress, Typography, Grid } from "@material-ui/core"
import { Formik, Form } from "formik"
import {  FormikSubmit, FormikTextField } from "../Formik"
import { useTranslation } from "react-i18next"
import Container from "../Container"
import { CompanySettingModel } from "../../models/CompanySettingModel"
import  { FormikSwitchProps } from "../Formik/FormikSwitch"
import FormikPrice from "../Formik/CustomComponents/FormikPrice"

type FormValues = CompanySettingModel

export default function CompanySetting() {
  const dispatch = useAppDispatch()
  const resource = useContext(ResourceContext)

  const { company, companySetting, companySettingLoading } = useSelector((state: RootState) => state.company)

  useEffect(() => {
    if (resource.selectedCompany && companySettingLoading === "idle") {
      void dispatch(fetchCompanySettingById(resource.selectedCompany.CompanyId))
    }
  }, [resource, dispatch])

  const { t } = useTranslation()

  if (!company || !companySetting || companySettingLoading !== "succeeded") {
    return <CircularProgress />
  }

  function Switch<FormValues>(props: FormikSwitchProps<FormValues>) {
    return <Grid item xs={12}>
      <Switch<FormValues>
        {...props}
      />
    </Grid>
  }

  return (
    <Layout>
      <Container maxWidth='md'>
        <Formik<FormValues>
          initialValues={companySetting}
          onSubmit={async (values) => {
            await dispatch(updateCompanySetting({ companyId: company.CompanyId, companySetting: values}))

            return
          }}
        >
          {() => (
            <Form >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h4" paragraph>{t("COMPANYSETTINGS.COMPANYSETTING")}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormikTextField<FormValues>
                    label="DefaultServiceTimeStart"
                    name="DefaultServiceTimeStart"
                    type="number"
                    required
                    inputProps={{
                      step: 0.25,
                      min: 0,
                      max: 24,
                    }}
                    helperText={"0 - 24 -> 8 => 08:00 (Not implemented in Front End)"}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormikPrice<FormValues>
                    label="DefaultFurnitureLiftPrice"
                    name="DefaultFurnitureLiftPrice"
                  />
                </Grid>

                {/* [Required]
        public double? DefaultFurnitureLiftPrice {get; set; }
        public double? DefaultPianoPrice {get; set; }
        public double? DefaultHeavyLiftPrice {get; set; }
        public double? DefaultCostEntry {get; set; }
        public double? DefaultCostPerCubicInMoney {get; set; }
        [Required]
        public string DefaultPaymentMethodTextKey {get; set; }


        #region Conditiontypes Hourly/CostCeiling/Fixprice
        [Required]
        public bool EnableHourPice {get; set; }
        [Required]
        public bool EnableDefaultHourPrice {get; set; }
        public double[] HourlyPriceRangeJSON {get; set; } //info: JsonConvert.SerializeObject(new double[]{80.00, 100.00, 120.00})

        [Required]
        public bool EnableCostCeiling {get; set; }
        [Required]
        public bool EnableDefaultHasCostCeiling {get; set; }

        [Required]
        public bool EnableFixPrice {get; set; }
        [Required]
        public string[] EnabledPaymentMethodTextKeys {get; set; }//info: JsonConvert.SerializeObject(new string[]{Consts.CASH, etc. })
        [Required]
        public bool EnableWorkerExpenses {get; set; }
        #endregion

        #region Move
        public bool EnableServiceMove {get; set; }
        public bool EnableServiceMoveBore {get; set; }
        public bool EnableServiceMoveBoreAmount {get; set; }
        public bool EnableServiceMoveBorePrice {get; set; }
        public bool EnableServiceMoveMontage {get; set; }
        public bool EnableServiceMoveMontagePrice {get; set; }
        public bool EnableServiceMoveDemontage {get; set; }
        public bool EnableServiceMoveDemontagePrice {get; set; }
        public bool EnableServiceMoveLampDemontage {get; set; }
        public bool EnableServiceMoveLampDemontageAmount {get; set; }
        public bool EnableServiceMoveLampDemontagePrice {get; set; }
        public bool EnableServiceMoveFurnitureLift {get; set; }
        public bool EnableServiceMoveFurnitureLiftPrice {get; set; }
        public bool EnableServiceMoveHeavyLift {get; set; }
        public bool EnableServiceMoveHeavyLiftPrice {get; set; }
        public bool EnableServiceMovePiano {get; set; }
        public bool EnableServiceMovePianoPrice {get; set; }
        public bool EnableServiceMoveComment {get; set; }
        #endregion

        #region Cleaning
        public bool EnableServiceCleaning {get; set; }
        public bool EnableServiceCleaningEstimatedHoursOfWorkWhenFixPrice {get; set; }
        public bool EnableServiceCleaningWorkersAmount {get; set; }
        public bool EnableServiceCleaningHandOutGaranty {get; set; }
        public bool EnableServiceCleaningHighPressureTerrace {get; set; }
        public bool EnableServiceCleaningHighPressureTerracePrice {get; set; }
        public bool EnableServiceCleaningFirePlace {get; set; }
        public bool EnableServiceCleaningFirePlacePrice {get; set; }
        public bool EnableServiceCleaningCarpet {get; set; }
        public bool EnableServiceCleaningCarpetPrice {get; set; }
        public bool EnableServiceCleaningHighPressureGarage {get; set; }
        public bool EnableServiceCleaningHighPressureGaragePrice {get; set; }
        public bool EnableServiceCleaningWindows {get; set; }
        public bool EnableServiceCleaningWindowsPrice {get; set; }
        public bool EnableServiceCleaningWindowsWithShutters {get; set; }
        public bool EnableServiceCleaningWindowsWithShuttersPrice {get; set; }
        public bool EnableServiceCleaningDovelhole {get; set; }
        public bool EnableServiceCleaningDovelholeAmount {get; set; }
        public bool EnableServiceCleaningDovelholePrice {get; set; }
        public bool EnableServiceCleaningSpecial {get; set; }
        public bool EnableServiceCleaningSpecialPrice {get; set; }
        public bool EnableServiceCleaningComment {get; set; }
        #endregion

        #region Disposal
        public bool EnableServiceDisposal {get; set; }
        public bool EnableServiceDisposalLampDemontage {get; set; }
        public bool EnableServiceDisposalLampDemontageAmount {get; set; }
        public bool EnableServiceDisposalLampDemontagePrice {get; set; }
        public bool EnableServiceDisposalHeavyLift {get; set; }
        public bool EnableServiceDisposalHeavyLiftPrice {get; set; }
        public bool EnableServiceDisposalDemontage {get; set; }
        public bool EnableServiceDisposalDemontagePrice {get; set; }
        public bool EnableServiceDisposalFurnitureLift {get; set; }
        public bool EnableServiceDisposalFurnitureLiftPrice {get; set; }
        public bool EnableServiceDisposalComment {get; set; }
        #endregion

        #region Pack
        public bool EnableServicePack {get; set; }
        public bool EnableServicePackOut {get; set; }
        public bool EnableServicePackHeavyLift {get; set; }
        public bool EnableServicePackHeavyLiftPrice {get; set; }
        public bool EnableServicePackComment {get; set; }
        #endregion

        #region Storage
        public bool EnableServiceStorage {get; set; }
        public bool EnableServiceStorageBore {get; set; }
        public bool EnableServiceStorageBoreAmount {get; set; }
        public bool EnableServiceStorageBorePrice {get; set; }
        public bool EnableServiceStorageMontage {get; set; }
        public bool EnableServiceStorageMontagePrice {get; set; }
        public bool EnableServiceStorageDemontage {get; set; }
        public bool EnableServiceStorageDemontagePrice {get; set; }
        public bool EnableServiceStorageLampDemontage {get; set; }
        public bool EnableServiceStorageLampDemontageAmount {get; set; }
        public bool EnableServiceStorageLampDemontagePrice {get; set; }
        public bool EnableServiceStorageFurnitureLift {get; set; }
        public bool EnableServiceStorageFurnitureLiftPrice {get; set; }
        public bool EnableServiceStorageHeavyLift {get; set; }
        public bool EnableServiceStorageHeavyLiftPrice {get; set; }
        public bool EnableServiceStoragePiano {get; set; }
        public bool EnableServiceStoragePianoPrice {get; set; }
        public bool EnableServiceStorageCompanyName {get; set; }
        public bool EnableServiceStorageContactPersonFullName {get; set; }
        public bool EnableServiceStorageContactPersonTel {get; set; }
        public bool EnableServiceStorageContactPersonEMail {get; set; }
        public bool EnableServiceStorageComment {get; set; }
        #endregion

        #region MaterialOrder */}
                {/* public bool EnableMaterialOrder {get; set; }
        public bool EnableMaterialOrderDelivery {get; set; }
        public bool EnableMaterialOrderRent {get; set; }
        public bool EnableMaterialOrderBuy {get; set; }
        public bool EnableMaterialOrderFree {get; set; }
        public bool EnableMaterialOrderComment {get; set; }
        #endregion

        #region Buildings
        public CompanyBuildingSettingDTO DefaultBuildingSetting {get; set; }
        public CompanyBuildingSettingDTO CleaningServiceBuildingSetting {get; set; }
        public CompanyBuildingSettingDTO DisposalServiceBuildingSetting {get; set; }
        public CompanyBuildingSettingDTO MoveServiceOutBuildingSetting {get; set; }
        public CompanyBuildingSettingDTO MoveServiceInBuildingSetting {get; set; }
        public CompanyBuildingSettingDTO PackServiceBuildingSetting {get; set; }
        public CompanyBuildingSettingDTO StorageServiceInBuildingSetting {get; set; }
        public CompanyBuildingSettingDTO StorageServiceStorageInBuildingSetting {get; set; }
        public CompanyBuildingSettingDTO StorageServiceOutBuildingSetting {get; set; }
        #endregion

        #region Email
        public string VisitConfirmEmailSubjectTextKey {get; set; }
        public string VisitConfirmEmailBodyContentIntroTextKey {get;set; }
        public string VisitConfirmEmailBodyContentOutroTextKey {get;set; }

        public string OfferEmailSubjectTextKey {get;set; }
        public string OfferEmailBodyContentIntroTextKey {get;set; }
        public string OfferEmailBodyContentOutroTextKey {get;set; }
        #endregion

        #region Appointments
        public int AppointmentVisitDuration {get;set; }
        public int AppointmentMoveDuration {get; set; }
        public int AppointmentPackDuration {get; set; }
        public int AppointmentDeliveryDuration {get; set; }
        public int AppointmentStorageDuration {get; set; }
        public int AppointmentDisposalDuration {get; set; }
        public int AppointmentCleaningDuration {get; set; }
        public int AppointmentHandOverDuration {get; set; }
        #endregion */}




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
