import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography } from "@material-ui/core"
import { Formik, FormikProps, withFormik, Field } from "formik"
import { injectIntl, InjectedIntlProps, FormattedDate } from "react-intl"
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
import DatePicker from "../../../components/FormikFields/FormikDatePicker"
import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox"
import { IPostLead, ILead } from "../../../interfaces/ILead"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import IntlTypography from "../../../components/Intl/IntlTypography";
import { IBuildingCopy } from "../../../components/FormikFields/Bundled/BuildingCopy";
import { IAddress } from "../../../interfaces/IAddress";
import LeadAPI from "../../LeadAPI";
import LeadService from "../../../services/LeadService";

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

const styles = (theme: Theme) => createStyles({})

interface Values {
  AddressId: number | null
  Comment: string
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  lead: ILead
  // onChangeAndSave: (lead: ILead) => void
  buildingOptions: IBuildingCopy
}

class Customer extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const {
      isSubmitting,
      status,
      resource,
      selectedCompany,
      values,
      lead,
      buildingOptions: { moveOutBuilding, moveInBuilding, storageBuilding, disposalBuilding, cleaningBuilding },
    } = this.props
    const { EmailBodyContentIntroductionTextKey, EmailBodyContentOutroductionTextKey, EmailSubjectTextKey } = selectedCompany.Settings.VisitConfirmationSetting

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="EMAIL_CONFIRMATION" />

          <Grid item xs={12}>
            <IntlTypography>{EmailBodyContentIntroductionTextKey}</IntlTypography>
            <IntlTypography>{EmailSubjectTextKey}</IntlTypography>

            <IntlTypography>VISITING_DATE</IntlTypography>
            <Typography>
              <FormattedDate value={lead.VisitDate} />
            </Typography>

            <IntlTypography>{EmailBodyContentOutroductionTextKey}</IntlTypography>
          </Grid>

          <Field
            label="VISIT_ADDRESS"
            name="AddressId"
            component={FormikSimpleSelect}
            notTranslated
            required
            options={[moveOutBuilding, moveInBuilding, storageBuilding, disposalBuilding, cleaningBuilding]
              .filter(notEmpty)
              .map(e => e.Address)
              .filter((e): e is IAddress => e.hasOwnProperty("AddressId"))
              .map((e, index) => ({ value: e.AddressId, label: e.Street + ", " + e.PLZ + " " + e.City }))}
          />

          <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

          {status && status.msg && <div>{status.msg}</div>}

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({AddressId: null, Comment: ""}),

        handleSubmit: async (values, actions) => {
          // await actions.props.onChangeAndSave(values)

          const { AddressId, Comment } = values
          const { lead } = actions.props

          if (LeadAPI.isCompleteLead(lead) && AddressId) {
            await LeadService.sendVisitConfirmation({ LeadId: lead.LeadId, Comment: Comment, AddressId: AddressId })
          }

          actions.setSubmitting(false)
          actions.props.nextPage()
        },
      })(Customer)
    )
  )
)
