import React from "react"
import { Snackbar, Button } from "@material-ui/core"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"


interface Props {
  swUpdateEventGenerator: Promise<ServiceWorkerRegistration>
}

export default function UpdateServiceWorker(props: Props) {
  const [updateServiceFunction, setUpdateServiceFunction] = useState<(() => void) | null>(null)
  const { swUpdateEventGenerator } = props


  useEffect(() => {
    swUpdateEventGenerator.then((serviceWorkerRegistration) => {
      console.log("Update available", serviceWorkerRegistration)


      const updateServiceWorker = () => {
        const registrationWaiting = serviceWorkerRegistration.waiting
        console.log("updateServiceWorker called")
        if (registrationWaiting) {
          registrationWaiting.postMessage({ type: "SKIP_WAITING" })

          registrationWaiting.addEventListener("statechange", e => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            if (e.target.state === "activated") {
              window.location.reload()
            }
          })
        }
      }

      setUpdateServiceFunction(updateServiceWorker)
    }).catch(() => { })
  })

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={!!updateServiceFunction}
      autoHideDuration={6000}
      onClose={() => updateServiceFunction ? updateServiceFunction() : null}
      message={<FormattedMessage id="NEW_FRONTEND_VERSION_DETECTED" />}
      action={
        <>
          <Button color="secondary" size="small" onClick={() => updateServiceFunction ? updateServiceFunction() : null}>
            <FormattedMessage id="UPDATE_CTRL_FFIVE" />
          </Button>
        </>
      }
    />
  )
}
