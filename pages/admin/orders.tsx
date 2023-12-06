import React from 'react'
import useSWR from 'swr'
import { IOrder, IUser } from '../../interfaces'
import { AdminLayout } from '../../components/layouts';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterParams } from '@mui/x-data-grid';
import { ConfirmationNumberOutlined } from '@mui/icons-material';

const columns : GridColDef[]  = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombres', width: 250 },
    { field: 'total', headerName: 'Monto Total', width: 250 },
    { field: 'isPaid'
        , headerName: 'Pagada'
        , width: 250
        , renderCell: ({row}: GridValueGetterParams) => {
            return row.isPaid ?
                  ( <Chip variant='outlined' label='Pagada' color='success' />) 
                : ( <Chip variant='outlined' label='Pendiente' color='error'/>)
        } 
    },
    { field: 'numProducts'
        , headerName: 'No.Productos'
        , width: 150 , align:'center' },
    { field: 'check'
        , headerName: 'Ver orden'
        , renderCell: ( {row}: GridValueGetterParams )=> {
            return (
                <a href={`/`} > Ver Orden</a>
            )
        }
    },
    { field: 'createdAt', headerName: 'Creada en'
        , width: 250 },
]

const ordersPage = () => {

    const {data, error } = useSWR< IOrder[] > ('/api/admin/orders');
    
    if(!data && !error ) (<></>);

    console.log(data);
    const rows:GridRowsProp = data?.map(order=>({
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
        icon={<ConfirmationNumberOutlined /> }>
        <Grid item xs={12} sx={{ height:650, width: '100%' }}>
            <DataGrid
                rows={rows} 
                columns={columns}
            />
        </Grid>
    </AdminLayout>
  )
}

export default ordersPage