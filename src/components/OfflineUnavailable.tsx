import React, { ReactNode } from "react"
import { Typography, Button } from "@material-ui/core"
import IntlTypography from "./Intl/IntlTypography"
import { FormattedMessage } from "react-intl"

export default function OfflineUnavailable({ offline, children, nextPage}: {offline: boolean; children: ReactNode; nextPage?: () => void}) {
  // console.log(nextPage)
  // console.log(nextPage !== undefined)
  return <>
    {children}
    {
      offline ?
        <div style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,.7)",
          position: "absolute",
          top: 0}
        }>
          <Typography style={{
            color: "white",
            position: "absolute",
            top: 200,
            left: "50%",
            transform: "translate(-50%, 0)",
          }}>
            <IntlTypography component="span">
              OFFLINE_NOT_AVAILABLE
            </IntlTypography>
            &nbsp;
            {nextPage ? <Button onClick={() => nextPage()} variant="contained" color="primary"><FormattedMessage id="NEXT" /></Button> : null}
          </Typography>
        </div>
        :
        null
    }
  </>
}
