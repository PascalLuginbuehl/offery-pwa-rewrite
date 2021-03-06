import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import {  FormikProps, withFormik, Field } from "formik"
import { injectIntl, WrappedComponentProps } from "react-intl"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../../providers/withResource"

import PageHeader from "../../../components/PageHeader"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

import {  IPostLead } from "../../../interfaces/ILead"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import { isValidPhoneNumber } from "react-phone-number-input"
import FormikPhoneNumber from "../../../components/FormikFields/FormikPhoneNumber"

const styles = (theme: Theme) => createStyles({})

type Values = IPostLead

interface Props extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  nextPage: () => void
  onChangeAndSave: (lead: IPostLead) => Promise<void>
  lead: IPostLead
}

class Customer extends React.Component<Props & FormikProps<Values>, {}> {
  validatePhoneNumber = (value: string) => {
    if (value !== null && value.length > 0 && isValidPhoneNumber(value) !== true) {
      return this.props.intl.formatMessage({id: "PHONE_NUMBER_INVALID"})
    }
    return
  }

  public render() {
    const { values, isSubmitting, status, resource, selectedCompany } = this.props
    const { VisitDate, MoveDate } = values

    const initialDate = new Date()
    initialDate.setHours(selectedCompany.Settings.DefaultServiceTimeStart || 8)
    initialDate.setMinutes(0)
    initialDate.setSeconds(0)

    const VisitDatePlus7: Date = VisitDate ? new Date(VisitDate) : new Date(initialDate)

    VisitDatePlus7.setDate(VisitDatePlus7.getDate() + 7)

    const VisitDatePlus1 = VisitDate ? new Date(VisitDate) : new Date(initialDate)
    VisitDatePlus1.setDate(VisitDatePlus1.getDate() + 7)

    const MoveDatePlus1 = MoveDate ? new Date(MoveDate) : new Date(VisitDatePlus7)
    MoveDatePlus1.setDate(MoveDatePlus1.getDate() + 1)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="CUSTOMER" />

          <FormikGroups label="CUSTOMER" xs={12}>
            <Field label="LASTNAME" name="Customer.Lastname" required component={FormikTextField} overrideGrid={{ xs: 6, md: undefined }} />

            <Field label="FIRSTNAME" name="Customer.Firstname" required component={FormikTextField} overrideGrid={{ xs: 6, md: undefined }} />

            <Field
              label="GENDER"
              name="Customer.IsMale"
              component={FormikSimpleSelect}
              options={[
                { label: "MALE", value: true },
                { label: "FEMALE", value: false },
              ]}
              overrideGrid={{ xs: 6, md: undefined }}
            />

            <Field
              label="LANGUAGE"
              name="Customer.PrefferedLanguage"
              required
              component={FormikSimpleSelect}
              options={[
                { label: "GERMAN", value: "DE" },
                { label: "ENGLISH", value: "EN" },
              ]}
              overrideGrid={{ xs: 6, md: undefined }}
            />

            <Field label="COMPANY" name="Customer.CompanyName" component={FormikTextField} overrideGrid={{ xs: 6, md: undefined }} />

            <Field label="EMAIL" name="Customer.Email" type="email" component={FormikTextField} overrideGrid={{ xs: 6, md: undefined }} required />
            <Field label="PHONE" name="Customer.TelephoneNumber" component={FormikPhoneNumber} overrideGrid={{ xs: 6, md: undefined }} validate={this.validatePhoneNumber}
              defaultCountry="ch"
              preferredCountries={["ch"]}
              onlyCountries= {["ch", "de", "it", "fr", "at"]}/>
          </FormikGroups>

          <FormikGroups label="DATES" xs={12}>
            <Field name="VisitDate" label="VISITING" component={FormikDateTimePicker} initialFocusedDate={initialDate} />

            {selectedCompany.Settings.EnableMaterialOrder && selectedCompany.Settings.EnableMaterialOrderDelivery ?
              (<Field name="DeliveryDate" label="CARDBOARDBOX_DELIVERY" component={FormikDateTimePicker} initialFocusedDate={VisitDatePlus1} />) : null }

            {selectedCompany.Settings.EnableMaterialOrder && selectedCompany.Settings.EnableMaterialOrderDelivery ?
              (<Field name="CollectBackDate" label="COLLECTBACKDATE" component={FormikDateTimePicker} initialFocusedDate={VisitDatePlus1} />) : null}

            {selectedCompany.Settings.EnableServicePack ? (<Field name="PackServiceDate" label="PACKINGSERVICE" component={FormikDateTimePicker} initialFocusedDate={MoveDate ? MoveDate : VisitDatePlus7} />) : null}

            {selectedCompany.Settings.EnableServiceMove ? (<Field name="MoveDate" label="MOVING" component={FormikDateTimePicker} initialFocusedDate={VisitDatePlus7} />) : null }
            {selectedCompany.Settings.EnableServiceStorage ? (<Field name="StorageDate" label="STORAGE" component={FormikDateTimePicker} initialFocusedDate={MoveDate ? MoveDate : VisitDatePlus7} />) : null }
            {selectedCompany.Settings.EnableServiceDisposal ? (<Field name="DisposalDate" label="DISPOSAL" component={FormikDateTimePicker} initialFocusedDate={MoveDate ? MoveDate : VisitDatePlus7} />) : null }
            {selectedCompany.Settings.EnableServiceCleaning ? (<Field name="CleaningDate" label="CLEANING" component={FormikDateTimePicker} initialFocusedDate={MoveDatePlus1} />) : null }
            {selectedCompany.Settings.EnableServiceCleaning && selectedCompany.Settings.EnableServiceCleaningHandOutGaranty ?
              (<Field name="HandOverDate" label="HANDIN" component={FormikDateTimePicker} initialFocusedDate={MoveDatePlus1} />) : null }
          </FormikGroups>
        </Form>
      </Grid>
    )
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => props.lead,

        handleSubmit: async (values, actions) => {
          try {
            await actions.props.onChangeAndSave(values)

            actions.setSubmitting(false)
            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(Customer)
    )
  )
)
