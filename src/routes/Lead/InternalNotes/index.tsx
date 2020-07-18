import React, { useState } from "react"
import { Link, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, ListItemAvatar, Avatar, Tooltip } from "@material-ui/core"
import PageHeader from "../../../components/PageHeader"
import HomeIcon from "@material-ui/icons/Home"
import { useRouteMatch } from "react-router"
import { IBuilding } from "../../../interfaces/IBuilding"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import DeleteIcon from "@material-ui/icons/Delete"
import { useIntl, FormattedDate } from "react-intl"
import FormikMockSubmit from "../../../components/FormikFields/FormikMockSubmit"
import LeadAPI from "../LeadAPI"
import { IPostLead } from "../../../interfaces/ILead"
import { Formik, FormikHelpers } from "formik"
import { FormikTextField, FormikSubmit } from "../../../components/Formik"
import PersonIcon from "@material-ui/icons/Person"
import { useResourceContext } from "../../../providers/withResource"
import FormikActions from "../../../components/Formik/FormikActions"
import Form from "../../../components/FormikFields/Form"
import FormikGroups from "../../../components/FormikFields/Bundled/Groups"
import { useFormattedName } from "../../../utils"
import { RegisterInternalNoteModel, InternalNoteModel } from "../../../models/InternalNoteModel"
interface Props {
  nextPage: () => void
  onChangeAndSave: (lead: IPostLead) => Promise<void>
  lead: IPostLead
}

type FormValues = RegisterInternalNoteModel

const isRegisteredInternalNote = (note: InternalNoteModel | RegisterInternalNoteModel): note is InternalNoteModel => {
  if (Object.prototype.hasOwnProperty.call(note, "InternalNoteId")) {
    return true
  }

  return false
}

interface NoteTextFieldProps {
  noteValue: RegisterInternalNoteModel
  onSave: (note: RegisterInternalNoteModel, helpers: FormikHelpers<RegisterInternalNoteModel>) => Promise<any>
}

export function NoteTextField(props: NoteTextFieldProps) {
  const { onSave, noteValue } = props

  return (
    <Formik<FormValues>
      initialValues={noteValue}
      onSubmit={onSave}
    >
      {() => (
        <Form disableSubmit disableGridContainer style={{display: "flex", alignItems: "center"}}>
          <FormikTextField<FormValues>
            name="Note"
            multiline
            label="NOTE"
          />

          <div style={{ paddingLeft: 8 }}>
            <FormikSubmit label="SUBMIT_NOTE" />
          </div>
        </Form>
      )}
    </Formik>
  )
}

interface NoteProps {
  note: RegisterInternalNoteModel | InternalNoteModel
  onEdit: (note: RegisterInternalNoteModel) => Promise<any>
}

export function Note(props: NoteProps) {
  const { note, onEdit } = props
  const formatName = useFormattedName()
  const { resource } = useResourceContext()

  const [ editing, setEditing ] = useState<boolean>(false)

  if (!resource) {
    throw new Error("Resource not defined")
  }

  let {FirstName, LastName} = resource.CurrentUser

  if (isRegisteredInternalNote(note)) {
    FirstName = note.UserFirstName
    LastName = note.UserLastName
  }

  return (
    <ListItem alignItems="flex-start" disableGutters>
      <ListItemAvatar>
        <Avatar alt={formatName({ Firstname: FirstName, Lastname: LastName })}>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography>
            {formatName({ Firstname: FirstName, Lastname: LastName })}

            {isRegisteredInternalNote(note) ? (
              <>
                &nbsp;
                &ndash;
                &nbsp;
                <Typography
                  component="span"
                  variant="caption"
                  color="textSecondary"
                >
                  <FormattedDate
                    day="numeric"
                    month="numeric"
                    year="numeric"
                    hour="numeric"
                    minute="numeric"
                    value={note.CreatedDate}
                  />
                </Typography>
              </>
            ) : null}

            {isRegisteredInternalNote(note) && note.ChangedDate !== note.CreatedDate ?
              <>
                &nbsp;
                &ndash;
                &nbsp;
                <Tooltip title={<FormattedDate
                  day="numeric"
                  month="numeric"
                  year="numeric"
                  hour="numeric"
                  minute="numeric"
                  value={note.ChangedDate}
                />}>
                  <Typography
                    component="span"
                    variant="caption"
                    color="textSecondary"
                  >
                    EDITED
                  </Typography>
                </Tooltip>
              </>
              : null
            }

            {(isRegisteredInternalNote(note) ? resource.CurrentUser.Id === note.UserId : true) ? (
              <>
                &nbsp;
                &ndash;
                &nbsp;
                <Typography
                  component={Link}
                  variant="caption"
                  color="textSecondary"
                  onClick={() => setEditing(!editing)}
                >
                  EDIT
                </Typography>
              </>
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

        <FormikGroups label="NEW_COMMENT" xs={12}>
          <Grid item xs={12}>
            <NoteTextField
              noteValue={{ Note: "" }}
              onSave={async (note, helpers) => {
                const notes = [...lead.Notes, note]

                await onChangeAndSave({ ...lead, Notes: notes })

                helpers.resetForm()

                return
              }}
            />
          </Grid>
        </FormikGroups>

        <Grid item xs={12}>
          <List dense>
            {lead.Notes.reverse().map((note, index) => (
              <Note key={index} note={note} onEdit={async (note) => {
                const notes = [...lead.Notes]
                notes[index] = note

                await onChangeAndSave({ ...lead, Notes: notes })

                return
              }} />
            ))}
          </List>
        </Grid>
      </Grid>
    </Grid>
  )
}
