import React, { useState , useEffect} from 'react'
import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts'
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupAddOutlined, ProductionQuantityLimits } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'
import { SummaryTile } from '../../components/admin'
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage = () => {

  //stale-while-revalidate
  //  estrategia para devolver primero los datos del caché (obsoletos),
  // luego enviar la solicitud de recuperación (revalidar) 
  //y finalmente obtener los datos actualizados.
  //Se utiliza cada 30 segundos 
  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard',{
    refreshInterval: 30 * 1000 //30 segundos
  });
 
  const [refreshIn, setRefreshIn] = useState (30); // 30 seg
  //No se puede colocar hooks de manera condinicional

  //cada segundo resta -1, al useState a 
  //30 seg vuelve a establecer 30. 
  useEffect( () => {
    const interval = setInterval(()=>{
      console.log('Tick');
      setRefreshIn( refreshIn => refreshIn>0 ? refreshIn-1: 30);
    }, 1000); //1seg
    //Efecto siempre se ejecuta
    //Limpia el efecto/ termina la ejecucion
    return () => clearInterval(interval)
  }, []);

  //Carga x 1mera no existe data
  if(!error && !data){
    return <></>
  }

  if( error ){
    console.log(error);
    return <Typography> Error al cargar la información. </Typography>
  }



  return (
    <AdminLayout
    title= 'Dashboard'
    subTitle= 'Estadisticas generales'
    icon={ <DashboardOutlined/> }>
      <Grid container spacing={2}>
        
        <SummaryTile 
            title={ data?.numberOfOrders ? data.numberOfOrders : '-' } 
            subTitle='Ordenes totales' 
            icon={ <CreditCardOutlined
                    color='secondary' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={data?.paidOrders ? data.paidOrders : '-'} 
            subTitle='Ordenes pagadas' 
            icon={ <AttachMoneyOutlined
                    color='success' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={data?.notPaidOrders ? data.notPaidOrders : '-'} 
            subTitle='Ordenes pendientes' 
            icon={ <CreditCardOffOutlined
                    color='error' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={ data?.numberOfClients ? data.numberOfClients : '-'} 
            subTitle='Clientes' 
            icon={ <GroupAddOutlined
                    color='success' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={data?.numberOfProducts ?  data?.numberOfProducts : '-'} 
            subTitle='Productos' 
            icon={ <CategoryOutlined
                    color='secondary' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={ data?.productsWithNoInventory ? data.productsWithNoInventory : '-'} 
            subTitle='Productos sin Existencias' 
            icon={ <CancelPresentationOutlined
                    color='secondary' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={ data?.lowInventory ? data.lowInventory : '-'} 
            subTitle='Bajo inventario' 
            icon={ <ProductionQuantityLimits
                    color='warning' sx={{fontSize: 40}}
                    />
                  } 
          />
        <SummaryTile 
            title={refreshIn} 
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