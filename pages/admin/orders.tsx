import { ConfirmationNumberOutlined } from '@mui/icons-material';

import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterParams , GridRenderCellParams} from '@mui/x-data-grid';

import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

import { IOrder, IUser } from '../../interfaces'
import { AdminLayout } from '../../components/layouts';

const OrdersPage = () => {

    const {data, error } = useSWR< IOrder[] > ('/api/admin/orders');
    
    const [ orders , setOrders] = useState< IOrder[] >([]);
    useEffect(()=> { // dispara establecer data en agreglo
        if(data){
            setOrders(data);
        }
    },[data]) //agreglo de dependencia

    if(!data && !error ) (<></>);

    const columns : GridColDef[]  = [
        { field: 'id', headerName: 'Orden ID', width: 250 },
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombres', width: 300 },
        { field: 'total', headerName: 'Monto Total', width: 150},
        { field: 'isPaid'
            , headerName: 'Pagada'
            , width: 125
            , renderCell: ({row}: GridRenderCellParams<any, boolean> ) => {
                return row.isPaid ?
                      ( <Chip variant='outlined' label='Pagada' color='success' />) 
                    : ( <Chip variant='outlined' label='Pendiente' color='error'/>)
            } 
        },
        { field: 'numProducts', headerName: 'No.Productos', width: 125 , align:'center' },
        { field: 'check'
            , headerName: 'Ver orden'
            , renderCell: ( {row}: GridRenderCellParams<any, string> )=> {
                return (
                    <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer' > Ver Orden</a>
                )
            }
        },
        { field: 'createdAt', headerName: 'Creada en' , width: 300 },
    ];
    
    const rows:GridRowsProp = orders.map(order=>({
        id          : order._id, 
        email       : (order.user as IUser).email,
        name        : (order.user as IUser).name,
        total       : order.total,
        isPaid      : order.isPaid,
        numProducts : order.numberOfItems,
        createdAt   : order.createdAt,
    }));

  return (
    <AdminLayout
        title={'Ordenes'} subTitle={'Mantenimiento de ordenes'} 
        icon={<ConfirmationNumberOutlined className='fadeIn'/> }>
        <Grid item xs={12} sx={{ height:650, width: '100%' }}>
            <DataGrid
                rows={rows} 
                columns={columns}
            />
        </Grid>
    </AdminLayout>
  )
}

export default OrdersPage