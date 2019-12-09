import * as React from "react"

import { ListItem, List, ListItemSecondaryAction, IconButton, Grid, ListItemText, TextField, MenuItem } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import { ArrayHelpers, FieldProps, FieldArray } from "formik"
import { ICarType } from "../../interfaces/ICompany";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import { ICarAmount } from "../../interfaces/IConditions";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"

export interface FormikGroupListProps {
  carTypes: ICarType[]
}

type Props = FormikGroupListProps & Omit<FieldProps, "label"> & InjectedIntlProps

interface State {
  selectedCarType: number | null
}

class FormikGroupList extends React.PureComponent<Props, State> {
  state: State = {
    selectedCarType: null,
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsedString = parseInt(event.target.value)
    if (!Number.isNaN(parsedString)) {
      this.setState({ selectedCarType: parsedString })
    }
  }

  public render() {
    const {
      carTypes,
      form: { isSubmitting, values },
      field: { name, value },
      intl,
    } = this.props

    const { selectedCarType } = this.state

    const parsedCarAmounts = value as ICarAmount[]

    return (
      <Grid item xs={12} md={6}>
        <FieldArray
          name={name}
          render={arrayHelpers => (
            <List dense>
              {parsedCarAmounts.map(car => (
                <ListItem key={car.CarType.CarTypeId}>
                  <ListItemText primary={car.Amount + "x " + intl.formatMessage({ id: car.CarType.NameTextKey })} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => this.removeCar(arrayHelpers, car.CarType.CarTypeId)}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}

              <ListItem>
                <ListItemText
                  primary={
                    <TextField select label="Select" value={selectedCarType === null ? "" : selectedCarType} onChange={this.handleChange}>
                      {carTypes.map(carType => (
                        <MenuItem key={carType.CarTypeId} value={carType.CarTypeId}>
                          <FormattedMessage id={carType.NameTextKey} />
                        </MenuItem>
                      ))}
                    </TextField>
                  }
                />

                <ListItemSecondaryAction>
                  <IconButton disabled={isSubmitting || !selectedCarType} onClick={() => this.addCar(arrayHelpers)} edge="end">
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

  removeCar = (arrayHelpers: ArrayHelpers, removeId: number) => {
    const {
      carTypes,
      field: { value },
    } = this.props

    const parsedCarAmounts = value as ICarAmount[]

    const index = parsedCarAmounts.findIndex(car => car.CarType.CarTypeId === removeId)
    const car = parsedCarAmounts[index]

    if(car.Amount > 1) {
      arrayHelpers.replace(index, { ...car, Amount: car.Amount - 1 })
    } else {
      arrayHelpers.remove(index)
    }
  }

  addCar = (arrayHelpers: ArrayHelpers) => {
    const {
      carTypes,
      field: { value },
    } = this.props
    const { selectedCarType } = this.state
    const parsedCarAmounts = value as ICarAmount[]

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

    this.setState({ selectedCarType: null })
  }
}

export default injectIntl(FormikGroupList)
