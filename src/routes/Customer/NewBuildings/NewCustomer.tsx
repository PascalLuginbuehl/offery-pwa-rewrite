import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography } from "@material-ui/core"
import { Formik, FormikProps, withFormik, Field } from "formik"
import { injectIntl, InjectedIntlProps } from "react-intl"
import MoveOut from "../../../components/FormikFields/Bundled/MoveOut"
import { IPostMoveInBuilding } from "../../../interfaces/IBuilding"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import Submit from "../../../components/FormikFields/Submit"
import PageHeader from "../../../components/PageHeader"
import MoveIn from "../../../components/FormikFields/Bundled/MoveIn"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups";
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect";
import FormikTextField from "../../../components/FormikFields/FormikTextField";
import DatePicker from "../../../components/FormikFields/FormikDatePicker"
import FormikButtonCheckbox from "../../../components/FormikFields/FormikButtonCheckbox";
import { IPostLead } from "../../../interfaces/ILead";
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker";

const styles = (theme: Theme) => createStyles({})

interface Values extends IPostLead {

}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  onChangeAndSave: (lead: IPostLead) => void
  lead: IPostLead
}

class Customer extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, selectedCompany } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="CUSTOMER" />

          <FormikGroups label="CUSTOMER">
            <Field label="LASTNAME" name="Customer.Lastname" component={FormikTextField} overrideGrid={{ xs: 6, md: undefined }} />

            <Field label="FIRSTNAME" name="Customer.Firstname" component={FormikTextField} overrideGrid={{ xs: 6, md: undefined }} />

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

            <Field label="EMAIL" name="Customer.Email" component={FormikTextField} overrideGrid={{ xs: 6, md: undefined }} />
            <Field label="PHONE" name="Customer.TelephoneNumber" component={FormikTextField} overrideGrid={{ xs: 6, md: undefined }} />
          </FormikGroups>

          <FormikGroups label="DATES">
            <Field name="VisitDate" label="VISITING" component={FormikDateTimePicker} />
            <Field name="MoveDate" label="MOVING" component={FormikDateTimePicker} />
            <Field name="PackServiceDate" label="PACKINGSERVICE" component={FormikDateTimePicker} />
            <Field name="DeliveryDate" label="CARDBOARDBOX_DELIVERY" component={FormikDateTimePicker} />
            <Field name="StorageDate" label="STORAGE" component={FormikDateTimePicker} />
            <Field name="DisposalDate" label="DISPOSAL" component={FormikDateTimePicker} />
            <Field name="CleaningDate" label="CLEANING" component={FormikDateTimePicker} />
            <Field name="HandOverDate" label="HANDIN" component={FormikDateTimePicker} />
          </FormikGroups>

          <FormikGroups label="BUILDINGS">
            <Field name="HasMoveOutBuilding" label="MOVE_OUT_BUILDING" component={FormikButtonCheckbox} />
            <Field name="HasMoveInBuilding" label="MOVE_IN_BUILDING" component={FormikButtonCheckbox} />
            <Field name="HasStorageInBuilding" label="STORAGE_BUILDING" component={FormikButtonCheckbox} />
            <Field name="HasCleaningBuilding" label="CLEANING_BUILDING" component={FormikButtonCheckbox} />
            <Field name="HasDisposalOutBuilding" label="DISPOSAL_BUILDING" component={FormikButtonCheckbox} />
          </FormikGroups>

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
        mapPropsToValues: props => (props.lead),

        handleSubmit: async (values, actions) => {
          await actions.props.onChangeAndSave(values)

          actions.setSubmitting(false)
          actions.props.nextPage()
        },
      })(Customer)
    )
  )
)
