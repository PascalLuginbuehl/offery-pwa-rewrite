import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment } from '@material-ui/core'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource';
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps } from 'formik';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';

import PageHeader from '../../components/PageHeader';
import FormikSimpleSelect from '../../components/FormikFields/FormikSimpleSelect';
import { nullLiteral } from '@babel/types';
const styles = (theme: Theme) =>
  createStyles({

  })


interface Values {
  templateCategoryId: number | null
  templateId: number | null
}

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  nextPage: () => void
  // onSaveAndNextPage: (templateCategoryId: number, type: number, outAddressId: number, inAddressId: number) => Promise<any>
}

class GenerateOffer extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { values, isSubmitting, status, resource, selectedCompany } = this.props
    console.log(values)
    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="GENERATE_OFFER" />

          <Field
            label="TEMPLATE_CATEGORY"
            name="templateCategoryId"
            component={FormikSimpleSelect}
            options={selectedCompany.OfferTemplateCategories.map(e => ({ label: e.NameTextKey, value: e.OfferTemplateCategoryId }))}
          />

          {
            values.templateCategoryId !== null ?
            <Field
              label="TEMPLATE"
              name="templateId"
              component={FormikSimpleSelect}
              notTranslated
              options={selectedCompany.OfferTemplateCategories[0].OfferTemplates.map(e => ({ label: e.DocName, value: e.OfferTemplateId }))}
            />
            : null
          }

          {status && status.msg && <div>{status.msg}</div>}

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withResource(
    withFormik<Props, Values>({
      validationSchema: Yup.object().shape({
        // email: Yup.string()
        //   .email()
        //   .required(),
      }),

      mapPropsToValues: props => ({ templateCategoryId: null, templateId: null }),

      handleSubmit: async (values, actions) => {
        // console.log(values)
        // // actions.props.
        // await actions.props.onChangeAndSave(values.cleaningService, values.moveOut)
        // actions.setSubmitting(false)
        // actions.props.nextPage()
      },
    })(GenerateOffer)
  )
)
