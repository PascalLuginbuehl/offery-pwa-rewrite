import * as React from "react"
import Form from "../../../components/FormikFields/Form"
import {     Grid,  InputAdornment, TextField as MuiTextField } from "@material-ui/core"
import {  useResourceContext } from "../../../providers/withResource"
import {  Field,  Formik } from "formik"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

import PageHeader from "../../../components/PageHeader"
import { ICleaningServiceConditions } from "../../../interfaces/IConditions"
import {  useIntl } from "react-intl"
import FormikPrice from "../../../components/Formik/CustomComponents/FormikPrice"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"
import FormikNumberEndAdornmentText from "../../../components/FormikFields/Numbers/FormikNumberEndAdornmentText"
import FormikPercent from "../../../components/FormikFields/Numbers/FormikPercent"
import { IPutCleaningService } from "../../../interfaces/IService"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"

interface FormValues {
  cleaningConditions: ICleaningServiceConditions
  cleaningService: IPutCleaningService
}

interface CleaningConditionProps {
  nextPage: () => void
  onChangeAndSave: (cleaningConditions: ICleaningServiceConditions, cleaningService: IPutCleaningService) => Promise<any>
  cleaningConditions: ICleaningServiceConditions
  cleaningService: IPutCleaningService
}

const getCost = (values: FormValues): number => {
  const {
    cleaningConditions: { HighPressureGarageCleaningFixPrice: NullHighPressureGarageCleaningFixPrice, DovelholePrice: NullDovelholePrice, HighPressureTerraceCleaningFixPrice: NullHighPressureTerraceCleaningFixPrice, CleaningFireplacePrice: NullCleaningFireplacePrice, CleaningCarpetPrice: NullCleaningCarpetPrice, CleaningWindowsPrice: NullCleaningWindowsPrice, CleaningWindowsWithShuttersPrice: NullCleaningWindowsWithShuttersPrice, CleaningSpecialPrice: NullCleaningSpecialPrice, FixPrice: NullFixPrice, DiscountInPercent: NullDiscountInPercent },
    cleaningService: { HighPressureGarageCleaningService, DovelholeService, HighPressureTerraceCleaningService, CleaningFireplaceService, CleaningCarpetService, CleaningWindowsService, CleaningWindowsWithShuttersService, CleaningSpecialService },
  } = values

  const HighPressureGarageCleaningFixPrice = NullHighPressureGarageCleaningFixPrice && HighPressureGarageCleaningService ? NullHighPressureGarageCleaningFixPrice : 0
  const DovelholePrice = NullDovelholePrice && DovelholeService ? NullDovelholePrice : 0
  const HighPressureTerraceCleaningFixPrice = NullHighPressureTerraceCleaningFixPrice && HighPressureTerraceCleaningService ? NullHighPressureTerraceCleaningFixPrice : 0
  const CleaningFireplacePrice = NullCleaningFireplacePrice && CleaningFireplaceService ? NullCleaningFireplacePrice : 0
  const CleaningCarpetPrice = NullCleaningCarpetPrice && CleaningCarpetService ? NullCleaningCarpetPrice : 0
  const CleaningWindowsPrice = NullCleaningWindowsPrice && CleaningWindowsService ? NullCleaningWindowsPrice : 0
  const CleaningWindowsWithShuttersPrice = NullCleaningWindowsWithShuttersPrice && CleaningWindowsWithShuttersService ? NullCleaningWindowsWithShuttersPrice : 0
  const CleaningSpecialPrice = NullCleaningSpecialPrice && CleaningSpecialService ? NullCleaningSpecialPrice : 0

  const FixPrice = NullFixPrice ? NullFixPrice : 0
  const DiscountInPercent = NullDiscountInPercent ? NullDiscountInPercent : 0
  const DiscountMultiplier = ((100 - DiscountInPercent) / 100)

  return (
    HighPressureGarageCleaningFixPrice +
    DovelholePrice +
    HighPressureTerraceCleaningFixPrice +
    CleaningFireplacePrice +
    CleaningCarpetPrice +
    CleaningWindowsPrice +
    CleaningWindowsWithShuttersPrice +
    CleaningSpecialPrice +
    FixPrice
  ) * DiscountMultiplier
}

