import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Toolbar, Divider, Chip, Typography,  } from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import IntlTypography from "../../../components/Intl/IntlTypography"
import { FormikProps, withFormik, ArrayHelpers, FieldArray, Formik, Field } from "formik"
import * as Yup from "yup"
import Form from "../../../components/FormikFields/Form"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import { FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl"
import InventoryCategoryFolder from "../../../components/Inventory/InventoryCategoryFolder"
import { IFurnitureCategory, IFurniture, IFurnitureTranslated } from "../../../interfaces/IResource"
import InventoryItems from "../../../components/Inventory/InventoryItems"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import chunk from "chunk"
import SwipeableViews from "react-swipeable-views"
import withWidth, { WithWidthProps, isWidthDown } from "@material-ui/core/withWidth"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked"
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked"
import { IInventars, InventoryKeysEnum, IInventar, ICustomInventar } from "../../../interfaces/IInventars"
import clsx from "clsx"
import PageHeader from "../../../components/PageHeader"
import CustomInventory from "./CustomInventory"
import EditIcon from "@material-ui/icons/Edit"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import Fuse, { FuseOptions } from "fuse.js"
import { debounce } from "debounce"

const styles = (theme: Theme) =>
  createStyles({
    next: {
      position: "absolute",
    },
    nextLeft: {
      left: 0,
    },
    nextRight: {
      right: 0,
    },
    centeredNavigationContainer: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
    },
    buttonSmallPadding: {
      padding: 5,
      paddingLeft: 15,
    },
    searchInput: {
      paddingLeft: 15,
    }
  })

const fuseOptions: FuseOptions<IFurnitureTranslated> = {
  threshold: 0.1,
  location: 0,
  tokenize: true,
  distance: 2,

  maxPatternLength: 32,
  minMatchCharLength: 4,
  keys: [
    {name: "DisplayName", weight: 1.0},
  ]
}

interface _IProps extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps, WithWidthProps {
  onChangeAndSave: (data: IInventars) => Promise<void>
  initalInventoryTypeKey: InventoryKeysEnum
  inventory: IInventars
  nextPage: () => void
}

interface _IState {
  currentlyOpenInventory: InventoryKeysEnum
  selectedFurnitureCategory: IFurnitureCategory | null
  filteredFurnitures: IFurnitureTranslated[]
  customItemModelOpen: boolean
  editCustomItemIndex: number | null
  pageIndex: number
  fuse: Fuse<IFurnitureTranslated, typeof fuseOptions> | null
}

interface AutoSubmitProps {
  values: any
  submitForm: () => void
}

const AutoSubmit: React.FC<AutoSubmitProps> = ({ values, submitForm }) => {
  type deboundeFunctionType = () => void

  const [debounceFunction, setDebounceFunction] = React.useState<null | deboundeFunctionType>(null)

  React.useEffect(() => {
    setDebounceFunction(() => debounce(() => { submitForm() }, 500))
  }, [submitForm])

  React.useEffect(() => {
    if (debounceFunction) {
      debounceFunction()
    }
  }, [values, submitForm])


  return null
}

class Inventory extends React.Component<_IProps & FormikProps<IInventars>, _IState> {
  state: _IState = {
    currentlyOpenInventory: InventoryKeysEnum.Move,
    selectedFurnitureCategory: null,
    filteredFurnitures: [],
    fuse: null,
    pageIndex: 0,
    customItemModelOpen: false,
    editCustomItemIndex: null
  }

  constructor(props: _IProps & FormikProps<IInventars>) {
    super(props)

    this.state.currentlyOpenInventory = props.initalInventoryTypeKey
  }

  handleTabChange = (e: React.ChangeEvent<{}>, value: InventoryKeysEnum) => {
    this.setState({ currentlyOpenInventory: value })
  }

