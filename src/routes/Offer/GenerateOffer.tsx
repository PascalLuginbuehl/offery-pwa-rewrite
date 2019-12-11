import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from '@material-ui/core'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from 'formik';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import PageHeader from '../../components/PageHeader';
import FormikSimpleSelect from '../../components/FormikFields/FormikSimpleSelect';
import { nullLiteral } from '@babel/types';
import SelectAddress from '../../components/FormikFields/Bundled/SelectAddress';
import { IBuildingCopy } from '../../components/FormikFields/Bundled/BuildingCopy';
import OfferService from '../../services/OfferService';
import { ILead } from '../../interfaces/ILead';
import { ILeadContainer } from '../LeadAPI';

const styles = (theme: Theme) =>
  createStyles({

  })


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
  onChange: (value: any, name: keyof ILeadContainer) => void
}

class GenerateOffer extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { values: {templateCategoryId, inAddressId, outAddressId}, isSubmitting, status, resource, selectedCompany, buildingOptions } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="GENERATE_OFFER" />

          <Field
            label="TEMPLATE_CATEGORY"
            name="templateCategoryId"
            component={FormikSimpleSelect}
            // Fixme, there is no 2 possible
            options={selectedCompany.OfferTemplateCategories.map(e => ({ label: e.NameTextKey, value: 2 }))}
          />

          <Field component={SelectAddress} label="MOVE_OUT_ADDRESS" name="outAddressId" buildings={buildingOptions} />

          <Field component={SelectAddress} label="MOVE_IN_ADDRESS" name="inAddressId" buildings={buildingOptions} />

          {status && status.json && <div>{status.json.Message}</div>}

          <Submit isSubmitting={isSubmitting || !outAddressId || !inAddressId || !templateCategoryId}></Submit>
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      mapPropsToValues: props => ({ templateCategoryId: null, outAddressId: null, inAddressId: null }),

      handleSubmit: async (values, actions) => {
        try {
          const {templateCategoryId, inAddressId, outAddressId} = values
          if ((templateCategoryId && inAddressId && outAddressId)) {
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

        } catch(e) {
          actions.setStatus(e)
        }
      },
    })(GenerateOffer)
  )
)
