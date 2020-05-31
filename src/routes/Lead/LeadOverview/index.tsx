import * as React from "react"
import {  Theme,  withStyles, Grid,   Typography, Button,     TableCell,    ButtonGroup, Hidden, createStyles, makeStyles, useMediaQuery } from "@material-ui/core"
import { Formik,   Field,  Form } from "formik"
import {    FormattedMessage, useIntl } from "react-intl"

import PageHeader from "../../../components/PageHeader"
import IntlTypography from "../../../components/Intl/IntlTypography"

import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import IntlTableCell from "../../../components/Intl/IntlTableCell"
import DateHelper from "../../../helpers/DateHelper"

import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"
import { IConfirmOffer } from "../../../interfaces/IOffer"
import  { ILeadContainer } from "../LeadAPI"
import LeadService from "../../../services/LeadService"
import { Link } from "react-router-dom"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import HttpErrorHandler from "../../../components/HttpErrorHandler"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"

import { LeadDetailsMobile, LeadDetailsTable } from "./LeadDetails"
import ReminderHistory from "./ReminderHistory"
import StatusHistory from "./StatusHistory"

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
  errorRow: {
    backgroundColor: "lightpink"
  },
  successRow: {
  }
}))


export const StyledTableCell = withStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      padding: "6px 8px 6px 0",
    },
  }
}))(TableCell)

export const IntlStyledTableCell = withStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      padding: "6px 8px 6px 0",
    },
  }
}))(IntlTableCell)

interface _Props{
  leadContainer: ILeadContainer
  offline: boolean
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: () => Promise<any>) => Promise<void>
}

