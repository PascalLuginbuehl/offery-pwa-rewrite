import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, withWidth } from '@material-ui/core'
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
// import { Document, Page } from 'react-pdf'
import { Document, Page } from "react-pdf/dist/entry.webpack"
import { PDFDocumentProxy } from 'pdfjs-dist';
import { RouteComponentProps } from 'react-router';
import { IOffer, IOFile } from '../../interfaces/IOffer';
import HttpErrorHandler from '../../components/HttpErrorHandler';
const styles = (theme: Theme) =>
  createStyles({

  })


interface Values {
  selectedOfferId: number | null
}

interface Props extends RouteComponentProps<{ offerId?: string }>, WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: (stringAddition?: string) => void,
  lead: ILead,
}

interface State {
  pdfBlobBase64: string | null
  pages: number | null
}

class PreviewOffer extends React.Component<Props & FormikProps<Values>, State> {
  state: State = {
    pdfBlobBase64: null,
    pages: null,
  }

  componentDidMount() {

  }

  getOfferBlob = async (offer: IOffer, file: IOFile) => {
    const blob = await OfferService.downloadFile(offer.OfferId, file.OFileId)
    return blob
  }

  getOffer = (): IOffer => {
    const { values: { selectedOfferId } } = this.props

    if (selectedOfferId) {

      const { lead } = this.props
      const offers = lead.Offers
      const offer = offers.find(offer => offer.OfferId === selectedOfferId)
      if (offer) {
        return offer
      }
    }

    throw new Error("Offer not found")
  }

  getFile = (offer: IOffer, extension: "pdf" | "docx") => {
    const pdfFile = offer.Files.find(file => file.FileExtension === extension)

    if (pdfFile) {
      return pdfFile
    }
    throw new Error("Offer not found")
  }

  previewPDF = async () => {
    const offer = this.getOffer()
    const file = this.getFile(offer, "pdf")
    const blob = await this.getOfferBlob(offer, file)

    const string = window.URL.createObjectURL(blob)
    this.setState({ pdfBlobBase64: string })

  }

  downloadWord = async () => {
    const offer = this.getOffer()
    const file = this.getFile(offer, "docx")
    const blob = await this.getOfferBlob(offer, file)


    const string = window.URL.createObjectURL(blob)

    var a = document.createElement("a");

    a.href = string
    a.download = file.DocName
    a.click()
  }

  onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
    this.setState({ pages: numPages });
  }

  public render() {
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, status, resource, lead, intl } = this.props

    const { pdfBlobBase64, pages } = this.state

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="PREVIEW" />
          <Field
            label="OFFER"
            name="selectedOfferId"
            component={FormikSimpleSelect}
            notTranslated
            options={lead.Offers.sort((offer1, offer2) => new Date(offer2.Created).getTime() - new Date(offer1.Created).getTime()).map(offer => ({
              label: offer.FromTemplate + ", " + intl.formatDate(offer.Created, { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }),
              value: offer.OfferId,
            }))}
          />
          <Grid item xs={6}>
            <Button onClick={this.previewPDF} disabled={!values.selectedOfferId} variant="contained" color="primary">
              <FormattedMessage id="DISPLAY_PDF" />
            </Button>

            &nbsp;

            <Button onClick={this.downloadWord} disabled={!values.selectedOfferId} variant="contained">
              <FormattedMessage id="DOWNLOAD_WORD" />
            </Button>
          </Grid>

          <Grid item xs={12}>
            {pdfBlobBase64 ? (
              <Document file={pdfBlobBase64} onLoadSuccess={this.onDocumentLoadSuccess}>
                {/* renderTextLayer 19 pixels to */}
                {pages ? new Array(pages).fill("").map((e, i) => <Page key={i} pageIndex={i} renderTextLayer={false} width={Math.min(1080, window.innerWidth) - 50} />) : null}
              </Document>
            ) : null}
          </Grid>

          {/* <iframe style={{ width: "100%", height: "calc(100vh - 275px)" }} /> */}

          <HttpErrorHandler status={status} data={values} />

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
        mapPropsToValues: props => {
          if (props.match.params.offerId) {
            const selectedOfferId = parseInt(props.match.params.offerId)
            if (!isNaN(selectedOfferId)) {
              const offer = props.lead.Offers.find(offer => offer.OfferId === selectedOfferId)

              if(offer) {
                return { selectedOfferId}
              }
            }
          }
          return { selectedOfferId : null}
        },

        handleSubmit: async (values, actions) => {
          try {
            actions.setSubmitting(false)
            actions.resetForm()
            if(values.selectedOfferId) {
              actions.props.nextPage("/" + values.selectedOfferId)
            } else {
              actions.props.nextPage()
            }
          } catch(e) {
            actions.setStatus(e)
          }
        },
      })(PreviewOffer)
    )
  )
)