  componentDidMount() {
    const { resource } = this.props
    const fcatAll = resource.FurnitureCategories.find(c => c.NameTextKey === "FCATALL")

    if (fcatAll) {
      const translatedFurnitures: IFurnitureTranslated[] = this.toTranslatedFurnitures(fcatAll.Furnitures)
      this.setState({ filteredFurnitures: translatedFurnitures, fuse: new Fuse(translatedFurnitures, fuseOptions)})
    }
  }

  openCatergory = (category: IFurnitureCategory | null) => {
    if (category === null) {
      this.setState({ selectedFurnitureCategory: null, pageIndex: 0 })
    } else {
      const translatedFurnitures: IFurnitureTranslated[] = this.toTranslatedFurnitures(category.Furnitures)
      this.setState({ pageIndex: 0, selectedFurnitureCategory: category, filteredFurnitures: translatedFurnitures, fuse: new Fuse(translatedFurnitures, fuseOptions)})
    }
  }

  toTranslatedFurnitures(furnitures: IFurniture[]): IFurnitureTranslated[] {
    const { intl } = this.props
    return furnitures.map((furniture) => {
      const fTranslated: IFurnitureTranslated = {
        ...furniture,
        DisplayName: intl.formatMessage({ id: furniture.NameTextKey })
      }
      return fTranslated
    })
  }

  addFurniture = (furniture: IFurniture, arrayHelpers: ArrayHelpers, selectedSizeId: number | null, selectedMaterialId: number | null) => {
    const { handleChange, values } = this.props
    const { currentlyOpenInventory } = this.state

    const items = this.getSelectedList()

    const itemIndex = items.findIndex(item => {
      if (item.FurnitureId == furniture.FurnitureId) {
        if (item.FSize ? item.FSize.FSizeId : null != selectedSizeId) {
          return false
        }
        if (item.FMaterial ? item.FMaterial.FMaterialId : null != selectedMaterialId) {
          return false
        }

        return true
      }
    })

    // Item not found
    if (itemIndex === -1) {
      const size = furniture.FSizes.find(size => size.FSizeId == selectedSizeId)
      const material = furniture.FMaterials.find(material => material.FMaterialId == selectedMaterialId)

      const order: IInventar = {
        Amount: 1,
        FSize: size ? size : null,
        FMaterial: material ? material : null,
        FurnitureId: furniture.FurnitureId,
      }

      arrayHelpers.push(order)
    } else {
      const item = items[itemIndex]
      arrayHelpers.replace(itemIndex, { ...item, Amount: item.Amount + 1 })
    }
  }

  handleChangeIndex = (index: number) => {
    const { selectedFurnitureCategory, filteredFurnitures } = this.state

    if (selectedFurnitureCategory) {
      const pages = Math.ceil(filteredFurnitures.length / (this.getBreakpointWith() * 3))
      if (index >= 0 && index < pages) {
        this.setState({
          pageIndex: index,
        })
      }
    }
  }

  handleChangeIndexPrepared = (index: number) => () => this.handleChangeIndex(index)

  getBreakpointWith = () => {
    const { width } = this.props
    if (width) {
      if (width == "lg") {
        return 6
      } else if (isWidthDown(width, "sm")) {
        return 4
      }
    }
    // default 3 xs
    return 3
  }

  getSelectedList = (): IInventar[] => {
    const { values } = this.props
    const { currentlyOpenInventory } = this.state

    return values[currentlyOpenInventory]
  }

  getCustomSelectedList = (): ICustomInventar[] => {
    const { values } = this.props
    const { currentlyOpenInventory } = this.state

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    return values["Custom" + currentlyOpenInventory]
  }

  getCorrespondingFurnitureItem = (item: IInventar): IFurniture => {
    const {
      resource: { FurnitureCategories },
    } = this.props

    for (let categoryIndex = 0; categoryIndex < FurnitureCategories.length; categoryIndex++) {
      const category = FurnitureCategories[categoryIndex]

      for (let furnitureIndex = 0; furnitureIndex < category.Furnitures.length; furnitureIndex++) {
        const furniture = category.Furnitures[furnitureIndex]

        if (furniture.FurnitureId == item.FurnitureId) {
          return furniture
        }
      }
    }

    throw new Error("Furniture not found")
  }

