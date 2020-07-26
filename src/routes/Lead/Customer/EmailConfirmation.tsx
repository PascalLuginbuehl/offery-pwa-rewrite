import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid,    Button, Divider } from "@material-ui/core"
import {  FormikProps, withFormik, Field } from "formik"
import { injectIntl, WrappedComponentProps,  FormattedMessage } from "react-intl"
import { IBuilding } from "../../../interfaces/IBuilding"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import PageHeader from "../../../components/PageHeader"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

import { ILead, IPostLead } from "../../../interfaces/ILead"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"

import LeadAPI from "../LeadAPI"
import LeadService from "../../../services/LeadService"
import SelectBuilding from "../../../components/FormikFields/Bundled/SelectBuilding"
import { SendAppointmentConfirmationEmailModel } from "../../../models/SendAppointmentConfirmationModel"
import FormikCCEmailList from "../../../components/Formik/CustomComponents/FormikCCEmailList"
import FormikSelectSimple from "../../../components/Formik/FormikSelectSimple"
import { EmailTypeEnum, AppointmentTypeEnum } from "../../../models/EmailTypeModel"
import { useTranslation } from "react-i18next"
import FormikSelectEmailType from "../../../components/Formik/CustomComponents/FormikSelectEmailType"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

const styles = (theme: Theme) => createStyles({})

interface FormValues extends Omit<SendAppointmentConfirmationEmailModel, "BuildingId" | "CSettingEmailTypeId" | "LeadId"> {
  BuildingId: number | null

  VisitDate: Date | null
  DeliveryDate: Date | null
  CSettingEmailTypeId: number | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  nextPage: () => void
  lead: ILead
  offline: boolean
  // onChangeAndSave: (lead: ILead) => void
  buildings: IBuilding[]
  onChangeAndSave: (lead: IPostLead) => Promise<void>
}

class Customer extends React.Component<Props & FormikProps<FormValues>, {}> {
  public render() {
    const { selectedCompany, values, lead, buildings, intl } = this.props
    // const { VisitConfirmEmailSubjectTextKey, VisitConfirmEmailBodyContentOutroTextKey, VisitConfirmEmailBodyContentIntroTextKey } = selectedCompany.Settings

    const { VisitDate } = lead

    const initialDate = new Date()
    initialDate.setHours(selectedCompany.Settings.DefaultServiceTimeStart || 8)
    initialDate.setMinutes(0)
    initialDate.setSeconds(0)

    const VisitDatePlus1 = VisitDate ? new Date(VisitDate) : new Date(initialDate)
    VisitDatePlus1.setDate(VisitDatePlus1.getDate() + 7)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="EMAIL_CONFIRMATION" />

          <Grid item xs={12} md={6}>
            <FormikSelectEmailType<FormValues>
              emailType={EmailTypeEnum.AppointmentConfirm}
              name="CSettingEmailTypeId"
              label={intl.formatMessage({id: "SUBJECT_TEXT"})}
              required
            />
          </Grid>

          <Field component={SelectBuilding} label="ADDRESS" name="BuildingId" buildings={buildings} required />

          <FormikGroups label="DATES" xs={12}>
            <Field name="VisitDate" label="VISITING" component={FormikDateTimePicker} initialFocusedDate={initialDate} required overrideGrid={{ xs: 12, md: 6 }} />

            {selectedCompany.Settings.EnableMaterialOrder && selectedCompany.Settings.EnableMaterialOrderDelivery ?
              (<Field name="DeliveryDate" label="CARDBOARDBOX_DELIVERY" component={FormikDateTimePicker} initialFocusedDate={VisitDatePlus1} overrideGrid={{ xs: 12, md: 6 }} />) : null}

            {selectedCompany.Settings.EnableMaterialOrder && selectedCompany.Settings.EnableMaterialOrderDelivery ?
              (<Field name="CollectBackDate" label="COLLECTBACKDATE" component={FormikDateTimePicker} initialFocusedDate={VisitDatePlus1} overrideGrid={{ xs: 12, md: 6 }} />) : null}

          </FormikGroups>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

          <Grid item xs={12} md={6}>
            <FormikCCEmailList<FormValues> name="CCEmailList" />
          </Grid>

          <Grid item xs={12}>
            <Button onClick={this.sendAndSubmit} disabled={!values.BuildingId || (!values.VisitDate && !values.DeliveryDate)} variant="contained">
              <FormattedMessage id="SEND_EMAIL" />
            </Button>
          </Grid>
        </Form>
      </Grid>
    )
  }

  sendAndSubmit = async () => {
    const {  setSubmitting } = this.props
    try {
      const { lead, submitForm, values, intl, onChangeAndSave, setStatus } = this.props
      const { BuildingId, Comment, CSettingEmailTypeId, VisitDate, DeliveryDate } = values

      setSubmitting(true)

      if (!LeadAPI.isCompleteLead(lead) || !BuildingId || (!VisitDate && !DeliveryDate) || !CSettingEmailTypeId) {
        alert(intl.formatMessage({ id: "VISIT_AND_ADDRESS_REQUIRED" }))
        setSubmitting(false)
        return
      }

      await onChangeAndSave({...lead, VisitDate, DeliveryDate })

      await LeadService.sendAppointmentConfirmationEmail({LeadId: lead.LeadId, ...values, BuildingId, CSettingEmailTypeId})

      submitForm()
    } catch (e) {
      const { setStatus } = this.props
      setSubmitting(false)

      setStatus(e)
    }
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, FormValues>({
        mapPropsToValues: props => {
          const { lead: { VisitDate, DeliveryDate }, selectedCompany } = props

          return {
            BuildingId: null,
            Comment: "",
            VisitDate,
            DeliveryDate,
            CCEmailList: [],
            // Defaultselect
            CSettingEmailTypeId: selectedCompany.Settings.EmailTypes.filter(email => email.EmailType === EmailTypeEnum.AppointmentConfirm && email.AppointmentType == AppointmentTypeEnum.Visit)[0].CSettingEmailTypeId ?? null
          }
        },

        handleSubmit: (values, actions) => {
          try {
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
