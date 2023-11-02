import React from 'react'
import { ShopLayout } from '../../components/layouts'
import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid , GridColDef,GridValueGetterParams} from '@mui/x-data-grid';
import NextLink from 'next/link';

const columns: GridColDef[] = [
    {field:'id', headerName: 'ID', width: 100},
    {field:'fullname', headerName: 'Nombre Completo', width: 300},
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Nuestra informacion si esta pagada la orden o no',
        width: 200,
        renderCell: ( params) => {
            return(
                params.row.paid ?
                <Chip color='success' label='Pagada' variant='outlined'/>
                : <Chip color='error' label='No Pagada' variant='outlined'/>
            )
        }
    },
    {   field: 'orden',
        headerName: 'Ver orden',
        width: 200,
        sortable: false,
        renderCell: ( params) => {
        return(
                <Link underline='always'
                href={`/orders/${params.row.id}`} component={NextLink}> orden</Link>
            )
    }}
]

const rows = [
    {id:1, paid:true, fullname: 'Fernando Herrera'},
    {id:2, paid:false, fullname: 'Melissa Flores'},
    {id:3, paid:true, fullname: 'Hernando Vallej'},
    {id:4, paid:false, fullname: 'Emin Reyes'},
    {id:5, paid:true, fullname: 'Natalia Herrera'}
]

 const HistoryPage = () => {
  return (
    <ShopLayout title={'HIstorial de ordenes'} pageDiscription={'Historial de ordenes del cliente'}>
        <Typography variant='h1'>Historial de ordenes </Typography>
        <Grid container>
            <Grid item xs={12} sx={{height:650, width:'100%'}}>
                <DataGrid columns={columns} rows={rows}/>

            </Grid>
        </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session:any = await getServerSession(ctx.req);

    if(!session){
        return {
            props: {
                redirect:'/auth/login?p=/orders/history',
                permanet: false
            }
        }
    }
    return {
        props: {
            id: session.user._id
        }
    }
}


export default HistoryPage
