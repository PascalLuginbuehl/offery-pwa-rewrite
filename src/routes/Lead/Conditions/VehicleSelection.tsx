import React, { useState } from "react"

import { ListItem, List, ListItemSecondaryAction, IconButton, Grid, ListItemText, TextField, MenuItem, Menu, Button, Typography } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import { ArrayHelpers, FieldProps, FieldArray, useFormikContext } from "formik"
import { ICarType } from "../../../interfaces/ICompany"
import { FormattedMessage, injectIntl, WrappedComponentProps, useIntl } from "react-intl"
import { ICarAmount } from "../../../interfaces/IConditions"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import { string } from "yup"
import { useFormikField, FormikFieldConfig } from "../../../components/Formik"
import LocalShippingIcon from "@material-ui/icons/LocalShipping"
import { useTranslation } from "react-i18next"
import FormikDivider from "../../../components/FormikFields/FormikDivider"

interface FormikVehicleSelectionProps<FormValues> extends FormikFieldConfig<FormValues> {
  carTypes: ICarType[]
  label: string
}

export default function FormikVehicleSelection<FormValues>(props: FormikVehicleSelectionProps<FormValues>) {
  const {
    carTypes,
    label,
  } = props

  const [field, meta, helpers] = useFormikField<ICarAmount[], FormValues>(props)

  const intl = useIntl()
  const { value } = field
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { t } = useTranslation()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
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

  function addCar(arrayHelpers: ArrayHelpers, selectedCarTypeId: number) {
    const parsedCarAmounts = value

    const index = parsedCarAmounts.findIndex(car => car.CarType.CarTypeId === selectedCarTypeId)

    if (index !== -1) {
      const car = parsedCarAmounts[index]

      arrayHelpers.replace(index, { ...car, Amount: car.Amount + 1 })
    } else {
      const carType = carTypes.find(car => car.CarTypeId === selectedCarTypeId)

      if (carType) {
        const newCar: ICarAmount = { Amount: 1, CarType: carType }
        arrayHelpers.push(newCar)
      }
    }

    handleClose()
  }

  return (
    <>
      <FormikDivider />
      <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
        {label}
      </Typography>

      <FieldArray
      // eslint-disable-next-line react/prop-types
        name={props.name}
        render={arrayHelpers => (
          <List dense disablePadding>
            {value.length === 0 ? (
              <ListItem dense disableGutters>
                <ListItemText primary={t("VEHICLE_SELECTION.NOTHING_SELECTED")} />
              </ListItem>
            ) : null}

            {value.map(car => (
              <ListItem key={car.CarType.CarTypeId} dense disableGutters>
                <ListItemText primary={car.Amount + "x " + intl.formatMessage({ id: car.CarType.NameTextKey })} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeCar(arrayHelpers, car.CarType.CarTypeId)}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}

            <ListItem dense disableGutters>
              <ListItemText
                primary={
                  <>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} variant="outlined" endIcon={<LocalShippingIcon />}>
                      {t("VEHICLE_SELECTION.ADD")}
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      {carTypes.map(carType => (
                        <MenuItem key={carType.CarTypeId} value={carType.CarTypeId} onClick={() => addCar(arrayHelpers, carType.CarTypeId)}>
                          <FormattedMessage id={carType.NameTextKey} />
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                }
              />
            </ListItem>
          </List>
        )}
      />
    </>
  )
}
