import React, { useState } from "react"
import { Theme, Grid, Typography, Button, ButtonGroup, createStyles, makeStyles, useMediaQuery, Link, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core"
import { Formik, Field, Form } from "formik"
import { FormattedMessage, useIntl } from "react-intl"

import IntlTypography from "../../../components/Intl/IntlTypography"

import DateHelper from "../../../helpers/DateHelper"

import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"
import { IConfirmOffer } from "../../../interfaces/IOffer"

import LeadService from "../../../services/LeadService"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import HttpErrorHandler from "../../../components/HttpErrorHandler"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import { ILead } from "../../../interfaces/ILead"
import { ILeadContainer } from "../LeadAPI"
import { useTranslation } from "react-i18next"
import FormikSelectOffer from "../../../components/Formik/CustomComponents/FormikSelectOffer"
import { useFormattedName } from "../../../utils"

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
  const [overrideConfirmation, setOverrideConfirmation] = useState<boolean>(false)
  const intl = useIntl()
  const matches = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"))
  const classes = useStyles()
  const { t } = useTranslation()
  const [ dialogOpen, setDialogOpen ] = useState<boolean>(false)
  const formatName = useFormattedName()

  if (lead.ConfirmedOrder !== null && !overrideConfirmation)  {
    return (
      <Grid item xs={12}>
        <IntlTypography>{lead.ConfirmedOrder ? "OFFER_CONFIRMED" : "OFFER_DECLINED"}</IntlTypography>
        {lead.ConfirmedOffer ? (
          <Typography>
            <Typography component="span">{intl.formatDate(DateHelper.parseDateNotNull(lead.ConfirmedOffer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" })}</Typography>
            <Link target="_blank" href={`/#/lead/${lead.LeadId}/offer/preview/${lead.ConfirmedOffer.OfferId}`}><OpenInNewIcon /></Link>
          </Typography>
        ) : null}
        <hr />
        {lead.ConfirmedOrder != null &&
          <IntlTypography className={classes.infoMessage}>{"OFFER_RESENT_MAIL_CANCELFIRST"}</IntlTypography>
        }
        <Button onClick={() => setOverrideConfirmation(true)} variant="contained" color="primary">
          <FormattedMessage id="OVERRIDE" />
        </Button>
      </Grid>
    )
  }

  if (lead.Offers.length === 0) {
    return (
      <Grid item xs={12}>
        <Typography>{t("ORDER_OVERRIDE.NO_OFFERS_GENERATED")}</Typography>
        {
          lead.ConfirmedOrder === false ? (
            <Typography>{t("ORDER_OVERRIDE.TO_OVERRIDE_GENERATE")}</Typography>
          ) : (
            <Button variant = "contained" color = "primary" onClick = { () => setDialogOpen(true) }>
              { t("ORDER_OVERRIDE.CANCEL_ORDER") }
            </Button>
          )
        }

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{t("ORDER_OVERRIDE.CANCEL_THIS_ORDER")}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography>
                {formatName({ FirstName: lead.Customer.Firstname, LastName: lead.Customer.Lastname, Company: lead.Customer.CompanyName})}
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              {t("ORDER_OVERRIDE.CANCEL")}
            </Button>
            <Button onClick={async () => {
              const order: IConfirmOffer = {
                LeadId: lead.LeadId,
                OfferId: null,
                ConfirmedOrderVerbal: false,
                ConfirmedOrder: false,
                Comment: "",
              }

              await handleChangeAndSave({ ...lead, ConfirmedOffer: null, ConfirmedOrderVerbal: false, ConfirmedOrder: false }, "Lead", () => LeadService.confirmOffer(order))

              setDialogOpen(false)
            }}
              color="primary"
            >
              {t("ORDER_OVERRIDE.AGREE")}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    )
  }

  return (
    <Grid item xs={12}>
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
              {
                lead.ConfirmedOrderVerbal && lead.ConfirmedOffer ? (
                  <Grid item xs={12}>
                    <IntlTypography>OFFER_SENT_EMAIL</IntlTypography>
                    <Typography>{intl.formatDate(DateHelper.parseDateNotNull(lead.ConfirmedOffer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" })}</Typography>
                    <IntlTypography>CUSTOMER_VERBAL_CONFIRMATION</IntlTypography>
                  </Grid>
                ) : null
              }

              <Grid item xs={12}>
                <IntlTypography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  MANUAL_OVERRIDE
                </IntlTypography>
              </Grid>

              <Grid item xs={12}>
                <FormikSelectOffer
                  label={intl.formatMessage({ id: "OFFER" })}
                  name="OfferId"
                  required
                  offers={lead.Offers}
                />
                <Link target="_blank" href={`/#/lead/${lead.LeadId}/offer/preview/${OfferId}`}><OpenInNewIcon /></Link>
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

              <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

              <HttpErrorHandler status={status} data={{ OfferId, ConfirmedOrder, ConfirmedOrderVerbal }} />

              <Grid item xs={12} className={classes.rightAlign}>
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting || !OfferId}>
                  <FormattedMessage id="SAVE" />
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Grid>
  )
}
