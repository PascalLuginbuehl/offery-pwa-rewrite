import * as React from "react"

import { ListItem, List, ListItemSecondaryAction, IconButton, Grid, ListItemText, TextField, MenuItem } from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"
import AddIcon from "@material-ui/icons/Add"
import { ArrayHelpers, FieldProps, FieldArray } from "formik"
import { ICarType } from "../../interfaces/ICompany";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import { ICarAmount } from "../../interfaces/IConditions";


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
    if(!Number.isNaN(parsedString)) {
      this.setState({ selectedCarType: parsedString })
    }
  }

  public render() {
    const {
      carTypes,
      form: { isSubmitting, values },
      field: { name, value },
      intl
    } = this.props

    const { selectedCarType } = this.state

    const parsedCarAmounts = value as ICarAmount[]

    return (
      <Grid item xs={12} md={6}>
        <FieldArray
          name={name}
          render={arrayHelpers => (
            <List>
              {parsedCarAmounts.map(car => (
                <ListItem>
                  <ListItemText primary={intl.formatMessage({ id: car.CarType.NameTextKey })} secondary={car.Amount} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}

              <ListItem>
                <ListItemText
                  primary={
                    <TextField
                      select
                      label="Select"
                      value={selectedCarType === null ? "" : selectedCarType}
                      onChange={this.handleChange}
                    >
                      {carTypes.map(carType => (
                        <MenuItem key={carType.CarTypeId} value={carType.CarTypeId}>
                          <FormattedMessage id={carType.NameTextKey} />
                        </MenuItem>
                      ))}
                    </TextField>
                  }
                />

                <ListItemSecondaryAction>
                  <IconButton disabled={isSubmitting} onClick={() => this.addCar(arrayHelpers)}>
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

  removeCar = () => {}

  addCar = (arrayHelpers: ArrayHelpers) => {
    this.props.carTypes.find(() => this.state.selectedCarType)
    arrayHelpers.push({ CarType: "" })
  }
}

export default injectIntl(FormikGroupList)
