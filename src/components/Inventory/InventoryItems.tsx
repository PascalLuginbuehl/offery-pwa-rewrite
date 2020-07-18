import { createStyles, Grid, Theme, WithStyles, withStyles, IconButton, ButtonBase, Paper,    ButtonGroup, Button,  Collapse } from "@material-ui/core"
import * as React from "react"

import IntlTypography from "../Intl/IntlTypography"
import { FormattedMessage } from "react-intl"
import {  IFurniture } from "../../interfaces/IResource"
import MoreVertIcon from "@material-ui/icons/MoreVert"

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
    },
    fullButton: {
      width: "100%"
    },
    fullPaper: {
      maxHeight: 56,
      width: "100%",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    moreFurnitureOptions: {
      width: "100%",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    moreButton: {
      position: "absolute",
      right: 0,
      top: 0,
    },
    buttonGroupPadding: {
      padding: 4,
    },
    buttonRootText: {
      textTransform: "none"
    },
  })

interface State {
  moreOpen: boolean
  selectedMaterialId: number | null
  selectedSizeId: number | null
}

interface Props extends WithStyles<typeof styles> {
  onSelect: (FSizeId: number | null, FMaterialId: number | null) => void
  furniture: IFurniture
}

let lastTouchEnd = 0

class InventoryItems extends React.Component<Props, State> {
  state: State = {
    moreOpen: false,
    selectedSizeId: null,
    selectedMaterialId: null,
  }

  // handleOpenAmount = (event: React.SyntheticEvent) => {
  //   event.stopPropagation()

  //   this.setState({ amountOpen: 1 })
  // }

  // handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const prasedNumber: number = parseInt(event.target.value)

  //   if (prasedNumber !== NaN) {
  //     this.setState({ amount: prasedNumber })
  //   }
  // }

  toggleMore = (event: React.MouseEvent) => {
    this.setState({ moreOpen: !this.state.moreOpen})
    event.stopPropagation()
  }

  public render() {
    const { classes, furniture, onSelect } = this.props
    const { moreOpen, selectedSizeId, selectedMaterialId } = this.state

    function handleIOSClick(event: React.TouchEvent<any>) {
      const now = (new Date()).getTime()
      if (now - lastTouchEnd <= 300) {

        // Do onSelect here because onClick is never called
        onSelect(null, null)
        event.preventDefault()
      }

      lastTouchEnd = now
    }

    function onClickWrapper () {
      onSelect(null, null)
    }

    return (
      <>
        <Grid item xs={4} sm={3} md={3} lg={2} className={classes.root}>
          <ButtonBase className={classes.fullButton}>
            <Paper elevation={1} className={classes.fullPaper} onClick={onClickWrapper} onTouchEnd={handleIOSClick}>
              <IntlTypography noWrap>{furniture.NameTextKey}</IntlTypography>
            </Paper>
          </ButtonBase>

          {furniture.FMaterials.length > 0 || furniture.FSizes.length > 0 ? (
            <IconButton className={classes.moreButton} size="small" onClick={this.toggleMore}>
              <MoreVertIcon style={{ transition: "0.3s ease-in-out", transform: moreOpen ? "rotate(90deg)" : "rotate(0deg)" }} />
            </IconButton>
          ) : null}
        </Grid>

        {moreOpen ? (
          <Grid item xs={12}>
            <Collapse in={moreOpen}>
              <Paper elevation={1} className={classes.moreFurnitureOptions}>
                {furniture.FMaterials.length > 0 ? (
                  <ButtonGroup className={classes.buttonGroupPadding}>
                    {selectedMaterialId === null ? (
                      <Button color="primary" variant="contained" classes={{ root: classes.buttonRootText }}>
                        <FormattedMessage id="NOT_SET" />
                      </Button>
                    ) : (
                      <Button onClick={() => this.setState({ selectedMaterialId: null })} classes={{ root: classes.buttonRootText }}>
                        <FormattedMessage id="NOT_SET" />
                      </Button>
                    )}

                    {furniture.FMaterials.map((e, index) => {
                      if (e.FMaterialId == selectedMaterialId) {
                        return (
                          <Button key={index} color="primary" variant="contained" classes={{ root: classes.buttonRootText }}>
                            <FormattedMessage id={e.NameTextKey} />
                          </Button>
                        )
                      } else {
                        return (
                          <Button key={index} onClick={() => this.setState({ selectedMaterialId: e.FMaterialId })} classes={{ root: classes.buttonRootText }}>
                            <FormattedMessage id={e.NameTextKey} />
                          </Button>
                        )
                      }
                    })}
                  </ButtonGroup>
                ) : null}

                {furniture.FSizes.length > 0 ? (
                  <ButtonGroup>
                    {selectedSizeId === null ? (
                      <Button color="primary" variant="contained" classes={{ root: classes.buttonRootText }}>
                        <FormattedMessage id="NOT_SET" />
                      </Button>
                    ) : (
                      <Button onClick={() => this.setState({ selectedSizeId: null })} classes={{ root: classes.buttonRootText }}>
                        <FormattedMessage id="NOT_SET" />
                      </Button>
                    )}
                    {furniture.FSizes.map((e, index) => {
                      if (e.FSizeId == selectedSizeId) {
                        return (
                          <Button key={index} color="primary" variant="contained" classes={{ root: classes.buttonRootText }}>
                            <FormattedMessage id={e.NameTextKey} />
                          </Button>
                        )
                      } else {
                        return (
                          <Button key={index} onClick={() => this.setState({ selectedSizeId: e.FSizeId })} classes={{ root: classes.buttonRootText }}>
                            <FormattedMessage id={e.NameTextKey} />
                          </Button>
                        )
                      }
                    })}
                  </ButtonGroup>
                ) : null}

                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: "0 4px" }}
                  onClick={() => {
                    onSelect(selectedSizeId, selectedMaterialId)
                    this.setState({ moreOpen: false, selectedMaterialId: null, selectedSizeId: null })
                  }}
                >
                  <FormattedMessage id="ADD" />
                </Button>
              </Paper>
            </Collapse>
          </Grid>
        ) : null}
      </>
    )
  }
}

export default withStyles(styles)(InventoryItems)
