import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography, Button, Table, TableHead, TableRow, TableBody, TableCell, RadioGroup, FormControlLabel, Radio, ButtonGroup } from "@material-ui/core"
import { Formik, FormikProps, withFormik, Field, FieldArray, Form } from "formik"
import { injectIntl, InjectedIntlProps, FormattedDate, FormattedMessage } from "react-intl"
import { withResource, WithResourceProps } from "../../providers/withResource"
import PageHeader from "../../components/PageHeader"
import IntlTypography from "../../components/Intl/IntlTypography"
import { ILead } from "../../interfaces/ILead"
import FormikGroups from "../../components/FormikFields/Bundled/Groups"
import ServiceIcons from "../../components/Dashboard/ServiceIcons"
import IntlTableCell from "../../components/Intl/IntlTableCell"

import FormikSimpleSelect from "../../components/FormikFields/FormikSimpleSelect"
import { IConfirmOffer } from "../../interfaces/IOffer"
import LeadAPI, { ILeadContainer } from "./LeadAPI"
import LeadService from "../../services/LeadService"
import { Link } from "react-router-dom"
import FormikTextField from "../../components/FormikFields/FormikTextField"
import HttpErrorHandler from "../../components/HttpErrorHandler"
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

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

function desc<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

interface _Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  lead: ILead
  offline: boolean
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: () => Promise<any>) => Promise<void>
}

class LeadOverview extends React.Component<_Props, {OverrideConfirmation: boolean}> {
  state = {
    OverrideConfirmation: false
  }

