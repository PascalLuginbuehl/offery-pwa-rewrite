import { createStyles,   Theme, WithStyles, withStyles, Grid, Button, Snackbar, IconButton } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import {  FormikProps, Field,   withFormik } from "formik"

import Form from "../../../components/FormikFields/Form"

import PageHeader from "../../../components/PageHeader"
import { ILead } from "../../../interfaces/ILead"
import OfferService from "../../../services/OfferService"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"
import { injectIntl, WrappedComponentProps, FormattedMessage } from "react-intl"
// import { Document, Page } from 'react-pdf'
import { Document, Page } from "react-pdf/dist/entry.webpack"
import { PDFDocumentProxy } from "pdfjs-dist"
import { RouteComponentProps } from "react-router"
import { IOffer, IOFile } from "../../../interfaces/IOffer"
import DateHelper from "../../../helpers/DateHelper"
import FormikSelectOffer from "../../../components/Formik/CustomComponents/FormikSelectOffer"
import { ReactComponent as PDFIcon } from "./pdficon.svg"
import { ReactComponent as Word } from "./microsoft-word.svg"
import VisibilityIcon from "@material-ui/icons/Visibility"

const styles = (theme: Theme) => createStyles({
  snackbar: {
    [theme.breakpoints.down("xs")]: {
      bottom: 90,
    },
  }
})

interface Values {
  selectedOfferId: number | null
}

interface Props extends RouteComponentProps<{ offerId?: string }>, WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  nextPage: (stringAddition?: string) => void
  offline: boolean
  lead: ILead
}

interface State {
  pdfBlobBase64: string | null
  pages: number | null
  fileNotFoundSnackbarOpen: boolean
}

class PreviewOffer extends React.Component<Props & FormikProps<Values>, State> {
  state: State = {
    pdfBlobBase64: null,
    pages: null,
    fileNotFoundSnackbarOpen: false
  }

  getOfferBlob = async (offer: IOffer, file: IOFile) => {
    const blob = await OfferService.downloadFile(offer.OfferId, file.OFileId)
    return blob
  }

  getOffer = (): IOffer | undefined => {
    const {
      values: { selectedOfferId },
    } = this.props

    if (selectedOfferId) {
      const { lead } = this.props
      const offers = lead.Offers
      const offer = offers.find(offer => offer.OfferId === selectedOfferId)
      if (offer) {
        return offer
      }
    }

    this.setState({fileNotFoundSnackbarOpen: true})
    return undefined
  }

  getFile = (offer: IOffer| undefined, extension: "pdf" | "docx") => {
    const pdfFile = offer ? offer.Files.find(file => file.FileExtension === extension) : null

    if (pdfFile) {
      return pdfFile
    }
    this.setState({fileNotFoundSnackbarOpen: true})
    return undefined
  }

  previewPDF = async () => {
    const offer = this.getOffer()
    if (offer != undefined) {
      const file = this.getFile(offer, "pdf")
      if (file != undefined) {
        const blob = await this.getOfferBlob(offer, file)
        const string = window.URL.createObjectURL(blob)
        this.setState({ pdfBlobBase64: string })
      }
    }
  }

  downloadWord = async () => {
    const offer = this.getOffer()
    const file = this.getFile(offer, "docx")
    if (file != undefined && offer != undefined) {
      const blob = await this.getOfferBlob(offer, file)
      const string = window.URL.createObjectURL(blob)
      const a = document.createElement("a")

      a.href = string
      a.download = file.DocName
      a.click()
    }
    else {
      this.setState({fileNotFoundSnackbarOpen: true})
    }
  }

  onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
    this.setState({ pages: numPages })
  }

  closeSnackbar = () => {
    this.setState({fileNotFoundSnackbarOpen: false})
  }

  public render() {
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, status, resource, lead, intl, classes } = this.props

    const { pdfBlobBase64, pages, fileNotFoundSnackbarOpen } = this.state

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="PREVIEW" />

          <Grid item xs={12} md={6}>
            <FormikSelectOffer
              label={intl.formatMessage({ id: "OFFER" })}
              name="selectedOfferId"
              required
              offers={lead.Offers}
            />
          </Grid>

          <Grid item xs={6}>
            <IconButton>
              <PDFIcon height="24" fill="black" />
            </IconButton>
            <IconButton>
              <Word height="24" fill="black" />
            </IconButton>
            <IconButton>
              <VisibilityIcon />
            </IconButton>

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
        </Form>
        <Snackbar
          open={fileNotFoundSnackbarOpen}
          onClose={this.closeSnackbar}
          autoHideDuration={4000}
          message={<FormattedMessage id="FILE_NOT_FOUND" />}
          className={classes.snackbar}
        />
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

              if (offer) {
                return { selectedOfferId }
              }
            }
          }
          return { selectedOfferId: null }
        },

        handleSubmit: (values, actions) => {
          try {
            actions.setSubmitting(false)
            actions.resetForm()
            if (values.selectedOfferId) {
              actions.props.nextPage("/" + values.selectedOfferId)
            } else {
              actions.props.nextPage()
            }
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(PreviewOffer)
    )
  )
)
