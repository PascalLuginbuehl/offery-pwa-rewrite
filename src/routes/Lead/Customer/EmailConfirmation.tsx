import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid,   Typography, Button } from "@material-ui/core"
import {  FormikProps, withFormik, Field } from "formik"
import { injectIntl, WrappedComponentProps, FormattedDate, FormattedMessage } from "react-intl"
import { IBuilding } from "../../../interfaces/IBuilding"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import PageHeader from "../../../components/PageHeader"
import FormikTextField from "../../../components/FormikFields/FormikTextField"


import {  ILead } from "../../../interfaces/ILead"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import IntlTypography from "../../../components/Intl/IntlTypography"

import LeadAPI from "../LeadAPI"
import LeadService from "../../../services/LeadService"
import SelectBuilding from "../../../components/FormikFields/Bundled/SelectBuilding"


function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

const styles = (theme: Theme) => createStyles({})

interface Values {
  BuildingId: number | null
  Comment: string
  VisitDate: Date | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  nextPage: () => void
  lead: ILead
  offline: boolean
  // onChangeAndSave: (lead: ILead) => void
  buildings: IBuilding[]
}

class Customer extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { selectedCompany, values, lead, buildings } = this.props
    const { VisitConfirmEmailSubjectTextKey, VisitConfirmEmailBodyContentOutroTextKey, VisitConfirmEmailBodyContentIntroTextKey } = selectedCompany.Settings

    const initialDate = new Date()
    initialDate.setHours(selectedCompany.Settings.DefaultServiceTimeStart || 8)
    initialDate.setMinutes(0)
    initialDate.setSeconds(0)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="EMAIL_CONFIRMATION" />
          <Grid item xs={12}>
            <Typography>
              <b><FormattedMessage id={VisitConfirmEmailSubjectTextKey} values={{ br: <br /> }} /></b>
            </Typography>

            <Typography>
              <FormattedMessage id={VisitConfirmEmailBodyContentIntroTextKey} values={{ br: <br /> }} />
            </Typography>

            {
              lead.VisitDate ? (
                <>
                  <IntlTypography>VISITING_DATE</IntlTypography>
                  <Typography>
                    <FormattedDate value={lead.VisitDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" />
                  </Typography>
                </>
              )
                : null
            }

            <Field name="VisitDate" label="VISITING" component={FormikDateTimePicker} initialFocusedDate={initialDate} required />

            <Typography>
              <FormattedMessage id={VisitConfirmEmailBodyContentOutroTextKey} values={{ br: <br /> }} />
            </Typography>
          </Grid>

          <Field component={SelectBuilding} label="VISIT_ADDRESS" name="BuildingId" buildings={buildings} />
          {/* <SelectAddress label="" name="BuildingId" buildings={buildingOptions} /> */}

          <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

          <Grid item xs={12}>
            <Button onClick={this.sendAndSubmit} disabled={!values.BuildingId || !values.VisitDate} variant="contained">
              <FormattedMessage id="SEND_EMAIL" />
            </Button>
          </Grid>
        </Form>
      </Grid>
    )
  }

  sendAndSubmit = async () => {
    const { lead, submitForm, values, setSubmitting, intl } = this.props
    const { BuildingId, Comment, VisitDate } = values

    setSubmitting(true)

    if (!LeadAPI.isCompleteLead(lead) || !BuildingId || !VisitDate) {
      alert(intl.formatMessage({ id: "VISIT_AND_ADDRESS_REQUIRED" }))
      setSubmitting(false)
      return
    }
    await LeadService.sendVisitConfirmation({ LeadId: lead.LeadId, Comment: Comment, BuildingId: BuildingId, VisitDate: VisitDate })

    submitForm()
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => {
          const { lead: { VisitDate } } = props
          return { BuildingId: null, Comment: "", VisitDate }
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
