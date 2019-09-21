import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow  } from '@material-ui/core'
import ResponsiveContainer from '../../components/ResponsiveContainer'
// import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import CounterTable, { Cart } from '../../components/ShopElements/CounterTable'
import GridSelect, { GridSelectItem } from '../../components/ShopElements/GridSelect'
import * as React from 'react'
import BigCheckbox from '../../components/Validator/BigCheckbox';
import { withResource, WithResourceProps } from '../../providers/withResource';
import { IPostMoveInBuilding, IPostMoveOutBuilding } from '../../interfaces/IBuilding';
import IntlTypography from '../../components/Intl/IntlTypography';
import ValidatedDatePicker from '../../components/Validator/ValidatedDatePicker';
// import TestService from 'services/TestService'
import { Formik, FormikActions, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps, ArrayHelpers, FieldArray } from 'formik';
import TextField from '../../components/FormikFields/TextField';
import Switch from '../../components/FormikFields/Switch';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/DatePicker';
import { IPutServices, emptyServices, IPutMoveService } from '../../interfaces/IService';
import MoveInBuilding from '../Customer/MoveInBuilding';
import Select from '../../components/FormikFields/Select';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';
import { IOrderPosition } from '../../interfaces/IShop';
import { IProduct } from '../../interfaces/IProduct';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Values {
  Items: IOrderPosition[]
}

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  onChangeAndSave: (data: IPutMoveService) => void
}


const CustomTableRow = withStyles(theme => ({
  [theme.breakpoints.down("sm")]: {
    root: {
      height: 24,
    },
  }
}))(TableRow)

class MoveShop extends React.Component<Props & FormikProps<Values>, {}> {
  addItemToList = (product: IProduct) => {
    const { handleChange, values } = this.props

    const order: IOrderPosition = {Amount: 1, IsForFree: false, IsRent: false, OrderPositionId: 1, ProductId: product.ProductId}

    handleChange({ target: { value: [...values.Items, order], name: "Items" } })
  }

  public render() {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      status,
      resource,
      selectedCompany,

    } = this.props

    const ShopProducts = selectedCompany.ShopProducts
    console.log()
    // const { data } = this.props

    console.log(this.props)
    return (
      <Grid item xs={12}>
        <Form>
          <Grid item xs={12}>
            <IntlTypography variant="h5">SHOP</IntlTypography>
          </Grid>



          {ShopProducts.map((e) => (
            <Button
              variant="contained"
              onClick={() => this.addItemToList(e)}
            >
              {e.NameTextKey}
            </Button>
          ))}


          <Field name="moveService.MoveDate" label="MOVE_DATE" component={DatePicker} />


          <FieldArray
            name="Items"
            render={(arrayHelpers: ArrayHelpers) => (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">QT.</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {values.Items && values.Items.length > 0 ? (
                    values.Items.map((item, index) => (

                      <CustomTableRow key={index}>
                        <TableCell>{item.ProductId}</TableCell>
                        <TableCell align="right">{item.Amount}</TableCell>
                        <TableCell align="right">
                          {/* <Button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                          >
                            -
                          </Button> */}
                        </TableCell>
                      </CustomTableRow>
                    ))
                  ) : "No items added"}
                </TableBody>
              </Table>
            )}
          />


          {/* MoveOut */}
          {/* <AddressField
            value={Address}
            name="Address"
            onChange={this.handleChange}
          /> */}

          {status && status.msg && <div>{status.msg}</div>}

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles, {name: "MoveShop"})(
  withResource(
    withFormik<Props, Values>({
      validationSchema: Yup.object().shape({
        // email: Yup.string()
        //   .email()
        //   .required(),
      }),

      mapPropsToValues: props => ({ Items: [] }),

      handleSubmit: async (values, actions) => {
        console.log(values)
        // actions.props.
        // await actions.props.onChangeAndSave(values)

        actions.setSubmitting(false)
      }

    })(MoveShop)
  )
)
