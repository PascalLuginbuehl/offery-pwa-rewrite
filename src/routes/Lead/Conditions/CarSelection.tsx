import React, { useState } from "react"

import { ListItem, List, ListItemSecondaryAction, IconButton, Grid, ListItemText, TextField, MenuItem } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import { ArrayHelpers, FieldProps, FieldArray, useFormikContext } from "formik"
import { ICarType } from "../../../interfaces/ICompany"
import { FormattedMessage, injectIntl, WrappedComponentProps, useIntl } from "react-intl"
import { ICarAmount } from "../../../interfaces/IConditions"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import { string } from "yup"
import { useFormikField, FormikFieldConfig } from "../../../components/Formik"

interface FormikVehicleSelectionProps<FormValues> extends FormikFieldConfig<FormValues> {
  carTypes: ICarType[]
}

export default function FormikVehicleSelection<FormValues>(props: FormikVehicleSelectionProps<FormValues>) {
  const [selectedCarType, setSelectedCarType] = useState<number | null>(null)
  const {
    carTypes,
  } = props

  const { isSubmitting, values } = useFormikContext()
  const [field, meta, helpers] = useFormikField<ICarAmount[], FormValues>({...props, validate: () => "not gud"})
  const intl = useIntl()
  const { value } = field

  function handleChange (event: React.ChangeEvent<HTMLInputElement>) {
    const parsedString = parseInt(event.target.value)
    if (!Number.isNaN(parsedString)) {
      setSelectedCarType(parsedString)
    }
  }

  function removeCar(arrayHelpers: ArrayHelpers, removeId: number) {
    const parsedCarAmounts = value

    const index = parsedCarAmounts.findIndex(car => car.CarType.CarTypeId === removeId)
    const car = parsedCarAmounts[index]

    if (car.Amount > 1) {
      arrayHelpers.replace(index, { ...car, Amount: car.Amount - 1 })
    } else {
      arrayHelpers.remove(index)
    }
  }

  function addCar(arrayHelpers: ArrayHelpers) {
    const parsedCarAmounts = value

    const index = parsedCarAmounts.findIndex(car => car.CarType.CarTypeId === selectedCarType)

    if (index !== -1) {
      const car = parsedCarAmounts[index]

      arrayHelpers.replace(index, { ...car, Amount: car.Amount + 1 })
    } else {
      const carType = carTypes.find(car => car.CarTypeId === selectedCarType)

      if (carType) {
        const newCar: ICarAmount = { Amount: 1, CarType: carType }
        arrayHelpers.push(newCar)
      }
    }

    setSelectedCarType(null)
  }

  return (
    <Grid item xs={12}>
      <FieldArray
        // eslint-disable-next-line react/prop-types
        name={props.name}
        render={arrayHelpers => (
          <List dense>
            {value.map(car => (
              <ListItem key={car.CarType.CarTypeId} dense>
                <ListItemText primary={car.Amount + "x " + intl.formatMessage({ id: car.CarType.NameTextKey })} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeCar(arrayHelpers, car.CarType.CarTypeId)}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}

            <ListItem>
              <ListItemText
                primary={
                  <TextField select label="Select" value={selectedCarType === null ? "" : selectedCarType} onChange={handleChange}>
                    {carTypes.map(carType => (
                      <MenuItem key={carType.CarTypeId} value={carType.CarTypeId}>
                        <FormattedMessage id={carType.NameTextKey} />
                      </MenuItem>
                    ))}
                  </TextField>
                }
              />

              <ListItemSecondaryAction>
                <IconButton disabled={isSubmitting || !selectedCarType} onClick={() => addCar(arrayHelpers)} edge="end">
                  <AddIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        )}
      />
    </Grid>
  )
}