  removeOneitem = (item: IInventar, index: number, arrayHelpers: ArrayHelpers) => {
    if (item.Amount > 1) {
      arrayHelpers.replace(index, { ...item, Amount: item.Amount - 1 })
    } else {
      arrayHelpers.remove(index)
    }
  }

  openCreateCustomModal = ()=> {
    this.setState({customItemModelOpen: true})
  }

  saveCustomItem = (index: number, arrayHelpers: ArrayHelpers) => (item: ICustomInventar) => {
    console.log(item, index)
    arrayHelpers.replace(index, item)

    this.setState({ editCustomItemIndex: null})
  }

  closeCustomItemModal = () => {
    this.setState({customItemModelOpen: false})
  }

  onCreateItem = (arrayHelpers: ArrayHelpers) => (customInventar: ICustomInventar) => {
    arrayHelpers.push(customInventar)

    this.setState({ customItemModelOpen: false })
  }

  filterFurnitures = (searchString: string) => {
    console.log("filter called")
    const { resource } = this.props
    const { selectedFurnitureCategory, fuse } = this.state
    const fcat = selectedFurnitureCategory || resource.FurnitureCategories.find(c => c.NameTextKey === "FCATALL")

    if (!fuse) return

    if (fcat)
    {
      if (searchString && searchString.length > 0)
      {
        this.openCatergory(fcat)
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const result: IFurnitureTranslated[] = fuse.search(searchString.trim())
        this.setState({ filteredFurnitures: result, pageIndex: 0 })
        return
      }
      this.setState({ filteredFurnitures: this.toTranslatedFurnitures(fcat.Furnitures) })
    }
  }