export default function CleaningConditions(props: CleaningConditionProps) {
  const { cleaningService, onChangeAndSave, nextPage } = props
  const { resource, selectedCompany } = useResourceContext()
  const { formatMessage } = useIntl()

  if (!resource || !selectedCompany) {
    return null
  }

  const enabledPaymentMethods = resource.PaymentMethods.filter(p => selectedCompany.Settings.EnabledPaymentMethodTextKeys.includes(p.NameTextKey))

  const showHighPressureTerracePrice: boolean = (
    selectedCompany.Settings.EnableServiceCleaningHighPressureTerrace &&
    selectedCompany.Settings.EnableServiceCleaningHighPressureTerracePrice &&
    cleaningService.HighPressureTerraceCleaningService
  )

  const showFirePlacePrice = (selectedCompany.Settings.EnableServiceCleaningFirePlace &&
      selectedCompany.Settings.EnableServiceCleaningFirePlacePrice &&
      cleaningService.CleaningFireplaceService)

  const showCarpetPrice = (selectedCompany.Settings.EnableServiceCleaningCarpet &&
      selectedCompany.Settings.EnableServiceCleaningCarpetPrice &&
      cleaningService.CleaningCarpetService)

  const showHighPressureGaragePrice = (selectedCompany.Settings.EnableServiceCleaningHighPressureGarage &&
      selectedCompany.Settings.EnableServiceCleaningHighPressureGaragePrice &&
      cleaningService.HighPressureGarageCleaningService)

  const showWindowPrice = (selectedCompany.Settings.EnableServiceCleaningWindows &&
      selectedCompany.Settings.EnableServiceCleaningWindowsPrice &&
      cleaningService.CleaningWindowsService)

  const showWindowShuttersPrice = (selectedCompany.Settings.EnableServiceCleaningWindowsWithShutters &&
      selectedCompany.Settings.EnableServiceCleaningWindowsWithShuttersPrice &&
      cleaningService.CleaningWindowsWithShuttersService)

  return (
    <Formik<FormValues>
      initialValues={{ cleaningConditions: props.cleaningConditions, cleaningService: props.cleaningService }}
      onSubmit={async (values, actions) => {
        try {
          await onChangeAndSave(values.cleaningConditions, values.cleaningService)

          actions.setSubmitting(false)
          actions.resetForm()
          nextPage()
        } catch (e) {
          actions.setStatus(e)
        }
      }}
      render={({values}) => (
        <Grid item xs={12}>
          <Form>
            <PageHeader title="CLEANING_CONDITIONS" />

            {selectedCompany.Settings.EnableServiceCleaningHandOutGaranty ? (<Field label="HANDOUT_GARANTY" name="cleaningService.HandoutGaranty" component={FormikButtonCheckbox} />) : null}

            <FormikGroups label="PERSONAL_COST" xs={12}>
              {selectedCompany.Settings.EnableServiceCleaningWorkersAmount ? (<Field
                label="CLEANING_PERSONAL_AMOUNT"
                name="cleaningConditions.WorkersAmount"
                type="number"
                component={FormikTextField}
                inputProps={{ step: 1, min: 0 }}
                overrideGrid={{ xs: 6, md: 3 }}
              />) : null}

              {selectedCompany.Settings.EnableServiceCleaningEstimatedHoursOfWorkWhenFixPrice ? (<Field
                label="ESTIMATED_HOURS_OF_WORKING_WHEN_FIX_PRICE"
                name="cleaningConditions.EstimatedHoursOfWorkWhenFixPrice"
                component={FormikNumberEndAdornmentText}
                adornmentText="h"
                overrideGrid={{ xs: 6, md: 3 }}
              />) : null}

              <Grid item xs={6} md={3}><FormikPrice label={formatMessage({ id: "BASE_PRICE" })} name="cleaningConditions.FixPrice" /></Grid>
            </FormikGroups>

            {showHighPressureGaragePrice || showHighPressureTerracePrice ? (
              <FormikGroups label="HIGH_PRESURE_CLEANING_FIX_PRICE" xs={6} md={3}>
                {showHighPressureTerracePrice ? (
                  <Grid item xs={6}><FormikPrice label="TERRACE" name="cleaningConditions.HighPressureTerraceCleaningFixPrice" /></Grid>
                ) : null}
                {showHighPressureGaragePrice ? (
                  <Grid item xs={6}><FormikPrice label="GARAGE" name="cleaningConditions.HighPressureGarageCleaningFixPrice" /></Grid>
                ) : null}
              </FormikGroups>
            ) : null}

            {selectedCompany.Settings.EnableServiceCleaningDovelhole && cleaningService.DovelholeService &&
              (selectedCompany.Settings.EnableServiceCleaningDovelholeAmount || selectedCompany.Settings.EnableServiceCleaningDovelholePrice) ?
              (<FormikGroups label="DOVEL_HOLES" xs={6} md={3}>
                {selectedCompany.Settings.EnableServiceCleaningDovelholeAmount ? (<Field
                  label="AMOUNT"
                  name="cleaningConditions.DovelholeAmount"
                  type="number"
                  component={FormikTextField}
                  inputProps={{ step: 1, min: 0 }}
                  overrideGrid={{ xs: 6, md: undefined }}
                />) : null}
                {selectedCompany.Settings.EnableServiceCleaningDovelholePrice ?
                  (<Grid item xs={6}><FormikPrice label={formatMessage({ id: "PRICE" })} name="cleaningConditions.DovelholePrice" /></Grid>) : null}
              </FormikGroups>
              ) : null}

            {
              showFirePlacePrice ||
                showCarpetPrice ||
                showWindowPrice ||
                showWindowShuttersPrice
                ? (
                  <FormikGroups label="CLEANING_PRICES" xs={12} md={6}>
                    {showFirePlacePrice ? (
                      <Grid item xs={6}><FormikPrice label={formatMessage({id: "FIREPLACE"})} name="cleaningConditions.CleaningFireplacePrice" /></Grid>
                    ) : null}
                    {showCarpetPrice ? (
                      <Grid item xs={6}><FormikPrice label={formatMessage({ id: "CLEANING_CARPET"})} name="cleaningConditions.CleaningCarpetPrice" /></Grid>
                    ) : null}
                    {showWindowPrice ? (
                      <Grid item xs={6}><FormikPrice label={formatMessage({ id: "WINDOWS"})} name="cleaningConditions.CleaningWindowsPrice" /></Grid>
                    ) : null}
                    {showWindowShuttersPrice ? (
                      <Grid item xs={6}><FormikPrice label={formatMessage({ id: "WINDOWS_WITH_SHUTTERS" })} name="cleaningConditions.CleaningWindowsWithShuttersPrice" /></Grid>
                    ) : null}
                  </FormikGroups>
                ) : null
            }

            {selectedCompany.Settings.EnableServiceCleaningSpecial && cleaningService.CleaningSpecialService ?
              (<FormikGroups label="SPECIAL_CLEANING" xs={6} md={3}>
                {selectedCompany.Settings.EnableServiceCleaningSpecialPrice ?
                  (<Grid item xs={12}><FormikPrice label={formatMessage({ id: "PRICE" })} name="cleaningConditions.CleaningSpecialPrice" /></Grid>) : null}
                <Field name="cleaningConditions.CleaningSpecialComment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />
              </FormikGroups>
              ) : null}

            <FormikGroups label="PRICE" xs={12} md={6}>
              <Field label="DISCOUNT_IN_PERCENT" name="cleaningConditions.DiscountInPercent" component={FormikPercent} overrideGrid={{ xs: 2, md: undefined }} />

              <Grid item xs={5}>
                <MuiTextField
                  label={formatMessage({ id: "FIX_PRICE" })}
                  value={getCost(values)}
                  disabled={true}
                  type="number"
                  InputProps={{ startAdornment: <InputAdornment position="start">CHF</InputAdornment> }}
                />
              </Grid>
            </FormikGroups>

            <Field
              label="PAYMENT_METHOD"
              name={`cleaningConditions.PaymentMethodId`}
              component={FormikSimpleSelect}
              options={enabledPaymentMethods.map(e => ({ label: e.NameTextKey, value: e.PaymentMethodId }))}
            />

            {selectedCompany.Settings.EnableServiceCleaningComment ?
              (<Field name="cleaningService.Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />) : null}
          </Form>
        </Grid>
      )}
    />
  )
}
