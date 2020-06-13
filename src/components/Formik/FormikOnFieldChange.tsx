import React from "react"
import { useFormikContext } from "formik"

// from https://github.com/guiyep/formik-form-callbacks
export interface FormikOnFieldChangeProps {
  fields: string[]
  onChange: (values: {[key: string]: any}) => void
}

const FormikOnFieldChange = React.memo(({ onChange, fields }: FormikOnFieldChangeProps) => {
  const formik = useFormikContext()
  const didMount = React.useRef(false)

  React.useEffect(() => {
    if (didMount.current) {
      const values = fields.reduce<{[key: string]: any}>((acc, fieldName) => {
        acc[fieldName] =  formik.getFieldMeta(fieldName)?.value
        return acc
      }, {})
      onChange(values)
    } else didMount.current = true
  }, [...fields.map(field => formik.getFieldMeta(field).value)])
  return null
})

export default FormikOnFieldChange
