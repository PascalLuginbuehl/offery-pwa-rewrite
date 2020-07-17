import React, { useState } from "react"
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
import { Formik } from "formik"
import { FormikTextField, FormikSubmit } from "../../../components/Formik"
import PersonIcon from "@material-ui/icons/Person"
import { useResourceContext } from "../../../providers/withResource"
import FormikActions from "../../../components/Formik/FormikActions"
import Form from "../../../components/FormikFields/Form"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import { useFormattedName } from "../../../utils"
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

interface NoteTextFieldProps {
  noteValue: RegisterInternalNote
  onSave: (note: RegisterInternalNote) => Promise<any>
}

export function NoteTextField(props: NoteTextFieldProps) {
  const { onSave, noteValue } = props

  return (
    <Formik<FormValues>
      initialValues={noteValue}
      onSubmit={onSave}
    >
      {() => (
        <Form disableSubmit disableGridContainer>
          <FormikTextField<FormValues> name="Note" multiline label="NOTE" />

          <FormikActions>
            <FormikSubmit label="SUBMIT_NOTE" />
          </FormikActions>
        </Form>
      )}
    </Formik>
  )
}

interface NoteProps {
  note: RegisterInternalNote | InternalNote
  onEdit: (note: RegisterInternalNote) => Promise<any>
}

export function Note(props: NoteProps) {
  const { note, onEdit } = props
  const formatName = useFormattedName()
  const { resource } = useResourceContext()

  const [ editing, setEditing ] = useState<boolean>(false)

  let [Firstname, Lastname] = ["User not found", ""]

  if (isRegisteredInternalNote(note)) {
    Firstname = note.UserFirstName
    Lastname = note.UserLastName
  }

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={formatName({ Firstname, Lastname })}>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography>
            {formatName({ Firstname, Lastname })}

            {(isRegisteredInternalNote(note) ? resource?.CurrentUser.Id == note.UserId : true) ? (
              <Typography
                component="span"
                variant="caption"
                onClick={() => setEditing(true)}
              >
                EDIT
              </Typography>
            ) : null}

          </Typography>
        }
        secondary={
          editing ? (
            <NoteTextField
              noteValue={note}
              onSave={async (note) => {
                await onEdit(note)

                setEditing(false)

                return
              }}
            />
          ) : (
            <Typography
              component = "span"
              variant = "body2"
              color = "textPrimary"
              style = {{ whiteSpace: "pre-wrap" }}
            >
              {note.Note}
            </Typography>
          )
        }
      />
    </ListItem>
  )
}

export default function Notes(props: Props) {
  const { lead, nextPage, onChangeAndSave } = props
  const intl = useIntl()
  const formatMessage = intl.formatMessage.bind(intl)

  return (
    <Grid item xs={12}>
      <Grid container spacing={1} style={{ padding: 8 }}>
        <PageHeader title="NOTES" />

        <Grid item xs={12}>

          <List>
            {lead.Notes.map((note, index) => (
              <Note key={index} note={note} onEdit={async (note) => {
                const notes = [...lead.Notes]
                notes[index] = note

                await onChangeAndSave({ ...lead, Notes: notes })

                return
              }} />
            ))}
          </List>
        </Grid>

        <FormikGroups label="NEW_COMMENT" xs={12}>
          <Grid item xs={12}>
            <NoteTextField
              noteValue={{ Note: "" }}
              onSave={async (note) => {
                const notes = [...lead.Notes, note]

                await onChangeAndSave({ ...lead, Notes: notes })

                return
              }}
            />
          </Grid>
        </FormikGroups>
      </Grid>
    </Grid>
  )
}
