import React from 'react'
import { AdminLayout } from '../../components/layouts'
import { CreditCardOffOutlined, DashboardOutlined } from '@mui/icons-material'
import { Card, CardContent, Grid, Typography } from '@mui/material'

const DashboardPage = () => {
  return (
    <AdminLayout
    title= 'Dashboard'
    subTitle= 'Estadisticas generales'
    icon={ <DashboardOutlined/> }>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={3}>
          <Card sx={{display:'flex'}}>
            <CardContent sx={{width:50, display:'flex', justifyContent:'center',alignItems:'center'}}>
              <CreditCardOffOutlined color="secondary" sx={{fontSize: 40}}>
              </CreditCardOffOutlined>
            </CardContent>
            <CardContent sx={{flex:'1 0 auto', display:'flex', flexDirection:'column' }}>
              <Typography variant='h3'> 50 </Typography>
              <Typography variant='caption'> Ordenes Totales </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Card sx={{display:'flex'}}>
            <CardContent sx={{width:50, display:'flex', justifyContent:'center',alignItems:'center'}}>
              <CreditCardOffOutlined color="secondary" sx={{fontSize: 40}}>
              </CreditCardOffOutlined>
            </CardContent>
            <CardContent sx={{flex:'1 0 auto', display:'flex', flexDirection:'column' }}>
              <Typography variant='h3'> 50 </Typography>
              <Typography variant='caption'> Ordenes Totales </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Card sx={{display:'flex'}}>
            <CardContent sx={{width:50, display:'flex', justifyContent:'center',alignItems:'center'}}>
              <CreditCardOffOutlined color="secondary" sx={{fontSize: 40}}>
              </CreditCardOffOutlined>
            </CardContent>
            <CardContent sx={{flex:'1 0 auto', display:'flex', flexDirection:'column' }}>
              <Typography variant='h3'> 50 </Typography>
              <Typography variant='caption'> Ordenes Totales </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Card sx={{display:'flex'}}>
            <CardContent sx={{width:50, display:'flex', justifyContent:'center',alignItems:'center'}}>
              <CreditCardOffOutlined color="secondary" sx={{fontSize: 40}}>
              </CreditCardOffOutlined>
            </CardContent>
            <CardContent sx={{flex:'1 0 auto', display:'flex', flexDirection:'column' }}>
              <Typography variant='h3'> 50 </Typography>
              <Typography variant='caption'> Ordenes Totales </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </AdminLayout>
  )
}

export default DashboardPage;