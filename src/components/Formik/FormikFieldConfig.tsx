import { FieldValidator, useField, useFormikContext, FieldInputProps, FieldMetaProps, FieldHelperProps } from "formik"

export interface FormikFieldConfig<FormValues> {
    validate?: FieldValidator
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // innerRef?: (instance: any) => void

    name: keyof FormValues & string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (event: React.ChangeEvent<any>) => void
    enableAutoSubmit?: boolean
}


export default function useFormikField<Val, FormValues>(props: FormikFieldConfig<FormValues>): [FieldInputProps<Val>, FieldMetaProps<Val>, FieldHelperProps<Val>] {
    const { onChange, enableAutoSubmit } = props

    const [{ onChange: onChangeField, ...field }, meta, helpers] = useField<Val>(props)
    const { submitForm } = useFormikContext()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (event: React.ChangeEvent<any>) => {
        onChangeField(event)

        // Custom on change, additional to valueChange of Formik. Optional Property to get the Event
        if (onChange) {
            onChange(event)
        }

        if (enableAutoSubmit) {
            submitForm()
        }
    }

    return [{...field, onChange: handleChange}, meta, helpers]
}
