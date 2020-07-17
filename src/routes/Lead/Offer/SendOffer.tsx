import React, { useState } from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid,    Button, ListItem, List, IconButton, ListItemText, ListItemSecondaryAction, TextField, ListSubheader } from "@material-ui/core"
import {  FormikProps, withFormik, Field, FieldArray, Formik } from "formik"
import { injectIntl, WrappedComponentProps,  FormattedMessage, useIntl } from "react-intl"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps, useResourceContext } from "../../../providers/withResource"
import PageHeader from "../../../components/PageHeader"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import {  ILead } from "../../../interfaces/ILead"
import LeadAPI from "../LeadAPI"
import OfferService from "../../../services/OfferService"
import AddIcon from "@material-ui/icons/Add"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import { RouteComponentProps, useRouteMatch } from "react-router"
import DateHelper from "../../../helpers/DateHelper"
import { SendOfferEmailModel } from "../../../models/Offer"
import { FormikAutocompleteSimple } from "../../../components/Formik"

interface FormValues extends Omit<SendOfferEmailModel, "OfferId" | "CSettingEmailTypeId">  {
  OfferId: number | null
  CSettingEmailTypeId: number | null
}

interface Props extends RouteComponentProps {
  nextPage: () => void
  lead: ILead
  offline: boolean
}

// KWIKFIX for email
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default function SendOffer(props: Props) {
  const { lead, nextPage } = props
  const intl = useIntl()

  const [emailValue, setEmailValue] = useState<string>("")

  const { selectedCompany } = useResourceContext()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value)
  }

  const match = useRouteMatch<{ offerId?: string }>()

  // const {  } = selectedCompany.Settings.

  const getInitialValues = (): FormValues => {
    if (match?.params.offerId) {
      const selectedOfferId = parseInt(match.params.offerId)
      if (!isNaN(selectedOfferId)) {
        const offer = props.lead.Offers.find(offer => offer.OfferId === selectedOfferId)

        if (offer) {
          return { OfferId: selectedOfferId, Comment: "", CCEmailList: [], CSettingEmailTypeId: null }
        }
      }
    }

    return { OfferId: null, Comment: "", CCEmailList: [], CSettingEmailTypeId: null }
  }

  if (!selectedCompany) {
    throw new Error("Selected company not defined")
  }

  return (
    <Formik<FormValues>
      initialValues={getInitialValues()}
      onSubmit={async(values, actions) => {
        try {
          const { OfferId, CSettingEmailTypeId } = values

          actions.setSubmitting(true)

          // If fields are empty
          if (!OfferId || !CSettingEmailTypeId) {
            actions.setSubmitting(false)
            return
          }

          await OfferService.sendOffer({ ...values, OfferId, CSettingEmailTypeId })
          actions.setSubmitting(false)
          actions.resetForm()
          nextPage()

        } catch (e) {
          actions.setStatus(e)
        }
      }}
    >
      {({ isSubmitting, values }) =>
        (
          <Form disableSubmit>
            <PageHeader title="SEND_OFFER" />

            <Field
              label="OFFER"
              name="OfferId"
              component={FormikSimpleSelect}
              notTranslated
              options={lead.Offers.sort((offer1, offer2) => DateHelper.parseDateNotNull(offer2.Created).getTime() - DateHelper.parseDateNotNull(offer1.Created).getTime()).map(offer => ({
                label: intl.formatDate(DateHelper.parseDateNotNull(offer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }),
                value: offer.OfferId,
              }))}
            />

            <Grid item xs={12} md={6}>
              <FieldArray
                name="CCEmailList"
                render={arrayHelpers => (
                  <List
                    dense
                    subheader={
                      <ListSubheader>
                        <FormattedMessage id="CC_EMAILS"></FormattedMessage>
                      </ListSubheader>
                    }
                  >
                    {values.CCEmailList.map((email, index) => (
                      <ListItem key={index} dense>
                        <ListItemText primary={email} />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => arrayHelpers.remove(index)}>
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}

                    <ListItem>
                      <ListItemText primary={<TextField label={intl.formatMessage({ id: "EMAIL" })} value={emailValue} type="email" onChange={handleChange} />} />

                      <ListItemSecondaryAction>
                        <IconButton
                          disabled={isSubmitting || !emailValue || !EMAIL_REGEX.test(emailValue.toLowerCase())}
                          onClick={() => {
                            arrayHelpers.push(emailValue)
                            setEmailValue("")
                          }}
                          edge="end"
                        >
                          <AddIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <FormikAutocompleteSimple<FormValues, false, true, false>
                options={
                  selectedCompany.Settings.EmailTypes.map(email => ({ label: intl.formatMessage({id: email.SubjectTextKey ?? "NO_SUBJECT"}), value: email.CSettingEmailTypeId }))
                }
                name="CSettingEmailTypeId"
                label={"SUBJECT_TEXT"}
                required
                disableClearable
              />
            </Grid>

            <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

            <Grid item xs={12}>
              <Button disabled={!values.OfferId || !values.CSettingEmailTypeId || isSubmitting} variant="contained" color="primary" type="submit">
                <FormattedMessage id="SEND_EMAIL" />
              </Button>
            </Grid>
          </Form>
        )}
    </Formik>
  )
}
