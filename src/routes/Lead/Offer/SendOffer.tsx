import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid,   Typography, Button, ListItem, List, IconButton, ListItemText, ListItemSecondaryAction, TextField, ListSubheader } from "@material-ui/core"
import {  FormikProps, withFormik, Field, FieldArray } from "formik"
import { injectIntl, WrappedComponentProps,  FormattedMessage } from "react-intl"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import PageHeader from "../../../components/PageHeader"
import FormikSimpleSelect from "../../../components/FormikFields/FormikSimpleSelect"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import {  ILead } from "../../../interfaces/ILead"
import LeadAPI from "../LeadAPI"
import OfferService from "../../../services/OfferService"
import AddIcon from "@material-ui/icons/Add"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import { RouteComponentProps } from "react-router"
import DateHelper from "../../../helpers/DateHelper"

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

const styles = (theme: Theme) => createStyles({})

interface Values {
  OfferId: number | null
  CCEmailList: string[]
  Comment: string
}


interface Props extends RouteComponentProps<{ offerId?: string }>, WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  nextPage: () => void
  lead: ILead
  offline: boolean
}

interface State {
  emailValue: string
}

// KWIKFIX for email
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class SendOffer extends React.Component<Props & FormikProps<Values>, State> {
  state: State = {
    emailValue: "",
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ emailValue: event.target.value })
  }

  public render() {
    const { isSubmitting, status, resource, selectedCompany, values, lead, intl } = this.props
    const { OfferEmailBodyContentIntroTextKey, OfferEmailSubjectTextKey, OfferEmailBodyContentOutroTextKey } = selectedCompany.Settings
    const { emailValue } = this.state
    return (
      <Grid item xs={12}>
        <Form disableSubmit>
          <PageHeader title="SEND_OFFER" />
          <Grid item xs={12}>

            <Typography>
              <b><FormattedMessage id={OfferEmailSubjectTextKey} values={{ br: <br /> }} /></b>
            </Typography>

            <Typography>
              <FormattedMessage id={OfferEmailBodyContentIntroTextKey} values={{ br: <br /> }} />
            </Typography>

            <Typography>
              <FormattedMessage id={OfferEmailBodyContentOutroTextKey} values={{ br: <br /> }} />
            </Typography>
          </Grid>

          <Field
            label="OFFER"
            name="OfferId"
            component={FormikSimpleSelect}
            notTranslated
            options={lead.Offers.sort((offer1, offer2) => DateHelper.parseDateNotNull(offer2.Created).getTime() - DateHelper.parseDateNotNull(offer1.Created).getTime()).map(offer => ({
              label: offer.FromTemplate + ", " + intl.formatDate(DateHelper.parseDateNotNull(offer.Created), { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }),
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
                    <ListItemText primary={<TextField label={intl.formatMessage({ id: "EMAIL" })} value={emailValue} type="email" onChange={this.handleChange} />} />

                    <ListItemSecondaryAction>
                      <IconButton
                        disabled={isSubmitting || !emailValue || !EMAIL_REGEX.test(emailValue.toLowerCase())}
                        onClick={() => {
                          arrayHelpers.push(emailValue)
                          this.setState({ emailValue: "" })
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

          <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

          <Grid item xs={12}>
            <Button onClick={this.sendAndSubmit} disabled={!values.OfferId || isSubmitting} variant="contained" color="primary">
              <FormattedMessage id="SEND_EMAIL" />
            </Button>
          </Grid>
        </Form>
      </Grid>
    )
  }

  sendAndSubmit = async () => {
    const { lead, submitForm, values, setSubmitting } = this.props
    const { OfferId, Comment, CCEmailList } = values

    setSubmitting(true)

    if (LeadAPI.isCompleteLead(lead) && OfferId) {
      await OfferService.sendOffer(OfferId, CCEmailList, Comment)
    }

    submitForm()
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
                return { OfferId: selectedOfferId, Comment: "", CCEmailList: [] }
              }
            }
          }

          return { OfferId: null, Comment: "", CCEmailList: [] }
        },

        handleSubmit: (values, actions) => {
          try {
            actions.setSubmitting(false)

            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(SendOffer)
    )
  )
)
