import { createStyles,   Theme, WithStyles, withStyles, Grid } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import {  FormikProps, Field,   withFormik } from "formik"

import Form from "../../../components/FormikFields/Form"

import PageHeader from "../../../components/PageHeader"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"

import SelectBuilding from "../../../components/FormikFields/Bundled/SelectBuilding"
import OfferService from "../../../services/OfferService"
import { ILead } from "../../../interfaces/ILead"
import { ILeadContainer } from "../LeadAPI"

import animation from "../../../components/lottie/12818-file-recover.json"
import Lottie from "lottie-react-web"
import { IBuilding } from "../../../interfaces/IBuilding"

const styles = (theme: Theme) => createStyles({})

interface Values {
  templateCategoryId: number | null
  outAddressId: number | null
  inAddressId: number | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  nextPage: (stringAddition?: string) => void
  // onSaveAndNextPage: (templateCategoryId: number, type: number, outAddressId: number, inAddressId: number) => Promise<any>
  buildings: IBuilding[]
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
      buildings,
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

          <Field component={SelectBuilding} label="MOVE_OUT_ADDRESS" name="outAddressId" buildings={buildings} />

          <Field component={SelectBuilding} label="MOVE_IN_ADDRESS" name="inAddressId" buildings={buildings} />


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
