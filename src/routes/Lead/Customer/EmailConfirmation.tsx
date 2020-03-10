import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography, Button } from "@material-ui/core"
import { Formik, FormikProps, withFormik, Field } from "formik"
import { injectIntl, InjectedIntlProps, FormattedDate, FormattedMessage } from "react-intl"
import { IBuilding } from "../../../interfaces/IBuilding"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import PageHeader from "../../../components/PageHeader"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"
import { IPutLead, ILead } from "../../../interfaces/ILead"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import IntlTypography from "../../../components/Intl/IntlTypography"
import { IAddress } from "../../../interfaces/IAddress"
import LeadAPI from "../LeadAPI"
import LeadService from "../../../services/LeadService"
import SelectBuilding from "../../../components/FormikFields/Bundled/SelectBuilding"
import HttpErrorHandler from "../../../components/HttpErrorHandler"

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

const styles = (theme: Theme) => createStyles({})

interface Values {
  AddressId: number | null
  Comment: string
  VisitDate: Date | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
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

            <Field name="VisitDate" label="VISITING" component={FormikDateTimePicker} required />

            <Typography>
              <FormattedMessage id={VisitConfirmEmailBodyContentOutroTextKey} values={{ br: <br /> }} />
            </Typography>
          </Grid>

          <Field component={SelectBuilding} label="VISIT_ADDRESS" name="AddressId" buildings={buildings} />
          {/* <SelectAddress label="" name="AddressId" buildings={buildingOptions} /> */}

          <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

          <Grid item xs={12}>
            <Button onClick={this.sendAndSubmit} disabled={!values.AddressId || !values.VisitDate} variant="contained">
              <FormattedMessage id="SEND_EMAIL" />
            </Button>
          </Grid>
        </Form>
      </Grid>
    )
  }

  sendAndSubmit = async () => {
    const { lead, submitForm, values, setSubmitting, intl } = this.props
    const { AddressId, Comment, VisitDate } = values

    setSubmitting(true)

    if (!LeadAPI.isCompleteLead(lead) || !AddressId || !VisitDate) {
      alert(intl.formatMessage({ id: "VISIT_AND_ADDRESS_REQUIRED" }))
      setSubmitting(false)
      return
    }
    await LeadService.sendVisitConfirmation({ LeadId: lead.LeadId, Comment: Comment, AddressId: AddressId, VisitDate: VisitDate })

    submitForm()
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => {
          const { lead: { FromAddress, VisitDate } } = props
          return { AddressId: FromAddress ? FromAddress.AddressId : null, Comment: "", VisitDate }
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
