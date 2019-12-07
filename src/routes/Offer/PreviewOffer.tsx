import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from '@material-ui/core'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from 'formik';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import PageHeader from '../../components/PageHeader';
import { ILead } from '../../interfaces/ILead';
import OfferService from '../../services/OfferService';
import FormikSimpleSelect from '../../components/FormikFields/FormikSimpleSelect';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

const styles = (theme: Theme) =>
  createStyles({

  })


interface Values {
  selectedOfferId: number | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void,
  lead: ILead,
}

interface State {
  pdfBlobBase64: string
}

class PreviewOffer extends React.Component<Props & FormikProps<Values>, State> {
  state: State = {
    pdfBlobBase64: "about:blank",
  }

  previewPDF = async () => {
    const {values: {selectedOfferId}} = this.props

    if (selectedOfferId) {

      const { lead } = this.props
      const offers = lead.Offers
      const offer = offers.find(offer => offer.OfferId === selectedOfferId)
      if(offer) {
        const pdfFile = offer.Files.find(file => file.FileExtension === "pdf")

        if(pdfFile) {
          const blob = await OfferService.downloadPdf(selectedOfferId, pdfFile.OFileId)
          const string = window.URL.createObjectURL(blob)
          this.setState({ pdfBlobBase64: string })
        }
      }
    }
  }

  public render() {
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, status, resource, lead, intl } = this.props

    const { pdfBlobBase64 } = this.state

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="PREVIEW" />

          <Field
            label="BUILDING_TYPE"
            name="selectedOfferId"
            component={FormikSimpleSelect}
            notTranslated
            options={lead.Offers.sort((offer1, offer2) => new Date(offer2.Created).getTime() - new Date(offer1.Created).getTime())
              .map(offer => ({
                label: offer.FromTemplate + ", " + intl.formatDate(offer.Created, { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }),
                value: offer.OfferId,
              }))}
          />
          <Grid item xs={6}>
            <Button onClick={this.previewPDF} disabled={!values.selectedOfferId} variant="contained" color="primary">
              <FormattedMessage id="DISPLAY_PDF" />
            </Button>
          </Grid>

          {pdfBlobBase64 ? (
            <iframe src={pdfBlobBase64} style={{ width: "100%", height: "calc(100vh - 275px)" }} />
          ) : null}

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
        mapPropsToValues: props => ({ selectedOfferId : null}),

        handleSubmit: async (values, actions) => {
          // console.log(values)
          // // actions.props.
          // await actions.props.onChangeAndSave(values.cleaningService, values.moveOut)
          // actions.setSubmitting(false)
          // actions.props.nextPage()

          actions.setSubmitting(false)
          actions.resetForm()
          actions.props.nextPage()
        },
      })(PreviewOffer)
    )
  )
)
