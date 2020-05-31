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
import Dropzone from "react-dropzone" //https://github.com/react-dropzone/react-dropzone
import IntlTypography from "../../../components/Intl/IntlTypography"

const styles = (theme: Theme) => createStyles({
  dropzone: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out"
  }
})

interface State {
  isUploading: boolean
}

interface Values {
  templateCategoryId: number | null
  billBuildingId: number | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  nextPage: (stringAddition?: string) => void
  // onSaveAndNextPage: (templateCategoryId: number, type: number, outAddressId: number, inAddressId: number) => Promise<any>
  buildings: IBuilding[]
  lead: ILead
  offline: boolean
  onChange: (value: any, name: keyof ILeadContainer) => void
}

class GenerateOffer extends React.Component<Props & FormikProps<Values>, State> {
  state: State = {
    isUploading: false
  }

  async uploadOffer(file: any) {
    try {
      const { lead } = this.props
      this.setState({isUploading: true})
      const offer = await OfferService.uploadOffer(lead.LeadId, file)

      // Update Lead
      this.props.onChange({ ...lead, Offers: [...lead.Offers, offer] }, "Lead")
      this.props.nextPage("/" + offer.OfferId)
    }
    catch (e) {
      this.setState({isUploading: false})
      if (e.json && e.json.Message) {
        alert(e.json.Message)
      }
    }
  }

  public render() {
    const {
      values: { templateCategoryId, billBuildingId },
      isSubmitting,
      status,
      resource,
      selectedCompany,
      buildings,
      values,
      classes
    } = this.props
    const { isUploading } = this.state


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

          <Field name="billBuildingId" label="BILL_BUILDING" buildings={buildings} component={SelectBuilding} />

          {
            isSubmitting || isUploading ?
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

        <Dropzone onDrop={acceptedFiles => this.uploadOffer(acceptedFiles[0])}>
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps({className: classes.dropzone})}>
                <input {...getInputProps({
                  accept: ".docx",
                  multiple: false
                })} />
                <IntlTypography color="inherit">DROPZONE_FIELD_DRAGORCLICK</IntlTypography>
              </div>
            </section>
          )}
        </Dropzone>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => {
        // Default values asignment
        const { selectedCompany: { OfferTemplateCategories }, lead: { BillBuildingId } } = props

        const templateCategoryId = OfferTemplateCategories.length === 1 ? OfferTemplateCategories[0].OfferTemplateCategoryId : null
        const billBuildingId =  BillBuildingId

        return { templateCategoryId, billBuildingId }
      },

      handleSubmit: async (values, actions) => {
        try {
          const { templateCategoryId, billBuildingId } = values
          if (templateCategoryId && billBuildingId) {
            const offer = await OfferService.getOffer(actions.props.lead.LeadId, templateCategoryId, billBuildingId)

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
