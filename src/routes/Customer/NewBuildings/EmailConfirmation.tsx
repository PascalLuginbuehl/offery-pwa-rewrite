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

const styles = (theme: Theme) => createStyles({})

interface Values extends ILead {}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (lead: ILead) => void
  lead: ILead
}

class Customer extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, selectedCompany, values } = this.props
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
              <FormattedDate value={values.VisitDate} />
            </Typography>

            <IntlTypography>{EmailBodyContentOutroductionTextKey}</IntlTypography>
          </Grid>

          {/* <ValidatedSelect
            label="VISIT_ADDRESS"
            value={AddressId}
            name="AddressId"
            onChange={this.handleChange}
            required
            notTranslatedLabel={false}
            options={[CleaningBuilding, MoveOutBuilding, MoveInBuilding, StorageInBuilding, DisposalOutBuilding]
              .filter(notEmpty)
              .map(e => e.Address)
              .filter((e): e is IAddress => e.hasOwnProperty("AddressId"))
              .map((e, index) => ({ value: e.AddressId, label: e.Street + ", " + e.PLZ + " " + e.City }))}
          />

          <ValidatedTextField label="COMMENT" value={Comment} name="Comment" onChange={this.handleChange} multiline /> */}

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
        mapPropsToValues: props => props.lead,

        handleSubmit: async (values, actions) => {
          await actions.props.onChangeAndSave(values)

          actions.setSubmitting(false)
          actions.props.nextPage()
        },
      })(Customer)
    )
  )
)
