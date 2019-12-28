import React, { Component } from "react"
import box from "./box.svg"
import { Avatar } from "@material-ui/core"

interface Props {
  test: number
}

export default function ServiceIcons({ test }: Props) {

  return (
    <>
      <Avatar>
        <img src={box} alt="Logo" height="24" />
      </Avatar>
    </>
  )
}
