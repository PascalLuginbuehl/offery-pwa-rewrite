import * as React from "react"
import {  Theme, WithStyles, withStyles, Grid,   Typography, Button,     TableCell,    ButtonGroup, Hidden, createStyles } from "@material-ui/core"
import { Formik,   Field,  Form } from "formik"
import { injectIntl, WrappedComponentProps,  FormattedMessage } from "react-intl"
import { withResource, WithResourceProps } from "../../../providers/withResource"
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


const styles = (theme: Theme) => createStyles({
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
})


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

interface _Props extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  leadContainer: ILeadContainer
  offline: boolean
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: () => Promise<any>) => Promise<void>
}

class LeadOverview extends React.Component<_Props, {OverrideConfirmation: boolean}> {
  state = {
    OverrideConfirmation: false
  }

  public render() {
    const { selectedCompany, leadContainer, intl, classes, } = this.props
    const { Lead, buildings, ...restLead } = leadContainer
    const services = { disposalService: restLead.disposalService, moveService: restLead.moveService, packService: restLead.packService, storageService: restLead.storageService, cleaningService: restLead.cleaningService }

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
              Lead.ConfirmedOffer && Lead.ConfirmedOrder != null && !this.state.OverrideConfirmation ? (
                <Grid item xs={12}>
                  <IntlTypography>{Lead.ConfirmedOrder ? "OFFER_CONFIRMED" : "OFFER_DECLINED"}</IntlTypography>
                  <Typography>
                    <IntlTypography component="span">{intl.formatDate(DateHelper.parseDateNotNull(Lead.ConfirmedOffer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }) + ", " + Lead.ConfirmedOffer.FromTemplate}</IntlTypography>
                    <Link target="_blank" to={`/lead/${Lead.LeadId}/offer/preview/${Lead.ConfirmedOffer.OfferId}`}><OpenInNewIcon /></Link>
                  </Typography>
                  <hr/>
                  {Lead.ConfirmedOrder != null &&
                    <IntlTypography className={classes.infoMessage}>{"OFFER_RESENT_MAIL_CANCELFIRST"}</IntlTypography>
                  }
                  <Button onClick={() => this.setState({ OverrideConfirmation: true })} variant="contained" color="primary">
                    <FormattedMessage id="OVERRIDE"  />
                  </Button>
                </Grid>
              ) : this.state.OverrideConfirmation || (Lead.Offers.length > 0) ? (
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


                        await this.props.handleChangeAndSave({...Lead, ConfirmedOffer: offer, ConfirmedOrderVerbal, ConfirmedOrder}, "Lead", () => LeadService.confirmOffer(order))
                        this.setState({OverrideConfirmation: false})
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
                                  <IntlTypography>{intl.formatDate(DateHelper.parseDateNotNull(Lead.ConfirmedOffer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }) + ", " + Lead.ConfirmedOffer.FromTemplate}</IntlTypography>
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
                                  label: intl.formatDate(DateHelper.parseDateNotNull(offer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }) + ", " + offer.FromTemplate,
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
                          <ButtonGroup className={classes.buttonGroupPadding}>
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
}

export default injectIntl(withStyles(styles)(withResource(LeadOverview)))
