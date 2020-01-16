import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography, Button } from "@material-ui/core"
import { Formik, FormikProps, withFormik, Field } from "formik"
import { injectIntl, InjectedIntlProps, FormattedDate, FormattedMessage } from "react-intl"
import MoveOut from "../../../components/FormikFields/Bundled/MoveOut"
import { IPostMoveInBuilding } from "../../../interfaces/IBuilding"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import Submit from "../../../components/FormikFields/Submit"
import PageHeader from "../../../components/PageHeader"
import MoveIn from "../../../components/FormikFields/Bundled/MoveIn"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"
import FormikTextField from "../../../components/FormikFields/FormikTextField"

import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"
import { IPutLead, ILead } from "../../../interfaces/ILead"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import IntlTypography from "../../../components/Intl/IntlTypography"
import { IBuildingCopy } from "../../../components/FormikFields/Bundled/BuildingCopy"
import { IAddress } from "../../../interfaces/IAddress"
import LeadAPI from "../LeadAPI"
import LeadService from "../../../services/LeadService"
import SelectAddress from "../../../components/FormikFields/Bundled/SelectAddress"
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
  buildingOptions: IBuildingCopy
}

class Customer extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { selectedCompany, values, lead } = this.props
    const { VisitConfirmEmailSubjectTextKey, VisitConfirmEmailBodyContentOutroTextKey, VisitConfirmEmailBodyContentIntroTextKey } = selectedCompany.Settings
    console.log(this.tempBuildingOptions)
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

          <Field component={SelectAddress} label="VISIT_ADDRESS" name="AddressId" buildings={this.tempBuildingOptions} onClick={this.reloadLead}/>
          {/* <SelectAddress label="" name="AddressId" buildings={buildingOptions} /> */}

          <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

          <Grid item xs={12}>
            <Button onClick={this.sendAndSubmit} disabled={!values.AddressId} variant="contained">
              <FormattedMessage id="SEND_EMAIL" />
            </Button>
          </Grid>
        </Form>
      </Grid>
    )
  }

  tempBuildingOptions = this.props.buildingOptions

  reloadLead = async () => {
    const { lead } = this.props
    const leadContainer = await LeadAPI.FetchFromOnline(lead.LeadId)
    this.tempBuildingOptions = {
      moveOutBuilding: leadContainer.moveOut,
      moveInBuilding: leadContainer.moveIn,
      cleaningBuilding: leadContainer.cleaning,
      storageBuilding: leadContainer.storage,
      disposalBuilding: leadContainer.disposal,
    }
    this.forceUpdate()
  }

  sendAndSubmit = async () => {
    const { lead, submitForm, values, setSubmitting } = this.props
    const { AddressId, Comment, VisitDate } = values

    setSubmitting(true)

    if (!LeadAPI.isCompleteLead(lead) || !AddressId || !VisitDate) {
      throw new Error("Not defined")
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