  public render() {
    const { resource, selectedCompany, intl, width, classes, values } = this.props

    const selectedItemList = this.getSelectedList()
    const selectedCustomItemList = this.getCustomSelectedList()

    const { currentlyOpenInventory, selectedFurnitureCategory, filteredFurnitures, pageIndex, customItemModelOpen, editCustomItemIndex } = this.state
    const FurnitureCategories = resource.FurnitureCategories
    console.log(editCustomItemIndex)
    return (
      <Grid item xs={12}>
        <PageHeader title="INVENTORY" />
        <Grid item xs={12}>
          <Toolbar disableGutters variant="dense">
            {selectedFurnitureCategory ? (
              <IconButton
                onClick={() => this.openCatergory(null)}
                classes={{ root: classes.buttonSmallPadding }}
              >
                <ArrowBackIcon />
              </IconButton>
            )
              : null
            }
            &nbsp;
            <IntlTypography variant="h6">{selectedFurnitureCategory ? selectedFurnitureCategory.NameTextKey : "SELECT_CATEGORY"}</IntlTypography>
          </Toolbar>
          <Divider />

          <Formik
            initialValues={{
              search: "",
              status : "",
            }}

            onSubmit={( { search }, actions ) => {
              this.filterFurnitures(search)
              actions.setSubmitting(false)
            }}
          >
            {({submitForm, values}) => (
              <Grid container spacing={1} classes={{ root: classes.searchInput }}>
                <Field autoComplete="off" component={FormikTextField} name="search" label="SEARCHFURNITUREDIRECT" disabled={false} overrideGrid={{ xs: 11 }} />
                <AutoSubmit values={values} submitForm={submitForm} />
              </Grid>
            )}
          </Formik>
        </Grid>

        <Form>
          <Grid item xs={12} style={{ width: "calc(7vw - 5px)" }}>
            {!selectedFurnitureCategory ?
              <Grid container spacing={1}>
                {FurnitureCategories.map((category, index) => (
                  <InventoryCategoryFolder category={category} onSelect={() => this.openCatergory(category)} key={index} />
                ))}

                {/* Ugly way to display another button, this is not a furniture */}
                <InventoryCategoryFolder category={{Furnitures: [], FurnitureCategoryId: 1, NameTextKey: "CUSTOM_ITEM"}} onSelect={() => this.openCreateCustomModal()}/>

              </Grid>
              :
              <FieldArray
                name={currentlyOpenInventory}
                render={(arrayHelpers: ArrayHelpers) => (
                  <>
                    <SwipeableViews index={pageIndex} onChangeIndex={this.handleChangeIndex}>
                      {chunk(
                        filteredFurnitures.map((furniture, index) => (
                          <InventoryItems
                            furniture={furniture}
                            onSelect={(selectedSizeId: number | null, selectedMaterialId: number | null) =>
                              this.addFurniture(furniture, arrayHelpers, selectedSizeId, selectedMaterialId)
                            }
                            key={index}
                          />
                        )),
                        this.getBreakpointWith() * 3)
                        .map((chunkedItems, index) => (<div key={index}><Grid style={{ margin: 0, width: "100%" }} container spacing={1}>{chunkedItems}</Grid></div>)
                        )
                      }
                    </SwipeableViews>

                    <div className={classes.centeredNavigationContainer}>
                      <IconButton onClick={this.handleChangeIndexPrepared(pageIndex - 1)} size="small" className={clsx(classes.next, classes.nextLeft)}>
                        <ChevronLeftIcon />
                      </IconButton>
                      {new Array(Math.ceil(filteredFurnitures.length / (this.getBreakpointWith() * 3))).fill(null).map((e, i) => {
                        if (pageIndex == i) {
                          return <RadioButtonCheckedIcon key={i} onClick={this.handleChangeIndexPrepared(i)} />
                        } else {
                          return <RadioButtonUncheckedIcon key={i} onClick={this.handleChangeIndexPrepared(i)} />
                        }
                      })}
                      <IconButton onClick={this.handleChangeIndexPrepared(pageIndex + 1)} size="small" className={clsx(classes.next, classes.nextRight)}>
                        <ChevronRightIcon />
                      </IconButton>
                    </div>
                  </>
                )}
              />
            }
          </Grid>

          <Grid item xs={12}>
            <Tabs value={currentlyOpenInventory} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth" centered>
              <Tab label={intl.formatMessage({ id: "MOVE" })} value={InventoryKeysEnum.Move} />
              <Tab label={intl.formatMessage({ id: "DISPOSAL" })} value={InventoryKeysEnum.Disposal} />
              <Tab label={intl.formatMessage({ id: "STORAGE" })} value={InventoryKeysEnum.Storage} />
            </Tabs>
          </Grid>

          <FieldArray
            name={"Custom" + currentlyOpenInventory}
            render={(arrayHelpers: ArrayHelpers) => (
              <>
                <CustomInventory open={customItemModelOpen} handleClose={this.closeCustomItemModal} onSave={this.onCreateItem(arrayHelpers)} />

                {/*
                // @ts-ignore */}
                <CustomInventory open={editCustomItemIndex !== null} editItem={editCustomItemIndex !== null ? values["Custom" + currentlyOpenInventory][editCustomItemIndex] : undefined} handleClose={() => this.setState({ editCustomItemIndex: null })} onSave={this.saveCustomItem(editCustomItemIndex, arrayHelpers)} />
              </>
            )}
          />

          <Grid item xs={12}>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <FormattedMessage id="ITEM" />
                  </TableCell>
                  <TableCell align="right" padding="checkbox">
                    <FormattedMessage id="QUANTITY" />
                  </TableCell>
                  <TableCell align="right" padding="checkbox">
                    <FormattedMessage id="ACTIONS" />
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <FieldArray
                  name={currentlyOpenInventory}
                  render={(arrayHelpers: ArrayHelpers) => (
                    selectedItemList && selectedItemList.length > 0 ? (
                      selectedItemList
                        .map((item, index) => ({ originalIndex: index, ...item }))
                        // .filter(this.filterShowList(currentlyOpen))
                        .map(item => {
                          const furniture = this.getCorrespondingFurnitureItem(item)
                          return (
                            <TableRow key={item.originalIndex}>
                              <TableCell padding="checkbox">
                                <FormattedMessage id={furniture.NameTextKey} />

                                {item.FSize ? <Chip size="small" label={intl.formatMessage({ id: item.FSize.NameTextKey })} /> : null}
                                {item.FMaterial ? <Chip size="small" label={intl.formatMessage({ id: item.FMaterial.NameTextKey })} /> : null}
                              </TableCell>

                              <TableCell align="right" padding="checkbox">
                                {item.Amount} Stk.
                              </TableCell>

                              <TableCell padding="none" align="right" style={{ whiteSpace: "nowrap" }}>
                                <IconButton onClick={() => this.removeOneitem(item, item.originalIndex, arrayHelpers)} classes={{ root: classes.buttonSmallPadding }}>
                                  <RemoveCircleOutlineIcon />
                                </IconButton>

                                <IconButton onClick={() => arrayHelpers.remove(item.originalIndex)} classes={{ root: classes.buttonSmallPadding }}>
                                  <DeleteForeverIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        })
                    ) : null
                  )}
                />

                {(selectedItemList && selectedItemList.length > 0) || (selectedCustomItemList && selectedCustomItemList.length > 0) ? (
                  selectedCustomItemList && selectedCustomItemList.length > 0 ? (
                    <TableRow>
                      <TableCell padding="none" colSpan={5} align="center">
                        <IntlTypography style={{ paddingTop: 5, paddingBottom: 5 }} color="textSecondary">CUSTOM_ITEMS</IntlTypography>
                        <Divider />
                      </TableCell>
                    </TableRow>
                  ) : null
                ) :
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <IntlTypography>EMPTY</IntlTypography>
                    </TableCell>
                  </TableRow>
                }

                <FieldArray
                  name={"Custom" + currentlyOpenInventory}
                  render={(arrayHelpers: ArrayHelpers) => (
                    selectedCustomItemList && selectedCustomItemList.length > 0 ? (
                      selectedCustomItemList.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell padding="checkbox">
                            {item.Name}

                            <Typography variant="caption" color="textSecondary">{item.Description}</Typography>
                          </TableCell>

                          <TableCell align="right" padding="checkbox">
                            {item.Amount} Stk.
                          </TableCell>

                          <TableCell padding="none" align="right" style={{ whiteSpace: "nowrap" }}>
                            {/* Implement feature to make valid remove and  */}
                            {/* <IconButton onClick={() => this.removeOneitem(item, index, arrayHelpers)} classes={{ root: classes.buttonSmallPadding }}>
                              <RemoveCircleOutlineIcon />
                      </IconButton>*/}

                            <IconButton onClick={() => this.setState({ editCustomItemIndex: index})} classes={{ root: classes.buttonSmallPadding }}>
                              <EditIcon />
                            </IconButton>

                            <IconButton onClick={() => arrayHelpers.remove(index)} classes={{ root: classes.buttonSmallPadding }}>
                              <DeleteForeverIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : null
                  )}
                />
              </TableBody>
            </Table>
          </Grid>
        </Form>
      </Grid>
    )
  }
}

export default withWidth()(
  injectIntl(
    withStyles(styles, { name: "MoveShop" })(
      withResource(
        withFormik<_IProps, IInventars>({
          mapPropsToValues: props => props.inventory,
          handleSubmit: async (values, actions) => {
            try {
              console.log("H2I")
              await actions.props.onChangeAndSave(values)

              actions.setSubmitting(false)

              actions.resetForm()
              actions.props.nextPage()
            } catch (e) {
              actions.setStatus(e)
            }
          }
        })(Inventory)
      )
    )
  )
)
