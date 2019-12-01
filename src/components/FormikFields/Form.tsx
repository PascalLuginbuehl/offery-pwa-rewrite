import * as React from 'react'
import { Form as FormikForm, FormikFormProps, useFormikContext } from 'formik'
import Grid from '@material-ui/core/Grid'
import withWidth, { WithWidthProps } from '@material-ui/core/withWidth'
import { withStyles, createStyles, WithStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'
import { Prompt } from 'react-router'
import { injectIntl, InjectedIntlProps } from 'react-intl'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: 8,
      // [theme.breakpoints.down('xs')]: {
      //   padding: 4,
      // }
    }
  })

interface Props extends FormikFormProps, WithWidthProps, WithStyles<typeof styles>, InjectedIntlProps {

}

const Form: React.ComponentType<Props> = ({ classes, intl, width, children }: Props) => {
  const { dirty } = useFormikContext()

  const handleUnload = (e: BeforeUnloadEvent) => {
    console.log("beforeunload called")

    if (dirty) {
      // Cancel the event
      e.preventDefault()

      // Chrome requires returnValue to be set
      e.returnValue = intl.formatMessage({ id: "UNSAVED_CHANGES_CONTINUE" })
    }
  }

  React.useEffect(() => {
    window.addEventListener("beforeunload", handleUnload)

    return () => window.removeEventListener("beforeunload", handleUnload)
  })

  return (
    <FormikForm>
      <Prompt when={dirty} message={() => intl.formatMessage({ id: "UNSAVED_CHANGES_CONTINUE" })} />

      <Grid container spacing={width == "xs" ? 1 : 2} className={classes.root}>
        {children}
      </Grid>
    </FormikForm>
  )
}

export default injectIntl(withStyles(styles)(withWidth()(Form)))