export default function LeadOverview(props: _Props) {
  const { handleChangeAndSave, offline, leadContainer} = props
  const [overrideConfirmation, setOverrideConfirmation] = React.useState<boolean>(false)
  const intl = useIntl()
  const classes = useStyles()

  const { Lead, buildings, ...restLead } = leadContainer

  const matches = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"))


  return (
    <Grid item xs={12}>
      <Grid container spacing={1} style={{ padding: 8 }}>
        <Grid item xs={12}>
          <PageHeader title="LEAD_OVERVIEW" />
        </Grid>

        <FormikGroups label="INFORMATION" xs={12} md={6}>
          <Grid item xs={12}>
            <Hidden smUp>
              <LeadDetailsMobile leadContainer={leadContainer} />
            </Hidden>

            <Hidden xsDown>
              <LeadDetailsTable leadContainer={leadContainer} />
            </Hidden>
          </Grid>
        </FormikGroups>

        <FormikGroups label="OFFER_STATUS" xs={12} md={6}>
          {
            Lead.ConfirmedOffer && Lead.ConfirmedOrder != null && !overrideConfirmation ? (
              <Grid item xs={12}>
                <IntlTypography>{Lead.ConfirmedOrder ? "OFFER_CONFIRMED" : "OFFER_DECLINED"}</IntlTypography>
                <Typography>
                  <IntlTypography component="span">{intl.formatDate(DateHelper.parseDateNotNull(Lead.ConfirmedOffer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" })}</IntlTypography>
                  <Link target="_blank" to={`/lead/${Lead.LeadId}/offer/preview/${Lead.ConfirmedOffer.OfferId}`}><OpenInNewIcon /></Link>
                </Typography>
                <hr/>
                {Lead.ConfirmedOrder != null &&
                <IntlTypography className={classes.infoMessage}>{"OFFER_RESENT_MAIL_CANCELFIRST"}</IntlTypography>
                }
                <Button onClick={() => setOverrideConfirmation(true)} variant="contained" color="primary">
                  <FormattedMessage id="OVERRIDE"  />
                </Button>
              </Grid>
            ) : overrideConfirmation || (Lead.Offers.length > 0) ? (
              <Formik<{
                    OfferId: number | null
                    ConfirmedOrderVerbal: boolean
                    ConfirmedOrder: boolean | null
                    Comment: string
                  }>
                initialValues={{
                  OfferId: Lead.ConfirmedOffer ? Lead.ConfirmedOffer.OfferId : null,
                  ConfirmedOrderVerbal: Lead.ConfirmedOrderVerbal,
                  ConfirmedOrder: Lead.ConfirmedOrder,
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
                    console.log(values)

                    if(OfferId) {
                      const order: IConfirmOffer = {
                        LeadId: Lead.LeadId,
                        OfferId,
                        ConfirmedOrderVerbal,
                        ConfirmedOrder: ConfirmedOrder,
                        Comment,
                      }

                      const offer = Lead.Offers.find(offer => offer.OfferId === OfferId)


                      await handleChangeAndSave({...Lead, ConfirmedOffer: offer, ConfirmedOrderVerbal, ConfirmedOrder}, "Lead", () => LeadService.confirmOffer(order))
                      setOverrideConfirmation(false)
                      actions.setSubmitting(false)
                    }
                  } catch (e) {
                    actions.setStatus(e)
                  }
                }}
              >
                {({ setFieldValue, values: { OfferId, ConfirmedOrder, ConfirmedOrderVerbal }, isSubmitting, status}) => (
                  <Form>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <IntlTypography>OFFER_SENT_EMAIL</IntlTypography>
                        {
                          (() => {
                            if (Lead.ConfirmedOrderVerbal && Lead.ConfirmedOffer ) {
                              return <>
                                <IntlTypography>{intl.formatDate(DateHelper.parseDateNotNull(Lead.ConfirmedOffer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" })}</IntlTypography>
                                <IntlTypography>CUSTOMER_VERBAL_CONFIRMATION</IntlTypography>
                              </>
                            }
                          })()
                        }

                      </Grid>

                      <Grid item xs={12}>
                        <IntlTypography variant="subtitle1" style={{fontWeight: "bold"}}>
                            MANUAL_OVERRIDE
                        </IntlTypography>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item style={{flexGrow: 1}}>
                            <Field
                              label="OFFER"
                              name="OfferId"
                              component={FormikSimpleSelect}
                              notTranslated
                              required
                              options={Lead.Offers.sort((offer1, offer2) => DateHelper.parseDateNotNull(offer2.Created).getTime() - DateHelper.parseDateNotNull(offer1.Created).getTime()).map(offer => ({
                                label: intl.formatDate(DateHelper.parseDateNotNull(offer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }),
                                value: offer.OfferId,
                              }))}
                              overrideGrid={{}}
                              disableGrid
                            />
                          </Grid>
                          <Grid item>
                            <Link target="_blank" to={`/lead/${Lead.LeadId}/offer/preview/${OfferId}`}><OpenInNewIcon /></Link>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <ButtonGroup className={classes.buttonGroupPadding} orientation={matches ? "horizontal" : "vertical"  }>
                          {!Lead.ConfirmedOrderVerbal ?
                            <Button onClick={() => {setFieldValue("ConfirmedOrderVerbal", true); setFieldValue("ConfirmedOrder", null)}} classes={{ root: classes.buttonRootText }} color={ConfirmedOrderVerbal ? "primary" : "inherit"} variant={ConfirmedOrderVerbal ? "contained" : "outlined"} >
                              <FormattedMessage id="VERBAL_CONFIRMATION" />
                            </Button> : null
                          }
                          <Button onClick={() => { setFieldValue("ConfirmedOrder", true); setFieldValue("ConfirmedOrderVerbal", false)}} classes={{ root: classes.buttonRootText }} color={ConfirmedOrder ? "primary" : "inherit"} variant={ConfirmedOrder ? "contained" : "outlined"}>
                            <FormattedMessage id="CONFIRMED" />
                          </Button>
                          <Button onClick={() => {setFieldValue("ConfirmedOrder", false); setFieldValue("ConfirmedOrderVerbal", false)}} classes={{ root: classes.buttonRootText }} color={ConfirmedOrder === false ? "primary" : "inherit"} variant={ConfirmedOrder === false ? "contained" : "outlined"}>
                            <FormattedMessage id="DECLINED" />
                          </Button>
                        </ButtonGroup>
                      </Grid>
                    </Grid>

                    <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

                    <HttpErrorHandler status={status} data={{ OfferId, ConfirmedOrder, ConfirmedOrderVerbal}} />

                    <Grid item xs={12} className={classes.rightAlign}>
                      <Button variant="contained" color="primary" type="submit" disabled={isSubmitting || !OfferId}>
                        <FormattedMessage id="SAVE" />
                      </Button>
                    </Grid>
                  </Form>
                )}
              </Formik>
            ) : (
              <Grid item xs={12}>
                <IntlTypography>OFFER_NOT_SENT</IntlTypography>
              </Grid>
            )
          }
        </FormikGroups>

        <ReminderHistory lead={Lead} />

        <StatusHistory lead={Lead} />
      </Grid>
    </Grid>
  )
}
