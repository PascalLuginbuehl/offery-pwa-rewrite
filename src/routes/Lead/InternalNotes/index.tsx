import * as React from "react"
import { Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, ListItemAvatar, Avatar } from "@material-ui/core"
import PageHeader from "../../../components/PageHeader"
import HomeIcon from "@material-ui/icons/Home"
import { useRouteMatch } from "react-router"
import { Link } from "react-router-dom"
import { IBuilding } from "../../../interfaces/IBuilding"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import DeleteIcon from "@material-ui/icons/Delete"
import { useIntl } from "react-intl"
import FormikMockSubmit from "../../../components/FormikFields/FormikMockSubmit"
import LeadAPI from "../LeadAPI"
import { IPostLead, RegisterInternalNote, InternalNote } from "../../../interfaces/ILead"
import { Formik, Form } from "formik"
import { FormikTextField, FormikSubmit } from "../../../components/Formik"
import PersonIcon from "@material-ui/icons/Person"
import { useResourceContext } from "../../../providers/withResource"

interface Props {
  nextPage: () => void
  onChangeAndSave: (lead: IPostLead) => Promise<void>
  lead: IPostLead
}

type FormValues = RegisterInternalNote

const isRegisteredInternalNote = (note: InternalNote | RegisterInternalNote): note is InternalNote => {
  if (Object.prototype.hasOwnProperty.call(note, "InternalNoteId")) {
    return true
  }

  return false
}

interface NoteProps {
  firstname: string
  lastname: string
  note: string
}

export function Note(props: NoteProps) {
  const { firstname, lastname, note } = props
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp">
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={firstname}
        secondary={
          <Typography
            component="span"
            variant="body2"
            color="textPrimary"
          >
            {note}
          </Typography>
        }
      />
    </ListItem>
  )
}

export default function Notes(props: Props) {
  const { lead, nextPage, onChangeAndSave } = props
  const intl = useIntl()
  const formatMessage = intl.formatMessage.bind(intl)
  const { resource } = useResourceContext()

  return (
    <Grid item xs={12}>
      <Grid container spacing={1} style={{ padding: 8 }}>
        <PageHeader title="NOTES" />

        <Grid item xs={12}>

          <List>
            {lead.Notes.map((note, index) => {
              if (isRegisteredInternalNote(note)) {
                return (
                  <Note key={index} note={note.Note} firstname={note.UserFirstName} lastname={note.UserLastName} />
                )
              }
              return (
                <Note key={index} note={note.Note} firstname={""} lastname={""} />
              )
            })}
          </List>
        </Grid>

        <Formik<FormValues>
          initialValues={{
            Note: ""
          }}
          onSubmit={async (values) => {
            const notes = [...lead.Notes, values]

            await onChangeAndSave({ ...lead, Notes: notes })

            console.log("hi")
            return
          }}
        >
          {() => (
            <Form>
              <FormikTextField<FormValues> name="Note" multiline />

              <FormikSubmit label={formatMessage({id: "COMMENT"})} />
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  )
}
