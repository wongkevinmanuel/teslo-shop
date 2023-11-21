import React from 'react'
import { AdminLayout } from '../../components/layouts'
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupAddOutlined, ProductionQuantityLimits } from '@mui/icons-material'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import { SummaryTile } from '../../components/admin'

const DashboardPage = () => {
  return (
    <AdminLayout
    title= 'Dashboard'
    subTitle= 'Estadisticas generales'
    icon={ <DashboardOutlined/> }>
      <Grid container spacing={2}>
        
        <SummaryTile 
            title={50} 
            subTitle='Ordenes totales' 
            icon={ <CreditCardOutlined
                    color='secondary' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={50} 
            subTitle='Ordenes pagadas' 
            icon={ <AttachMoneyOutlined
                    color='success' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={0} 
            subTitle='Ordenes pendientes' 
            icon={ <CreditCardOffOutlined
                    color='error' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={0} 
            subTitle='Clientes' 
            icon={ <GroupAddOutlined
                    color='success' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={0} 
            subTitle='Productos' 
            icon={ <CategoryOutlined
                    color='secondary' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={0} 
            subTitle='Productos sin Existencias' 
            icon={ <CancelPresentationOutlined
                    color='secondary' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={0} 
            subTitle='Bajo inventario' 
            icon={ <ProductionQuantityLimits
                    color='warning' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={0} 
            subTitle='Actualizacion en:' 
            icon={ <AccessTimeOutlined
                    color='secondary' sx={{fontSize: 40}}
                    />
                  } 
          />
      </Grid>

    </AdminLayout>
  )
}

export default DashboardPage;