import React, { useState } from "react"
import { Link, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, ListItemAvatar, Avatar, Tooltip } from "@material-ui/core"
import PageHeader, { NewPageHeader } from "../../../components/PageHeader"
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
import { useTranslation } from "react-i18next"
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
  initialNoteValue?: RegisterInternalNoteModel
  onSave: (note: RegisterInternalNoteModel, helpers: FormikHelpers<RegisterInternalNoteModel>) => Promise<any>
}

export function NoteTextField(props: NoteTextFieldProps) {
  const { onSave, initialNoteValue } = props
  const { t } = useTranslation()

  return (
    <Formik<FormValues>
      initialValues={initialNoteValue ?? { Note: "" }}
      onSubmit={onSave}
    >
      {() => (
        <Form disableSubmit disableGridContainer style={{display: "flex", alignItems: "center"}}>
          <FormikTextField<FormValues>
            name="Note"
            multiline
            label={initialNoteValue ? t("NOTES.NOTE") : t("NOTES.NEW_COMMENT")}
          />

          <div style={{ paddingLeft: 8 }}>
            <FormikSubmit label={t("NOTES.SUBMIT_NOTE")} />
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
  const { t } = useTranslation()

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
                    {t("NOTES.EDITED")}
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
                  {t("NOTES.EDIT")}
                </Typography>
              </>
            ) : null}

          </Typography>
        }
        secondary={
          editing ? (
            <NoteTextField
              initialNoteValue={note}
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
  const { t } = useTranslation()

  return (
    <div style={{padding: 8}}>
      <NewPageHeader title={t("NOTES.NOTES")} />

      <NoteTextField
        onSave={async (note, helpers) => {
          const notes = [...lead.Notes, note]

          await onChangeAndSave({ ...lead, Notes: notes })

          helpers.resetForm()

          return
        }}
      />

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
    </div>
  )
}
