import * as React from "react"
import { Theme,  Grid, Typography, Button,  ButtonGroup,  createStyles, makeStyles, useMediaQuery } from "@material-ui/core"
import { Formik, Field, Form } from "formik"
import { FormattedMessage, useIntl } from "react-intl"


import IntlTypography from "../../../components/Intl/IntlTypography"



import DateHelper from "../../../helpers/DateHelper"

import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"
import { IConfirmOffer } from "../../../interfaces/IOffer"

import LeadService from "../../../services/LeadService"
import { Link } from "react-router-dom"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import HttpErrorHandler from "../../../components/HttpErrorHandler"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import { ILead } from "../../../interfaces/ILead"
import { ILeadContainer } from "../LeadAPI"


const useStyles = makeStyles((theme: Theme) => createStyles({
  buttonGroupPadding: {
    padding: 4,
  },
  buttonRootText: {
    textTransform: "none"
  },
  rightAlign: {
    padding: theme.spacing(2),
    width: "100%",
    textAlign: "right",
  },
  infoMessage: {
    color: "orange"
  },
}))


interface OfferOverrideProps {
  lead: ILead
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: () => Promise<any>) => Promise<void>
}

export default function OfferOverride(props: OfferOverrideProps) {
  const { lead, handleChangeAndSave } = props
  const [overrideConfirmation, setOverrideConfirmation] = React.useState<boolean>(false)
  const intl = useIntl()
  const matches = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"))
  const classes = useStyles()



  if (lead.ConfirmedOffer && lead.ConfirmedOrder != null && !overrideConfirmation)  {
    return (
      <Grid item xs={12}>
        <IntlTypography>{lead.ConfirmedOrder ? "OFFER_CONFIRMED" : "OFFER_DECLINED"}</IntlTypography>
        <Typography>
          <IntlTypography component="span">{intl.formatDate(DateHelper.parseDateNotNull(lead.ConfirmedOffer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" })}</IntlTypography>
          <Link target="_blank" to={`/lead/${lead.LeadId}/offer/preview/${lead.ConfirmedOffer.OfferId}`}><OpenInNewIcon /></Link>
        </Typography>
        <hr />
        {lead.ConfirmedOrder != null &&
          <IntlTypography className={classes.infoMessage}>{"OFFER_RESENT_MAIL_CANCELFIRST"}</IntlTypography>
        }
        <Button onClick={() => setOverrideConfirmation(true)} variant="contained" color="primary">
          <FormattedMessage id="OVERRIDE" />
        </Button>
      </Grid>
    )
  } else if (overrideConfirmation || lead.Offers.length > 0) {
    return (
      <Formik<{
        OfferId: number | null
        ConfirmedOrderVerbal: boolean
        ConfirmedOrder: boolean | null
        Comment: string
      }>
        initialValues={{
          OfferId: lead.ConfirmedOffer ? lead.ConfirmedOffer.OfferId : null,
          ConfirmedOrderVerbal: lead.ConfirmedOrderVerbal,
          ConfirmedOrder: lead.ConfirmedOrder,
          Comment: "",
        }}
        onSubmit={async (values, actions) => {
          try {
            const {
              OfferId,
              ConfirmedOrderVerbal,
              ConfirmedOrder,
              Comment,
            } = values

            if (OfferId) {
              const order: IConfirmOffer = {
                LeadId: lead.LeadId,
                OfferId,
                ConfirmedOrderVerbal,
                ConfirmedOrder: ConfirmedOrder,
                Comment,
              }

              const offer = lead.Offers.find(offer => offer.OfferId === OfferId)


              await handleChangeAndSave({ ...lead, ConfirmedOffer: offer, ConfirmedOrderVerbal, ConfirmedOrder }, "Lead", () => LeadService.confirmOffer(order))
              actions.setSubmitting(false)
              actions.resetForm()
              setOverrideConfirmation(false)
            }
          } catch (e) {
            actions.setStatus(e)
          }
        }}
      >
        {({ setFieldValue, values: { OfferId, ConfirmedOrder, ConfirmedOrderVerbal }, isSubmitting, status }) => (
          <Form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <IntlTypography>OFFER_SENT_EMAIL</IntlTypography>
                {
                  (() => {
                    if (lead.ConfirmedOrderVerbal && lead.ConfirmedOffer) {
                      return <>
                        <IntlTypography>{intl.formatDate(DateHelper.parseDateNotNull(lead.ConfirmedOffer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" })}</IntlTypography>
                        <IntlTypography>CUSTOMER_VERBAL_CONFIRMATION</IntlTypography>
                      </>
                    }
                  })()
                }

              </Grid>

              <Grid item xs={12}>
                <IntlTypography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  MANUAL_OVERRIDE
                </IntlTypography>
              </Grid>

              <Grid item xs={12}>
                <Grid container>
                  <Grid item style={{ flexGrow: 1 }}>
                    <Field
                      label="OFFER"
                      name="OfferId"
                      component={FormikSimpleSelect}
                      notTranslated
                      required
                      options={lead.Offers.sort((offer1, offer2) => DateHelper.parseDateNotNull(offer2.Created).getTime() - DateHelper.parseDateNotNull(offer1.Created).getTime()).map(offer => ({
                        label: intl.formatDate(DateHelper.parseDateNotNull(offer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }),
                        value: offer.OfferId,
                      }))}
                      overrideGrid={{}}
                      disableGrid
                    />
                  </Grid>
                  <Grid item>
                    <Link target="_blank" to={`/lead/${lead.LeadId}/offer/preview/${OfferId}`}><OpenInNewIcon /></Link>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <ButtonGroup className={classes.buttonGroupPadding} orientation={matches ? "horizontal" : "vertical"}>
                  {!lead.ConfirmedOrderVerbal ?
                    <Button onClick={() => { setFieldValue("ConfirmedOrderVerbal", true); setFieldValue("ConfirmedOrder", null) }} classes={{ root: classes.buttonRootText }} color={ConfirmedOrderVerbal ? "primary" : "inherit"} variant={ConfirmedOrderVerbal ? "contained" : "outlined"} >
                      <FormattedMessage id="VERBAL_CONFIRMATION" />
                    </Button> : null
                  }
                  <Button onClick={() => { setFieldValue("ConfirmedOrder", true); setFieldValue("ConfirmedOrderVerbal", false) }} classes={{ root: classes.buttonRootText }} color={ConfirmedOrder ? "primary" : "inherit"} variant={ConfirmedOrder ? "contained" : "outlined"}>
                    <FormattedMessage id="CONFIRMED" />
                  </Button>
                  <Button onClick={() => { setFieldValue("ConfirmedOrder", false); setFieldValue("ConfirmedOrderVerbal", false) }} classes={{ root: classes.buttonRootText }} color={ConfirmedOrder === false ? "primary" : "inherit"} variant={ConfirmedOrder === false ? "contained" : "outlined"}>
                    <FormattedMessage id="DECLINED" />
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>

            <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

            <HttpErrorHandler status={status} data={{ OfferId, ConfirmedOrder, ConfirmedOrderVerbal }} />

            <Grid item xs={12} className={classes.rightAlign}>
              <Button variant="contained" color="primary" type="submit" disabled={isSubmitting || !OfferId}>
                <FormattedMessage id="SAVE" />
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    )

  } else {
    return (
      <Grid item xs={12}>
        <IntlTypography>OFFER_NOT_SENT</IntlTypography >
      </Grid>
    )
  }
}
