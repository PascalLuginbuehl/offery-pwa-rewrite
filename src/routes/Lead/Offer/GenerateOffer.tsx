import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from "formik"
import * as Yup from "yup"
import Form from "../../../components/FormikFields/Form"
import Submit from "../../../components/FormikFields/Submit"
import PageHeader from "../../../components/PageHeader"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"
import { nullLiteral } from "@babel/types"
import SelectAddress from "../../../components/FormikFields/Bundled/SelectAddress"
import { IBuildingCopy } from "../../../components/FormikFields/Bundled/BuildingCopy"
import OfferService from "../../../services/OfferService"
import { ILead } from "../../../interfaces/ILead"
import { ILeadContainer } from "../LeadAPI"
import HttpErrorHandler from "../../../components/HttpErrorHandler"
import animation from "../../../components/lottie/12818-file-recover.json"
import Lottie from "lottie-react-web"

const styles = (theme: Theme) => createStyles({})

interface Values {
  templateCategoryId: number | null
  outAddressId: number | null
  inAddressId: number | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  nextPage: (stringAddition?: string) => void
  // onSaveAndNextPage: (templateCategoryId: number, type: number, outAddressId: number, inAddressId: number) => Promise<any>
  buildingOptions: IBuildingCopy
  lead: ILead
  offline: boolean
  onChange: (value: any, name: keyof ILeadContainer) => void
}

class GenerateOffer extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const {
      values: { templateCategoryId, inAddressId, outAddressId },
      isSubmitting,
      status,
      resource,
      selectedCompany,
      buildingOptions,
      values,
    } = this.props

    console.log(templateCategoryId)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="GENERATE_OFFER" />

          <Field
            label="TEMPLATE_CATEGORY"
            name="templateCategoryId"
            component={FormikSimpleSelect}
            // Fixme, there is no 2 possible
            options={selectedCompany.OfferTemplateCategories.map(e => ({ label: e.NameTextKey, value: e.OfferTemplateCategoryId }))}
          />

          <Field component={SelectAddress} label="MOVE_OUT_ADDRESS" name="outAddressId" buildings={buildingOptions} />

          <Field component={SelectAddress} label="MOVE_IN_ADDRESS" name="inAddressId" buildings={buildingOptions} />


          {
            isSubmitting ?
              <Grid item xs={12}>
                <Lottie
                  height={256}
                  width={256}
                  options={{
                    animationData: animation,
                    // loop: false,
                  }}
                />
              </Grid>
              :
              null
          }

        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => {
        // Default values asignment
        const { lead: { FromAddress, ToAddress }, selectedCompany: { OfferTemplateCategories } } = props

        const outAddressId = FromAddress ? FromAddress.AddressId : null
        const inAddressId = ToAddress ? ToAddress.AddressId : null

        const templateCategoryId = OfferTemplateCategories.length === 1 ? OfferTemplateCategories[0].OfferTemplateCategoryId : null

        return { templateCategoryId, outAddressId, inAddressId }
      },

      handleSubmit: async (values, actions) => {
        try {
          const { templateCategoryId, inAddressId, outAddressId } = values
          if (templateCategoryId && inAddressId && outAddressId) {
            const offer = await OfferService.getOffer(actions.props.lead.LeadId, templateCategoryId, outAddressId, inAddressId)

            // Update Lead
            const { props } = actions
            props.onChange({ ...props.lead, Offers: [...props.lead.Offers, offer] }, "Lead")

            actions.setSubmitting(false)
            actions.resetForm()
            actions.props.nextPage("/" + offer.OfferId)
          } else {
            actions.setSubmitting(false)
            actions.resetForm()
            actions.props.nextPage()
          }
        } catch (e) {
          actions.setStatus(e)
        }
      },
    })(GenerateOffer)
  )
)