  public render() {
    const { selectedCompany, lead, intl, classes } = this.props

    return (
      <Grid item xs={12}>
        <Grid container spacing={1} style={{ padding: 8 }}>
          <Grid item xs={12}>
            <PageHeader title="LEAD_OVERVIEW" />
          </Grid>

          <FormikGroups label="INFORMATION" xs={12} md={6}>
            <Grid item xs={12}>
              <Table size="small" aria-label="a dense table">

                <TableBody>
                  <TableRow>
                    <IntlTableCell component="th" scope="row">FULL_NAME</IntlTableCell>
                    <TableCell>{intl.formatMessage({ id: lead.Customer.IsMale ? "MR" : "MRS"})}. {lead.Customer.Firstname} {lead.Customer.Lastname}</TableCell>
                  </TableRow>

                  <TableRow>
                    <IntlTableCell component="th" scope="row">FROM</IntlTableCell>
                    <TableCell>
                      {
                        lead.FromAddress ?
                          <a href={"https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(`${lead.FromAddress.Street}, ${lead.FromAddress.PLZ} ${lead.FromAddress.City}`)} target="_blank">{lead.FromAddress.PLZ} {lead.FromAddress.City}, {lead.FromAddress.Street}</a>
                          : <FormattedMessage id="NO_ADDRESS" />
                      }
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <IntlTableCell component="th" scope="row">TO</IntlTableCell>
                    <TableCell>
                      {
                        lead.ToAddress ?
                          <a href={"https://www.google.com/maps/dir/?api=1&destination" + encodeURIComponent(`${lead.ToAddress.PLZ} ${lead.ToAddress.City}, ${lead.ToAddress.Street}`)} target="_blank">{lead.ToAddress.PLZ} {lead.ToAddress.City}, {lead.ToAddress.Street}</a>
                          : <FormattedMessage id="NO_ADDRESS" />
                      }
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <IntlTableCell component="th" scope="row">CREATED</IntlTableCell>
                    <TableCell><FormattedDate value={lead.Created} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                  </TableRow>

                  {
                    lead.VisitDate ?
                      <TableRow>
                        <IntlTableCell component="th" scope="row">VISITING_DATE</IntlTableCell>
                        <TableCell><FormattedDate value={lead.VisitDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                      </TableRow>
                      : null
                  }

                  {
                    lead.MoveDate ?
                      <TableRow>
                        <IntlTableCell component="th" scope="row">MOVING</IntlTableCell>
                        <TableCell><FormattedDate value={lead.MoveDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                      </TableRow>
                      : null
                  }

                  {
                    lead.PackServiceDate ?
                      <TableRow>
                        <IntlTableCell component="th" scope="row">PACKINGSERVICE</IntlTableCell>
                        <TableCell><FormattedDate value={lead.PackServiceDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                      </TableRow>
                      : null
                  }


                  {
                    lead.DeliveryDate ?
                      <TableRow>
                        <IntlTableCell component="th" scope="row">CARDBOARDBOX_DELIVERY</IntlTableCell>
                        <TableCell><FormattedDate value={lead.DeliveryDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                      </TableRow>
                      : null
                  }


                  {
                    lead.StorageDate ?
                      <TableRow>
                        <IntlTableCell component="th" scope="row">STORAGE</IntlTableCell>
                        <TableCell><FormattedDate value={lead.StorageDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                      </TableRow>
                      : null
                  }

                  {
                    lead.DisposalDate ?
                      <TableRow>
                        <IntlTableCell component="th" scope="row">DISPOSAL</IntlTableCell>
                        <TableCell><FormattedDate value={lead.DisposalDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                      </TableRow>
                      : null
                  }

                  {
                    lead.CleaningDate ?
                      <TableRow>
                        <IntlTableCell component="th" scope="row">CLEANING</IntlTableCell>
                        <TableCell><FormattedDate value={lead.CleaningDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                      </TableRow>
                      : null
                  }

                  {
                    lead.HandOverDate ?
                      <TableRow>
                        <IntlTableCell component="th" scope="row">HANDIN</IntlTableCell>
                        <TableCell><FormattedDate value={lead.HandOverDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                      </TableRow>
                      : null
                  }

                  <TableRow>
                    <IntlTableCell component="th" scope="row">EMAIL</IntlTableCell>
                    <TableCell><a href={"mailto:" + lead.Customer.Email}>{lead.Customer.Email}</a></TableCell>
                  </TableRow>
                  <TableRow>
                    <IntlTableCell component="th" scope="row">PHONE</IntlTableCell>

                    <TableCell><a href={"tel:" + lead.Customer.TelephoneNumber}>{lead.Customer.TelephoneNumber}</a></TableCell>
                  </TableRow>

                  {
                    lead.Customer.CompanyName.length > 0 ?
                      <TableRow>
                        <IntlTableCell component="th" scope="row">COMPANY</IntlTableCell>
                        <TableCell>{lead.Customer.CompanyName}</TableCell>
                      </TableRow>
                      : null
                  }

                  <TableRow>
                    <IntlTableCell component="th" scope="row">SERVICES</IntlTableCell>
                    <TableCell><ServiceIcons lead={lead} services={lead.Services} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <IntlTableCell component="th" scope="row">STATUS</IntlTableCell>
                    <IntlTableCell>{lead.Status.NameTextKey}</IntlTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </FormikGroups>

          <FormikGroups label="OFFER_STATUS" xs={12} md={6}>
            {
              lead.ConfirmedOffer && lead.ConfirmedOrder != null && !this.state.OverrideConfirmation ? (
                <Grid item xs={12}>
                  <IntlTypography>{lead.ConfirmedOrder ? "OFFER_CONFIRMED" : "OFFER_DECLINED"}</IntlTypography>
                  <Typography>
                    <IntlTypography component="span">{intl.formatDate(lead.ConfirmedOffer.Created, { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }) + ", " + lead.ConfirmedOffer.FromTemplate}</IntlTypography>
                    <Link target="_blank" to={`/lead/${lead.LeadId}/offer/preview/${lead.ConfirmedOffer.OfferId}`}><OpenInNewIcon /></Link>
                  </Typography>
                  <hr/>
                  {lead.ConfirmedOrder != null &&
                    <IntlTypography className={classes.infoMessage}>{"OFFER_RESENT_MAIL_CANCELFIRST"}</IntlTypography>
                  }
                  <Button onClick={() => this.setState({ OverrideConfirmation: true })} variant="contained" color="primary">
                    <FormattedMessage id="OVERRIDE"  />
                  </Button>
                </Grid>
              ) : this.state.OverrideConfirmation || (lead.Offers.length > 0) ? (
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
                      console.log(values)

                      if(OfferId) {
                        const order: IConfirmOffer = {
                          LeadId: lead.LeadId,
                          OfferId,
                          ConfirmedOrderVerbal,
                          ConfirmedOrder: ConfirmedOrder,
                          Comment,
                        }

                        const offer = lead.Offers.find(offer => offer.OfferId === OfferId)


                        await this.props.handleChangeAndSave({...lead, ConfirmedOffer: offer, ConfirmedOrderVerbal, ConfirmedOrder}, "Lead", () => LeadService.confirmOffer(order))
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
                              if (lead.ConfirmedOrderVerbal && lead.ConfirmedOffer ) {
                                return <>
                                  <IntlTypography>{intl.formatDate(lead.ConfirmedOffer.Created, { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }) + ", " + lead.ConfirmedOffer.FromTemplate}</IntlTypography>
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
                                options={lead.Offers.sort((offer1, offer2) => new Date(offer2.Created).getTime() - new Date(offer1.Created).getTime()).map(offer => ({
                                  label: intl.formatDate(offer.Created, { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }) + ", " + offer.FromTemplate,
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
                          <ButtonGroup className={classes.buttonGroupPadding}>
                            {!lead.ConfirmedOrderVerbal ?
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

          {lead.AppointmentReminders && lead.AppointmentReminders.length > 0 ? (
            <FormikGroups label="SMS_HISTORY" xs={12}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <IntlTableCell>SENT</IntlTableCell>
                    <IntlTableCell>APPOINTMENTTYPE</IntlTableCell>
                    <IntlTableCell>DATE</IntlTableCell>
                    <IntlTableCell>NOTIFICATIONTYPE</IntlTableCell>
                    <IntlTableCell>TO</IntlTableCell>
                    <IntlTableCell>ERRORMESSAGE</IntlTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lead.AppointmentReminders.sort((a, b) => desc(a, b, "Created")).map(e => (
                    <TableRow key={e.AppointmentReminderId} className={!e.Succeed ? classes.errorRow : classes.successRow}>
                      <TableCell><FormattedDate value={e.Created} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                      <IntlTableCell>{e.AppointmentTypeTextKey}</IntlTableCell>
                      <TableCell><FormattedDate value={e.AppointedDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                      <TableCell>{e.NotificationType}</TableCell>
                      <TableCell>{e.To}</TableCell>
                      <TableCell>{e.ErrorMessage ? e.ErrorMessage : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </FormikGroups>
          ) : null}

          <FormikGroups label="STATUS_HISTORY" xs={12}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <IntlTableCell>STATUS</IntlTableCell>
                  <IntlTableCell>DATE</IntlTableCell>
                  <IntlTableCell>COMMENT</IntlTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lead.StatusHistories.sort((a, b) => desc(a, b, "Created")).map(e => (
                  <TableRow key={e.StatusHistoryId}>
                    <IntlTableCell>{e.Status.NameTextKey}</IntlTableCell>
                    <TableCell><FormattedDate value={e.Created} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                    <TableCell>{e.Comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </FormikGroups>
        </Grid>
      </Grid>
    )
  }
}

export default injectIntl(withStyles(styles)(withResource(LeadOverview)))
