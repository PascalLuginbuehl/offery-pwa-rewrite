import React from "react"

import { Theme, makeStyles } from "@material-ui/core"
import { ListItem, List, ListItemSecondaryAction, IconButton } from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"
import AddIcon from "@material-ui/icons/Add"
import { ArrayHelpers, FieldArray, useFormikContext } from "formik"


const useStyles = makeStyles((theme: Theme) => ({
    extendedGutter: {
        paddingRight: theme.spacing(8), // default: 6
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    }
}))

export interface FormikGroupListOriginalIndex {
    originalIndex: number
}

export interface FormikGroupListProps<FormValues, GroupItemType extends FormikGroupListOriginalIndex> {
    listItems: GroupItemType[]
    renderListOption: (option: GroupItemType) => React.ReactNode
    renderSelectField: () => React.ReactNode
    selectFieldName: keyof FormValues & string

    enableAutoSubmit?: boolean
    name: keyof FormValues & string
}

export default function FormikGroupList<FormValues, GroupItemType extends FormikGroupListOriginalIndex>(props: FormikGroupListProps<FormValues, GroupItemType>) {
    const {
        listItems,
        renderListOption,
        renderSelectField,
        selectFieldName,
        enableAutoSubmit,

        name
    } = props

    const classes = useStyles()

    const { setFieldValue, submitForm, values, isSubmitting } = useFormikContext<FormValues>()

    const selectFieldValue = values[selectFieldName]


    async function deteleSelectedItem(itemIndex: number, arrayHelpers: ArrayHelpers): Promise<void> {
        //console.debug(`deteleSelectedItem: itemIndex=${itemIndex}`)
        arrayHelpers.remove(itemIndex)

        if (enableAutoSubmit) {
            await submitForm()
        }
    }

    async function addSelectedItem(arrayHelpers: ArrayHelpers): Promise<void> {

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const selectFieldValue: string = values[selectFieldName]

        if (selectFieldValue) {
            const parsed = parseInt(selectFieldValue)

            if (isNaN(parsed)) {
                throw new Error("select field value isNaN: " + selectFieldValue)
            }

            //console.debug(`addSelectedItem: parsed=${parsed}`)
            arrayHelpers.push(parsed)

            setFieldValue(selectFieldName, null)

            if (enableAutoSubmit) {
                await submitForm()
            }
        }
    }


    return (
        <FieldArray
            name={name}
            render={arrayHelpers => (
                <List dense>
                    {listItems.map((item, itemIndex) => (
                        <ListItem key={itemIndex} dense>
                            {renderListOption(item)}
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" size="small" onClick={() => deteleSelectedItem(item.originalIndex, arrayHelpers)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                    <ListItem disableGutters classes={{ root: classes.extendedGutter }}>
                        {renderSelectField()}

                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="add" disabled={isSubmitting || !selectFieldValue} onClick={() => addSelectedItem(arrayHelpers)}>
                                <AddIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            )}
        />
    )
}
