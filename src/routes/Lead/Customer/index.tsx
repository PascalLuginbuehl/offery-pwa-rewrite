import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography } from "@material-ui/core"
import { Formik, FormikProps, withFormik, Field, ErrorMessage } from "formik"
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl"
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
import { IPutLead, IPostLead } from "../../../interfaces/ILead"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import { isValidPhoneNumber } from "react-phone-number-input"
import FormikPhoneNumber from "../../../components/FormikFields/FormikPhoneNumber"

const styles = (theme: Theme) => createStyles({})

type Values = IPostLead

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (lead: IPostLead) => Promise<void>
  lead: IPostLead
}

class Customer extends React.Component<Props & FormikProps<Values>, {}> {
  validatePhoneNumber = (value: string) => {
    console.log(isValidPhoneNumber)
    if (isValidPhoneNumber(value) !== true) {
      return this.props.intl.formatMessage({id: "PHONE_NUMBER_INVALID"})
    }

    return
  }


  public render() {
    const { values, isSubmitting, status, resource, selectedCompany } = this.props
    const { VisitDate, MoveDate } = values

    const initialDate = new Date()
    initialDate.setHours(8)
    initialDate.setMinutes(0)
    initialDate.setSeconds(0)

    const VisitDatePlus7: Date = VisitDate ? new Date(VisitDate.toString()) : new Date(initialDate.toString())

    VisitDatePlus7.setDate(VisitDatePlus7.getDate() + 7)

    const VisitDatePlus1 = VisitDate ? new Date(VisitDate.toString()) : new Date(initialDate)
    VisitDatePlus1.setDate(VisitDatePlus1.getDate() + 7)

    const MoveDatePlus1 = MoveDate ? new Date(MoveDate.toString()) : new Date(VisitDatePlus7.toString())
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
                { label: "FRENCH", value: "FR" },
                { label: "ITALIAN", value: "IT" },
                { label: "ENGLISH", value: "EN" },
              ]}
              overrideGrid={{ xs: 6, md: undefined }}
            />

            <Field label="COMPANY" name="Customer.CompanyName" component={FormikTextField} overrideGrid={{ xs: 6, md: undefined }} />

            <Field label="EMAIL" name="Customer.Email" type="email" component={FormikTextField} overrideGrid={{ xs: 6, md: undefined }} required />
            <Field label="PHONE" name="Customer.TelephoneNumber" component={FormikPhoneNumber} overrideGrid={{ xs: 6, md: undefined }} required validate={this.validatePhoneNumber}
              defaultCountry="ch"
              preferredCountries={["ch"]}
              onlyCountries= {["ch", "de", "it", "fr", "at"]}/>
          </FormikGroups>

          <FormikGroups label="DATES" xs={12}>
            <Field name="VisitDate" label="VISITING" component={FormikDateTimePicker} initialFocusedDate={initialDate} />
            <Field name="MoveDate" label="MOVING" component={FormikDateTimePicker} initialFocusedDate={VisitDatePlus7} />
            <Field name="PackServiceDate" label="PACKINGSERVICE" component={FormikDateTimePicker} initialFocusedDate={MoveDate ? MoveDate : VisitDatePlus7} />
            <Field name="DeliveryDate" label="CARDBOARDBOX_DELIVERY" component={FormikDateTimePicker} initialFocusedDate={VisitDatePlus1} />
            <Field name="StorageDate" label="STORAGE" component={FormikDateTimePicker} initialFocusedDate={MoveDate ? MoveDate : VisitDatePlus7} />
            <Field name="DisposalDate" label="DISPOSAL" component={FormikDateTimePicker} initialFocusedDate={MoveDate ? MoveDate : VisitDatePlus7} />
            <Field name="CleaningDate" label="CLEANING" component={FormikDateTimePicker} initialFocusedDate={MoveDatePlus1} />
            <Field name="HandOverDate" label="HANDIN" component={FormikDateTimePicker} initialFocusedDate={MoveDatePlus1} />
          </FormikGroups>

          <FormikGroups label="BUILDINGS" xs={12}>
            <Field name="HasMoveOutBuilding" label="MOVE_OUT_BUILDING" component={FormikButtonCheckbox} />
            <Field name="HasMoveInBuilding" label="MOVE_IN_BUILDING" component={FormikButtonCheckbox} />
            <Field name="HasStorageInBuilding" label="STORAGE_BUILDING" component={FormikButtonCheckbox} />
            <Field name="HasDisposalOutBuilding" label="DISPOSAL_BUILDING" component={FormikButtonCheckbox} />
            <Field name="HasCleaningBuilding" label="CLEANING_BUILDING" component={FormikButtonCheckbox} />
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
