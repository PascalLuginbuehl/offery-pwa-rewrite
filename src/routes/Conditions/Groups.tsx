import * as React from 'react'
import { Divider, Grid } from '@material-ui/core';
import IntlTypography from '../../components/Intl/IntlTypography';
import FormikDivider from '../../components/FormikFields/FormikDivider';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { GridSize } from '@material-ui/core/Grid';

const FormikGroups: React.ComponentType<{ label: string, children: React.ReactNode } & Partial<Record<Breakpoint, boolean | GridSize>>> = ({children, label, xs, sm, md, lg, xl}) => (
  <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
    <Grid container spacing={1}>
      <FormikDivider />

      <Grid item xs={12}>
        <IntlTypography variant="subtitle2">{label}</IntlTypography>
      </Grid>

      {children}
    </Grid>
  </Grid>
)

export default FormikGroups


