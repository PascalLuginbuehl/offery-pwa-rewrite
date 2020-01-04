import React, { Component } from "react"
import { ReactComponent as Box } from "./box.svg"
import { ReactComponent as Warehouse } from "./warehouse.svg"
import { Avatar, Grid } from "@material-ui/core"
import LocalShippingIcon from "@material-ui/icons/LocalShipping"
import DeleteIcon from "@material-ui/icons/Delete"
import InvertColorsIcon from "@material-ui/icons/InvertColors"
import { Button } from "@material-ui/core"
import { IServices } from "../../../interfaces/IService"
import { lightGreen, orange, yellow, brown, lightBlue } from "@material-ui/core/colors"

interface _Props {
  services: IServices
}


function Icons({ children }: { children: React.ReactNode }) {
  return (
    {children}

  )
}
export default function ServicesComponent({ services }: _Props) {
  return (
    <Grid spacing={1} container wrap="nowrap">
      {
        services.HasMoveServiceEnabled ?
          <Grid item>
            <Avatar style={{background: lightGreen.A700 }}>
              <LocalShippingIcon fill="black" />
            </Avatar>
          </Grid>
          : null
      }
      {
        services.HasPackServiceEnabled ?
          <Grid item>
            <Avatar style={{ background: orange["500"] }}>
              <Box height="24" fill="white" />
            </Avatar>
          </Grid>
          : null
      }
      {
        services.HasStorageServiceEnabled ?
          <Grid item>
            <Avatar style={{ background: yellow["600"] }}>
              <Warehouse height="24" fill="white" />
            </Avatar>
          </Grid>
          : null
      }
      {
        services.HasDisposalServiceEnabled ?
          <Grid item>
            <Avatar style={{ background: brown["300"] }}>
              <DeleteIcon />
            </Avatar>
          </Grid>
          : null
      }
      {
        services.HasCleaningServiceEnabled ?
          <Grid item>
            <Avatar style={{ background: lightBlue["500"] }}>
              <InvertColorsIcon />
            </Avatar>
          </Grid>
          : null
      }
    </Grid>
  )
}
